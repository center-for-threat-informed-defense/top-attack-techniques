const ExcelJS = require("exceljs");
const fs = require("fs");

const SOURCE_FILE = "src/data/Calculator.xlsx";
const DESTINATION_FILE = "src/data/Techniques.json";

const wb = new ExcelJS.Workbook();
// initialize new list for techniques
const techniques = [];
const subtechniques = [];
// read from techniques tab first to get the technique metadata (ID, name, etc.)
wb.xlsx.readFile(SOURCE_FILE).then(function () {
  console.log("Reading from Calculator spreadsheet...");
  const techniqueList = wb.getWorksheet("techniques");
  techniqueList.eachRow((r) => {
    if (r.number > 1) {
      const data = r.values;
      const t = {};
      t.tid = data[1];
      t.name = data[2];
      t.description = data[3];
      t.url = data[4].hyperlink;
      t.created_date = new Date(data[5]);
      t.updated_date = new Date(data[6]);
      t.version = data[7];
      t.tactics = data[8].split(", ");
      t.detection = data[9];
      t.platforms = data[10].split(", ");
      t.data_sources = data[11] ? data[11].split(", ") : "";
      t.is_subtechnique = Boolean(data[12]);
      t.supertechnique = data[13];
      t.subtechniques = [];
      t.mitigations = [];
      if (t.is_subtechnique) {
        subtechniques.push(t);
      } else {
        techniques.push(t);
      }
    }
  });
  console.log("Parsed technique metadata from Techniques tab");
  // read from mitigations tab to get a list of all mitigations
  const mitigations = [];
  const mitigationSheet = wb.getWorksheet("mitigations");
  console.log("Parsing mitigation objects... ");
  mitigationSheet.eachRow((r) => {
    if (r.number > 1) {
      const m = {};
      m.mid = r.getCell(1).value;
      m.name = r.getCell(2).value;
      m.description = r.getCell(3).value;
      m.url = r.getCell(4).value.hyperlink;
      m.created_date = new Date(r.getCell(5).value);
      m.updated_date = new Date(r.getCell(6).value);
      m.version = Number(r.getCell(7).value);

      mitigations.push(m);
    }
  });
  console.log("Parsing relationships... ");
  // read from relationships tab to assign mitigations to techniques
  const relationshipSheet = wb.getWorksheet("relationships");
  relationshipSheet.eachRow((r) => {
    if (
      r.number > 1 &&
      r.getCell(1).value &&
      r.getCell(1).value.charAt(0) === "M"
    ) {
      const mitigation = mitigations.find((m) => m.mid === r.getCell(1).value);
      if (r.getCell(5).value.includes(".")) {
        const subtechnique = subtechniques.find(
          (t) => t.tid === r.getCell(5).value
        );
        subtechnique.mitigations.push(mitigation);
      } else {
        const technique = techniques.find((t) => t.tid === r.getCell(5).value);
        technique.mitigations.push(mitigation);
      }
    }
  });
  console.log("Parsed relationships");
  // add subtechniques to techniques
  addSubtechniques(techniques, subtechniques);
  console.log("Parsed subtechniques");
  // read from the methodology tab to add scores to the technique objects
  const scoreList = wb.getWorksheet("Methodology");
  scoreList.eachRow((r) => {
    const id = r.getCell(3).value;
    if (id) {
      const technique = techniques.find((t) => t.tid == id);
      if (technique && technique.tid) {
        technique.cumulative_score = r.getCell("B").value.result;
        technique.adjusted_score = technique.cumulative_score;
        technique.has_car = !!r.getCell("N").value;
        technique.has_sigma = !!r.getCell("O").value;
        technique.has_es_siem = !!r.getCell("P").value;
        technique.has_splunk = !!r.getCell("Q").value;

        technique.cis_controls = r.getCell("R").value
          ? r.getCell("R").value.toString().split(",")
          : [];
        technique.nist_controls = r.getCell("T").value
          ? r.getCell("T").value.toString().split(",")
          : [];

        technique.process_coverage = !!parseInt(r.getCell(31).value.result);
        technique.network_coverage = !!parseInt(r.getCell(33).value.result);
        technique.file_coverage = !!parseInt(r.getCell(35).value.result);
        technique.cloud_coverage = !!parseInt(r.getCell(37).value.result);
        technique.hardware_coverage = !!parseInt(r.getCell(39).value.result);
      }
    }
  });
  console.log("Parsed scores from Methodology page");
  // export technique list to JSON
  const str = JSON.stringify(techniques, null, 4);
  fs.writeFile(DESTINATION_FILE, str, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log("Export technique data to Techniques.json");
});

function addSubtechniques(techniques, subtechniques) {
  console.log("parsing subetechniques");
  for (const subtechnique of subtechniques) {
    // const id = subtechnique.supertechnique;
    const technique = techniques.find(
      (t) => t.tid === subtechnique.supertechnique
    );
    const s = {};
    s.tid = subtechnique.tid;
    s.name = subtechnique.name;
    s.url = subtechnique.url;
    s.description = subtechnique.description;
    s.detection = subtechnique.detection;
    s.mitigations = subtechnique.mitigations;
    technique.subtechniques.push(s);
  }
}
