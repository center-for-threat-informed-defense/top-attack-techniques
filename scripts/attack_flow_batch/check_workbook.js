
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

async function main() {
  const dataDir = path.join(__dirname, "data");

  const files = fs.readdirSync(dataDir)
    .filter(file => file.toLowerCase().endsWith(".xlsx"));

  if (files.length === 0) {
    throw new Error("No Excel workbook found in the data folder.");
  }

  const workbookPath = path.join(dataDir, files[0]);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);

  console.log("Workbook:", files[0]);
  console.log("Worksheets:", workbook.worksheets.map(sheet => sheet.name));
  
  const citations = workbook.getWorksheet("citations");

  if (!citations) {
    throw new Error("Citations worksheet not found.");
  }

  console.log("\nCitations worksheet columns:");

  citations.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    console.log(`Column ${colNumber}: ${cell.text}`);
  });

  console.log("\nFirst citation record:");

  citations.getRow(2).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    console.log(`Column ${colNumber}: ${cell.text}`);
  });

}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
