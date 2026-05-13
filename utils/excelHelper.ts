import * as XLSX from 'xlsx';
import { SheetData, MergedData } from '../types';

export const parseExcelFile = async (file: File): Promise<SheetData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const sheets: SheetData[] = [];

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          // Convert sheet to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length > 0) {
            const header = jsonData[0] as string[];
            // Convert rest to objects based on header
            const rows = XLSX.utils.sheet_to_json(worksheet);
            
            sheets.push({
              name: sheetName,
              data: rows,
              header: header
            });
          }
        });

        resolve(sheets);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const mergeSheets = (sheets: SheetData[]): MergedData => {
  // 1. Collect all unique headers from all sheets
  const allHeaders = new Set<string>();
  sheets.forEach(sheet => {
    sheet.header.forEach(h => allHeaders.add(h));
  });

  const mergedHeaders = Array.from(allHeaders);

  // 2. Combine all rows, adding a "_SourceSheet" column for traceability
  let mergedRows: any[] = [];

  sheets.forEach(sheet => {
    const rowsWithSource = sheet.data.map(row => ({
      ...row,
      _SourceSheet: sheet.name // Add metadata column
    }));
    mergedRows = [...mergedRows, ...rowsWithSource];
  });

  // Ensure _SourceSheet is in headers
  if (!mergedHeaders.includes('_SourceSheet')) {
    mergedHeaders.unshift('_SourceSheet');
  }

  return {
    headers: mergedHeaders,
    rows: mergedRows
  };
};

export const exportToCSV = (data: MergedData, filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data.rows, { header: data.headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "MergedData");
  XLSX.writeFile(wb, `${filename}_merged.csv`);
};

export const exportToXLSX = (data: MergedData, filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data.rows, { header: data.headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "MergedData");
  XLSX.writeFile(wb, `${filename}_merged.xlsx`);
};
