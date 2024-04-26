const ExcelJS = require("exceljs");
const fs = require("fs");
const SOURCE_FILE = "src/data/Calculator.xlsx";
const DESTINATION_FILE = "src/data/Techniques.json";

(async function () {
  const wb = new ExcelJS.Workbook();
  // initialize new list for techniques
  const techniques = [];
  const subtechniques = [];
  // read from techniques tab first to get the technique metadata (ID, name, etc.)
  await wb.xlsx.readFile(SOURCE_FILE);
  console.log("Reading from Calculator spreadsheet...");
  const techniqueList = wb.getWorksheet("techniques");
  techniqueList.eachRow((r) => {
    if (r.number > 1) {
      const t = {
        tid: r.getCell(1).value,
        name: r.getCell(2).value,
        description: r.getCell(3).value,
        url: r.getCell(4).hyperlink,
        tactics: r.getCell(8).value.toString().split(", "),
        detection: r.getCell(9).value,
        platforms: r.getCell(10).value.toString().split(", "),
        data_sources: r.getCell(11).value
          ? r.getCell(11).value.toString().split(", ")
          : [],
        is_subtechnique: Boolean(r.getCell(12).value),
        supertechnique: r.getCell(13).value,
        subtechniques: [],
        mitigations: [],
      };
      if (t.is_subtechnique) {
        subtechniques.push(t);
      } else {
        techniques.push(t);
      }
    }
  });

  console.log("Parsed technique metadata from Techniques tab ");

  // // read from mitigations tab to get a list of all mitigations
  const mitigations = [];
  const mitigationSheet = wb.getWorksheet("mitigations");
  console.log("Parsing mitigation objects... ");
  mitigationSheet.eachRow((r) => {
    if (r.number > 1) {
      const m = {
        mid: r.getCell(1).value,
        name: r.getCell(2).value,
        description: r.getCell(3).value,
        url: r.getCell(4).hyperlink,
      };
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
  console.log("Parsing subtechniques...");
  for (const subtechnique of subtechniques) {
    const technique = techniques.find(
      (t) => t.tid === subtechnique.supertechnique
    );
    const s = {
      tid: subtechnique.tid,
      name: subtechnique.name,
      url: subtechnique.url,
      description: subtechnique.description,
      detection: subtechnique.detection,
      mitigations: subtechnique.mitigations,
    };
    technique.subtechniques.push(s);
  }
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
          ? r.getCell("R").value.toString().replace(/\s/g, "").split(",")
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
})();
