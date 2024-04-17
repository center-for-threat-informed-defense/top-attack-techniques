const ExcelJS = require("exceljs");
const fs = require("fs");

const SOURCE_FILE = "src/data/Calculator.xlsx";
const DESTINATION_FILE = "src/data/Techniques.json";

const wb = new ExcelJS.Workbook();
const techniques = [];
wb.xlsx.readFile(SOURCE_FILE).then(function () {
  console.log("this is working");
  const techniqueList = wb.getWorksheet("techniques");
  techniqueList.eachRow((r) => {
    if (r.number !== 0) {
      const data = r.values;
      const t = {};
      t.id = data[1];
      t.name = data[2];
      t.description = data[3];
      t.url = data[4];
      t.createdDate = new Date(data[5]);
      t.updatedDate = new Date(data[6]);
      t.version = data[7];
      t.tactics = data[8].split(", ");
      t.detection = data[9];
      t.platforms = data[10].split(", ");
      t.data_sources = data[11] ? data[11].split(", ") : "";
      t.is_subtechnique = Boolean(data[12]);
      t.supertechnique = data[13];
      techniques.push(t);
    }
  });
  techniques.splice(0, 1);
  // add scores to the technique objects
  const scoreList = wb.getWorksheet("Methodology");
  scoreList.eachRow((r) => {
    const id = r.getCell(3).value;
    if (id) {
      const technique = techniques.find((t) => t.id == id);
      if (technique && technique.id) {
        technique.cumulative_score = r.getCell("B").value.result;
        technique.actionability_score = r.getCell("V").value.result;
        technique.has_car = !!r.getCell("N").value;
        technique.has_sigma = !!r.getCell("O").value;
        technique.has_es_siem = !!r.getCell("P").value;
        technique.has_splunk = !!r.getCell("Q").value;

        technique.cis_controls = r.getCell("R").value;
        technique.nist_controls = r.getCell("T").value;

        technique.process_coverage = r.getCell(31).value.result;
        technique.network_coverage = r.getCell(33).value.result;
        technique.file_coverage = r.getCell(35).value.result;
        technique.cloud_coverage = r.getCell(37).value.result;
        technique.hardware_coverage = r.getCell(39).value.result;
      }
    }
  });
  const str = JSON.stringify(techniques);
  fs.writeFile(DESTINATION_FILE, str, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
});
