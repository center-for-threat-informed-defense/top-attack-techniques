
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const API_ROOT = "http://127.0.0.1:8000";
const API_BASE = `${API_ROOT}/api/v1`;

const BASE_DIR = __dirname;
const OUTPUT_DIR = path.join(BASE_DIR, "output");
const JOBS_DIR = path.join(OUTPUT_DIR, "jobs");
const MANIFEST = path.join(BASE_DIR, "data", "report_manifest.json");

const START_INDEX = 405; 
const BATCH_SIZE = 200;
const POLL_INTERVAL_MS = 10000;
const MAX_WAIT_MS = 20 * 60 * 1000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${details.slice(0, 500)}`
    );
  }

  return response;
}

function reportId(url) {
  return crypto.createHash("sha256")
    .update(url)
    .digest("hex")
    .slice(0, 16);
}

function recordPath(id) {
  return path.join(JOBS_DIR, `${id}.json`);
}

function saveRecord(record) {
  const target = recordPath(record.report_id);
  const temp = `${target}.tmp`;

  fs.writeFileSync(
    temp,
    JSON.stringify(record, null, 2),
    "utf8"
  );

  fs.renameSync(temp, target);
}

function loadRecord(id) {
  const file = recordPath(id);

  if (!fs.existsSync(file)) return null;

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function importExistingJob(report) {
  const legacyPath = path.join(OUTPUT_DIR, "first_job.json");

  if (!fs.existsSync(legacyPath)) return null;

  const legacy = JSON.parse(
    fs.readFileSync(legacyPath, "utf8")
  );

  if (legacy.url !== report.url || !legacy.job_id) {
    return null;
  }

  return {
    ...legacy,
    report_id: reportId(report.url),
    references: report.references,
    citations: report.citations
  };
}

async function pollJob(record) {
  const started = Date.now();

  while (Date.now() - started < MAX_WAIT_MS) {
    const response = await apiRequest(
      `${API_BASE}/jobs/${encodeURIComponent(record.job_id)}`
    );

    const status = await response.json();

    record.status = status.status;
    record.stage = status.stage;
    record.error_code = status.error_code;
    record.error_message = status.error_message;
    record.last_checked_at = new Date().toISOString();

    saveRecord(record);

    console.log(
      `  Status: ${status.status} | Stage: ${status.stage}`
    );

    if (status.status === "completed") {
      return status;
    }

    if (status.status === "failed") {
      throw new Error(
        `Generation failed: ${status.error_code || "unknown"} ` +
        `${status.error_message || ""}`
      );
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    "Polling timed out. The job may still be running."
  );
}

async function downloadFlow(record, status) {
  if (!status.artifacts?.has_afb ||
      !status.artifacts.afb_url) {
    throw new Error("Completed job has no AFB artifact.");
  }

  const expectedPath =
    `/api/v1/jobs/${record.job_id}/artifacts/afb`;

  if (status.artifacts.afb_url !== expectedPath) {
    throw new Error("Unexpected artifact URL.");
  }

  const filename = `${record.job_id}.afb`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(outputPath) &&
      fs.statSync(outputPath).size > 0) {
    console.log("  Existing artifact found:", filename);
  } else {
    const response = await apiRequest(
      `${API_ROOT}${expectedPath}`
    );

    const bytes = Buffer.from(await response.arrayBuffer());

    if (bytes.length === 0) {
      throw new Error("Downloaded AFB artifact is empty.");
    }

    const tempPath = `${outputPath}.tmp`;
    fs.writeFileSync(tempPath, bytes);
    fs.renameSync(tempPath, outputPath);
  }

  record.status = "completed";
  record.output_file = filename;
  record.output_bytes = fs.statSync(outputPath).size;
  record.downloaded_at = new Date().toISOString();

  saveRecord(record);

  console.log(
    `  Saved: ${filename} (${record.output_bytes} bytes)`
  );
}

async function processReport(report, index) {
  const id = reportId(report.url);

  console.log(`\n[${index + 1}/${BATCH_SIZE}] ${report.url}`);

  let record = loadRecord(id);

  if (!record) {
    record = importExistingJob(report);

    if (record) {
      saveRecord(record);
      console.log("  Imported existing Earth Preta job.");
    }
  }

  if (!record) {
    record = {
      report_id: id,
      url: report.url,
      references: report.references,
      citations: report.citations,
      status: "preparing",
      created_at: new Date().toISOString()
    };

    saveRecord(record);

    const response = await apiRequest(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input_type: "url",
        url: report.url
      })
    });

    const job = await response.json();

    record.job_id = job.job_id;
    record.status = job.status;
    record.submitted_at = job.submitted_at;

    saveRecord(record);

    console.log("  Submitted job:", record.job_id);
  } else if (!record.job_id) {
    throw new Error(
      "Saved record has no job ID. Review before resubmitting."
    );
  } else {
    console.log("  Resuming job:", record.job_id);
  }

  const status = await pollJob(record);
  await downloadFlow(record, status);
}

async function main() {
  fs.mkdirSync(JOBS_DIR, { recursive: true });

  const reports = JSON.parse(
    fs.readFileSync(MANIFEST, "utf8")
  );

  console.log("Total available reports:", reports.length);
  console.log("Batch size:", BATCH_SIZE);

  await apiRequest(`${API_ROOT}/openapi.json`);
  console.log("Local Attack Flow API: CONNECTED");

  const batch = reports.slice(
  START_INDEX,
  START_INDEX + BATCH_SIZE
);

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const report = batch[i];

    try {
      await processReport(report, i);
      successful++;
    } catch (error) {
      failed++;

      console.error("  ERROR:", error.message);

      const id = reportId(report.url);
      const record = loadRecord(id) || {
        report_id: id,
        url: report.url,
        references: report.references,
        citations: report.citations
      };

      record.last_error = error.message;
      record.last_error_at = new Date().toISOString();

      saveRecord(record);
    }
  }

  console.log("\n=== BATCH SUMMARY ===");
  console.log("Successful:", successful);
  console.log("Failed or incomplete:", failed);
  console.log("Total attempted:", batch.length);
  console.log("Output folder:", OUTPUT_DIR);
}

main().catch(error => {
  console.error("Fatal error:", error.message);
  process.exitCode = 1;
});
