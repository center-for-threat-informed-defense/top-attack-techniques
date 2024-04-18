import ExcelJS from "exceljs";
import fs from "fs";

const SOURCE_FILE = "src/data/Calculator.xlsx";
const DESTINATION_FILE = "src/data/Techniques.json";

const wb = new ExcelJS.Workbook();
// initialize new list for techniques
const techniques = [];
// read from techniques tab first to get the technique metadata (ID, name, etc.)
wb.xlsx.readFile(SOURCE_FILE).then(function () {
  console.log("Reading from Calculator spreadsheet...");
  const techniqueList = wb.getWorksheet("techniques");
  techniqueList.eachRow((r) => {
    if (r.number > 1) {
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
  console.log("Parsed technique metadata from Techniques tab");
  // read from the methodology tab to add scores to the technique objects
  const scoreList = wb.getWorksheet("Methodology");
  scoreList.eachRow((r) => {
    const id = r.getCell(3).value;
    if (id) {
      const technique = techniques.find((t) => t.id == id);
      if (technique && technique.id) {
        technique.cumulative_score = r.getCell("B").value.result;

        technique.has_car = !!r.getCell("N").value;
        technique.has_sigma = !!r.getCell("O").value;
        technique.has_es_siem = !!r.getCell("P").value;
        technique.has_splunk = !!r.getCell("Q").value;

        technique.cis_controls = r.getCell("R").value;
        technique.nist_controls = r.getCell("T").value;

        technique.process_coverage = parseInt(r.getCell(31).value.result);
        technique.network_coverage = parseInt(r.getCell(33).value.result);
        technique.file_coverage = parseInt(r.getCell(35).value.result);
        technique.cloud_coverage = parseInt(r.getCell(37).value.result);
        technique.hardware_coverage = parseInt(r.getCell(39).value.result);
      }
    }
  });
  console.log("Parsed scores from Methodology page");
  const str = JSON.stringify(techniques);
  fs.writeFile(DESTINATION_FILE, str, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log("Export technique data to Techniques.json");
});
