/* eslint-env es2021 */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { buildNistMetadata, buildCisMetadata, readSource, updateControlMetadata } = require("./update_control_metadata");

function control(code, title, children = []) {
  return {
    id: code.toLowerCase(),
    title,
    props: [
      { name: "label", value: "AC-02", class: "zero-padded" },
      { name: "label", value: code },
    ],
    controls: children,
  };
}

test("extracts base controls through groups and excludes nested enhancements", () => {
  const metadata = buildNistMetadata({
    catalog: {
      groups: [{
        id: "ac",
        title: "Access Control",
        controls: [control("AC-2", "Account Management", [
          control("AC-2(1)", "Automated System Account Management"),
        ])],
        groups: [{ controls: [control("AC-10", "Concurrent Session Control")] }],
      }],
    },
  }, new Set(["AC-10", "AC-2"]));
  assert.deepEqual(metadata, {
    "AC-2": { name: "Account Management" },
    "AC-10": { name: "Concurrent Session Control" },
  });
  assert.deepEqual(Object.keys(metadata), ["AC-2", "AC-10"]);
});

test("rejects empty catalogs, invalid controls, and duplicate codes", () => {
  assert.throws(() => buildNistMetadata({}, new Set()), /catalog property/);
  assert.throws(() => buildNistMetadata({ catalog: {} }, new Set()), /no controls/);
  for (const entry of [control("AC-2", ""), control("invalid", "Title")]) {
    assert.throws(() => buildNistMetadata({ catalog: { controls: [entry] } }, new Set(["AC-2"])), /Invalid control/);
  }
  assert.throws(() => buildNistMetadata({ catalog: { controls: [
    control("AC-2", "First"), control("AC-2", "Second"),
  ] } }, new Set(["AC-2"])), /Duplicate control code: AC-2/);
});

test("only includes requested codes and deduplicates repeated requests", () => {
  const document = { catalog: { controls: [
    control("AC-2", "Account Management"),
    control("AC-4", "Information Flow Enforcement"),
  ] } };
  assert.deepEqual(buildNistMetadata(document, ["AC-2", "AC-2"]), {
    "AC-2": { name: "Account Management" },
  });
  assert.deepEqual(buildNistMetadata(document, new Set()), {});
});

test("rejects missing codes and enhancement requests", () => {
  const document = { catalog: { controls: [
    control("AC-2", "Account Management", [
      control("AC-2(1)", "Automated System Account Management"),
    ]),
  ] } };
  assert.throws(
    () => buildNistMetadata(document, new Set(["AC-2", "AC-4"])),
    /^Error: Missing NIST control names: AC-4$/
  );
  assert.throws(
    () => buildNistMetadata(document, new Set(["AC-2(1)"])),
    /Missing NIST control names: AC-2\(1\)/
  );
});

function cisCatalog(safeguards = `
  <control id="cisc-6.8"><title>Define and Maintain Role-Based Access Control</title></control>
  <control id="cisc-6.10"><title>Example &amp;\n    Additional Safeguard</title></control>
`) {
  return `<catalog xmlns="http://csrc.nist.gov/ns/oscal/1.0">
    <control id="cisc-6"><title>Access Control Management</title>
      ${safeguards}
    </control>
  </catalog>`;
}

test("extracts only requested CIS safeguards with normalized titles and numeric ordering", () => {
  const metadata = buildCisMetadata(cisCatalog(), ["6.10", "6.8", "6.8"]);
  assert.deepEqual(metadata, {
    "6.8": { name: "Define and Maintain Role-Based Access Control" },
    "6.10": { name: "Example & Additional Safeguard" },
  });
  assert.deepEqual(Object.keys(metadata), ["6.8", "6.10"]);
  assert.deepEqual(Object.keys(buildCisMetadata(cisCatalog(), new Set(["6.8"]))), ["6.8"]);
  assert.deepEqual(buildCisMetadata(cisCatalog(), new Set()), {});
});

