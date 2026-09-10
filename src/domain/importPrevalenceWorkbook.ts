import ExcelJS from "exceljs";

export interface UploadedPrevalence {
  Technique: string;
  Prevalence: number;
}

/**
 * Converts the first worksheet of an uploaded .xlsx file into prevalence data.
 * The worksheet must contain `Technique` and `Prevalence` column headers.
 */
export async function importPrevalenceWorkbook(
  workbookData: ArrayBuffer,
): Promise<UploadedPrevalence[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(workbookData as never);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("The workbook does not contain a worksheet.");
  }

  const headerRow = worksheet.getRow(1);
  const headers = new Map<string, number>();
  for (let column = 1; column <= headerRow.cellCount; column += 1) {
    headers.set(headerRow.getCell(column).text.trim(), column);
  }

  const techniqueColumn = headers.get("Technique");
  const prevalenceColumn = headers.get("Prevalence");
  if (!techniqueColumn || !prevalenceColumn) {
    throw new Error(
      "The first worksheet must include Technique and Prevalence columns.",
    );
  }

  const importedPrevalence: UploadedPrevalence[] = [];
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const technique = row.getCell(techniqueColumn).text.trim();
    const prevalenceText = row.getCell(prevalenceColumn).text.trim();

    if (!technique && !prevalenceText) {
      continue;
    }

    const prevalence = Number(prevalenceText);
    if (!technique || !Number.isFinite(prevalence)) {
      throw new Error(`Invalid prevalence data in row ${rowNumber}.`);
    }

    importedPrevalence.push({
      Technique: technique,
      Prevalence: prevalence,
    });
  }

  return importedPrevalence;
}
