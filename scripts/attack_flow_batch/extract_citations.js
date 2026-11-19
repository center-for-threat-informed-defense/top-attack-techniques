
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

async function main() {
  const dataDir = path.join(__dirname, "data");

  const files = fs.readdirSync(dataDir).filter(
    file => file.toLowerCase().endsWith(".xlsx") &&
            !file.startsWith("~$")
  );

  if (files.length !== 1) {
    throw new Error(
      `Expected one Excel workbook, found ${files.length}.`
    );
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(dataDir, files[0]));

  const sheet = workbook.getWorksheet("citations");

  if (!sheet) {
    throw new Error("Citations worksheet not found.");
  }

  const reports = new Map();
  let skipped = 0;

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const reference = row.getCell(1).text.trim();
    const citation = row.getCell(2).text.trim();
    const urlText = row.getCell(3).hyperlink ||
                    row.getCell(3).text.trim();

    try {
      const url = new URL(urlText);

      if (!["http:", "https:"].includes(url.protocol)) {
        skipped++;
        return;
      }

      const normalized = url.toString();

      if (!reports.has(normalized)) {
        reports.set(normalized, {
          url: normalized,
          references: [],
          citations: []
        });
      }

      const report = reports.get(normalized);

      if (reference && !report.references.includes(reference)) {
        report.references.push(reference);
      }

      if (citation && !report.citations.includes(citation)) {
        report.citations.push(citation);
      }
    } catch {
      skipped++;
    }
  });

  const output = [...reports.values()];

  const outputPath = path.join(dataDir, "report_manifest.json");

  fs.writeFileSync(
    outputPath,
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log("Workbook:", files[0]);
  console.log("Unique report URLs:", output.length);
  console.log("Skipped invalid/missing URLs:", skipped);
  console.log("Manifest saved:", outputPath);
}

main().catch(error => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});