test("rejects missing CIS safeguards, malformed XML, empty catalogs and duplicate codes", () => {
  assert.throws(() => buildCisMetadata(cisCatalog(), ["6.1"]), /Missing CIS control names: 6.1/);
  assert.throws(() => buildCisMetadata("<catalog>", []));
  assert.throws(() => buildCisMetadata(cisCatalog(""), []), /no safeguards/);
  assert.throws(() => buildCisMetadata(cisCatalog(`
    <control id="cisc-6.8"><title>First</title></control>
    <control id="cisc-6.8"><title>Second</title></control>
  `), ["6.8"]), /Duplicate CIS safeguard code: 6.8/);
  assert.throws(() => buildCisMetadata(cisCatalog(`
    <control id="cisc-6.8"><title> </title></control>
  `), ["6.8"]), /Invalid CIS safeguard code or title/);
});

test("writes both requested metadata sets and preserves existing files on validation failure", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "control-metadata-test-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const nistSource = path.join(directory, "nist.json");
  const cisSource = path.join(directory, "cis.xml");
  const nistDestination = path.join(directory, "nist_control_metadata.json");
  const cisDestination = path.join(directory, "cis_control_metadata.json");
  await fs.writeFile(nistSource, JSON.stringify({ catalog: { controls: [
    control("AC-2", "Account Management"), control("AC-4", "Information Flow Enforcement"),
  ] } }));
  await fs.writeFile(cisSource, cisCatalog());
  const options = { nistSource, cisSource, dataDirectory: directory };
  const result = await updateControlMetadata(new Set(["AC-2"]), new Set(["6.8"]), options);
  assert.deepEqual(result, {
    nist: { "AC-2": { name: "Account Management" } },
    cis: { "6.8": { name: "Define and Maintain Role-Based Access Control" } },
  });
  const beforeNist = await fs.readFile(nistDestination, "utf8");
  const beforeCis = await fs.readFile(cisDestination, "utf8");
  assert.deepEqual(JSON.parse(beforeNist), result.nist);
  assert.deepEqual(JSON.parse(beforeCis), result.cis);
  await assert.rejects(
    updateControlMetadata(new Set(["AC-4"]), new Set(["missing"]), options),
    /Missing CIS control names/
  );
  assert.equal(await fs.readFile(nistDestination, "utf8"), beforeNist);
  assert.equal(await fs.readFile(cisDestination, "utf8"), beforeCis);
});

test("download failures include the source URL and nested network causes", async (t) => {
  const source = "https://catalog.example/controls.json";
  const failures = [
    Object.assign(new Error("getaddrinfo ENOTFOUND catalog.example"), { code: "ENOTFOUND" }),
    Object.assign(new Error("unable to get local issuer certificate"), { code: "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" }),
    new AggregateError([
      Object.assign(new Error("connect timed out"), { code: "ETIMEDOUT" }),
      Object.assign(new Error("network unreachable"), { code: "ENETUNREACH" }),
    ]),
  ];
  const fetchMock = t.mock.method(globalThis, "fetch");
  for (const cause of failures) {
    fetchMock.mock.mockImplementation(async () => {
      throw new TypeError("fetch failed", { cause });
    });
    await assert.rejects(readSource(source), (error) => {
      assert(error.message.includes(source));
      for (const detail of cause.errors ?? [cause]) {
        assert(error.message.includes(detail.code));
        assert(error.message.includes(detail.message));
      }
      assert.equal(error.cause.cause, cause);
      return true;
    });
  }
});

test("HTTP, timeout, and response-body failures retain download context", async (t) => {
  const source = "https://catalog.example/controls.json";
  const fetchMock = t.mock.method(globalThis, "fetch", async () => ({
    ok: false, status: 403, statusText: "Forbidden",
  }));
  await assert.rejects(readSource(source), /HTTP 403 Forbidden/);
  fetchMock.mock.mockImplementation(async () => {
    throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
  });
  await assert.rejects(readSource(source), (error) => {
    assert(error.message.includes(source));
    assert(error.message.includes("timeout"));
    return true;
  });
  fetchMock.mock.mockImplementation(async () => ({
    ok: true,
    async text() {
      throw new Error("response stream terminated");
    },
  }));
  await assert.rejects(readSource(source), (error) => {
    assert(error.message.includes(source));
    assert(error.message.includes("response stream terminated"));
    return true;
  });
});
