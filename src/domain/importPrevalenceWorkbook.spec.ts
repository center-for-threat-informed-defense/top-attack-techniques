import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { importPrevalenceWorkbook } from "./importPrevalenceWorkbook";

describe("importPrevalenceWorkbook", () => {
  it("converts the first worksheet into prevalence JSON", async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prevalence");
    worksheet.addRow(["Technique", "Prevalence"]);
    worksheet.addRow(["T1001", 0.011577]);
    worksheet.addRow(["T1003", 0.326998]);

    const workbookData = await workbook.xlsx.writeBuffer();

    await expect(
      importPrevalenceWorkbook(workbookData as ArrayBuffer),
    ).resolves.toEqual([
      { Technique: "T1001", Prevalence: 0.011577 },
      { Technique: "T1003", Prevalence: 0.326998 },
    ]);
  });
});
