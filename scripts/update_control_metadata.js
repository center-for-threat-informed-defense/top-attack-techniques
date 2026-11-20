const fs = require("node:fs/promises");
const path = require("node:path");
const { SaxesParser } = require("saxes");

// Official NIST OSCAL catalog. Standalone CLI arguments can override the
// NIST JSON and CIS XML sources, respectively, with URLs or local files.
const NIST_CATALOG_URL =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";
// Official CIS v8 repository, linked from CISecurity/CISControls_OSCAL.
const CIS_CATALOG_URL =
  "https://api.bitbucket.org/2.0/repositories/cis-it-workspace/cis-controls-v8_oscal/src/main/src/catalogs/xml/cis-controls-v8_OSCAL-1.0.xml";
const DATA_DIRECTORY = path.resolve(__dirname, "../src/data");

/** Builds name metadata for requested base controls from NIST OSCAL JSON. */
function buildNistMetadata(document, controlCodes) {
  const metadata = Object.create(null);

  /** Collects base controls from the catalog and its nested groups. */
  function visit(container) {
    for (const control of container.controls ?? []) {
      // Prefer the standard label over zero-padded or assessment labels.
      const code = control.props?.find(
        (prop) => prop.name === "label" && !prop.class
      )?.value;
      if (
        typeof code !== "string" ||
        !/^[A-Z]{2}-\d+$/.test(code) ||
        typeof control.title !== "string" ||
        !control.title.trim()
      ) {
        throw new Error(`Invalid control label or title: ${control.id}`);
      }
      if (metadata[code]) {
        throw new Error(`Duplicate control code: ${code}`);
      }
      metadata[code] = { name: control.title.trim() };
      // Nested controls are enhancements (e.g. AC-2(1)). The calculator only
      // uses base controls, so intentionally exclude enhancements for now.
    }
    for (const group of container.groups ?? []) {
      visit(group);
    }
  }

  if (!document.catalog) {
    throw new Error("Expected an OSCAL document with a catalog property.");
  }
  visit(document.catalog);
  if (Object.keys(metadata).length === 0) {
    throw new Error("The NIST catalog contains no controls.");
  }
  return selectMetadata(metadata, controlCodes, "NIST");
}

/** Selects unique requested codes in numeric order, throwing for missing names. */
function selectMetadata(metadata, controlCodes, framework) {
  const requestedCodes = new Set(controlCodes);
  const missing = [...requestedCodes].filter((code) => !Object.hasOwn(metadata, code));
  if (missing.length) {
    throw new Error(`Missing ${framework} control names: ${missing.sort().join(", ")}`);
  }
  return Object.fromEntries(
    [...requestedCodes].map((code) => [code, metadata[code]]).sort(([a], [b]) =>
      a.localeCompare(b, "en", { numeric: true })
    )
  );
}

/** Builds name metadata for requested decimal safeguards from CIS OSCAL XML. */
function buildCisMetadata(xml, controlCodes) {
  const metadata = Object.create(null);
  const elements = [];
  const controls = [];
  const parser = new SaxesParser({ xmlns: true });
  parser.on("opentag", (tag) => {
    elements.push(tag.local);
    if (tag.local === "control") {
      controls.push({ id: tag.attributes.id?.value, title: "", depth: elements.length });
    }
  });
  /** Accumulates text within the current control's title element. */
  const collectTitle = (text) => {
    const control = controls[controls.length - 1];
    if (control && elements[control.depth] === "title") {
      control.title += text;
    }
  };
  parser.on("text", collectTitle);
  parser.on("cdata", collectTitle);
  parser.on("closetag", () => {
    if (elements.pop() !== "control") return;
    const control = controls.pop();
    // CIS decimal safeguards are the options used by the calculator.
    // Top-level numbered controls are group headings, not selectable codes.
    if (/^cisc-\d+$/.test(control.id)) return;
    const code = /^cisc-(\d+\.\d+)$/.exec(control.id)?.[1];
    const name = control.title.replace(/\s+/g, " ").trim();
    if (!code || !name) {
      throw new Error(`Invalid CIS safeguard code or title: ${control.id}`);
    }
    if (metadata[code]) {
      throw new Error(`Duplicate CIS safeguard code: ${code}`);
    }
    metadata[code] = { name };
  });
  parser.write(xml).close();
  if (Object.keys(metadata).length === 0) {
    throw new Error("The CIS catalog contains no safeguards.");
  }
  return selectMetadata(metadata, controlCodes, "CIS");
}

/** Formats nested fetch causes, including individual connection failures. */
function describeError(error) {
  const details = [];
  const seen = new Set();
  function visit(cause) {
    if (!cause || seen.has(cause)) return;
    seen.add(cause);
    const message = cause.message ?? String(cause);
    if (message) {
      details.push(cause.code ? `${cause.code}: ${message}` : message);
    }
    visit(cause.cause);
    if (Array.isArray(cause.errors)) cause.errors.forEach(visit);
  }
  visit(error);
  return [...new Set(details)].join("; ");
}

/** Reads catalog text, reporting the URL and underlying download failure. */
async function readSource(source) {
  if (/^https?:\/\//.test(source)) {
    try {
      const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText ?? ""}`.trim());
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Catalog download failed (${source}): ${describeError(error)}`, { cause: error });
    }
  }
  return fs.readFile(source, "utf8");
}

/**
 * Validates and writes metadata for the caller's NIST and CIS code sets.
 * Source and directory overrides support offline updates and testing.
 */
async function updateControlMetadata(nistControlCodes, cisControlCodes, {
  nistSource = NIST_CATALOG_URL,
  cisSource = CIS_CATALOG_URL,
  dataDirectory = DATA_DIRECTORY,
} = {}) {
  const [nistText, cisText] = await Promise.all([
    readSource(nistSource), readSource(cisSource),
  ]);
  const nistDocument = JSON.parse(nistText);
  const nist = buildNistMetadata(nistDocument, nistControlCodes);
  const cis = buildCisMetadata(cisText, cisControlCodes);

  // Validate both catalogs before replacing either local metadata file.
  for (const [framework, metadata] of [["nist", nist], ["cis", cis]]) {
    const destination = path.join(dataDirectory, `${framework}_control_metadata.json`);
    const temporary = `${destination}.tmp`;
    await fs.writeFile(temporary, `${JSON.stringify(metadata, null, 2)}\n`);
    await fs.rename(temporary, destination);
    console.log(`Updated ${Object.keys(metadata).length} ${framework.toUpperCase()} controls. Saved ${destination}`);
  }
  console.log(`NIST source: ${nistSource} (catalog ${nistDocument.catalog.metadata?.version ?? "unknown version"})`);
  console.log(`CIS source: ${cisSource}`);
  return { nist, cis };
}

if (require.main === module) {
  // Standalone updates use the same sets of codes as the technique generator.
  (async () => {
    const techniques = JSON.parse(
      await fs.readFile(path.join(DATA_DIRECTORY, "Techniques.json"), "utf8")
    );
    const nistControlCodes = new Set(techniques.flatMap((t) => t.nist_controls ?? []));
    const cisControlCodes = new Set(techniques.flatMap((t) => t.cis_controls ?? []));
    await updateControlMetadata(nistControlCodes, cisControlCodes, {
      nistSource: process.argv[2], cisSource: process.argv[3],
    });
  })().catch((error) => {
    console.error(`Unable to update control metadata: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { buildNistMetadata, buildCisMetadata, readSource, updateControlMetadata };
