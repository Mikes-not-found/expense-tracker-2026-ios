/**
 * Excel import/export — mirrors the PWA's logic exactly.
 * Uses expo-document-picker, expo-file-system, expo-sharing + xlsx.
 */
import * as DocumentPicker from 'expo-document-picker';
import * as LegacyFS from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

import { months, monthNames, type MonthKey } from '../constants/categories';
import type { Expense, Expenses, MonthlySummaries } from '../types';

interface ImportResult {
  expenses: Expenses;
  summaries: MonthlySummaries;
  workbookBase64: string | null;
}

/**
 * Import Excel file — opens native file picker, parses workbook.
 * Returns parsed expenses, summaries, and raw base64 for re-export.
 */
export const importExcel = async (): Promise<ImportResult | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const fileUri = result.assets[0].uri;
  const base64 = await LegacyFS.readAsStringAsync(fileUri, {
    encoding: LegacyFS.EncodingType.Base64,
  });

  const workbook = XLSX.read(base64, { type: 'base64', cellFormula: true, cellStyles: true });

  const expenses: Expenses = {};

  for (const month of months) {
    const sheetNameCap = month.charAt(0).toUpperCase() + month.slice(1);
    const monthName = monthNames[month];
    const sheet =
      workbook.Sheets[sheetNameCap] ??
      workbook.Sheets[month] ??
      workbook.Sheets[monthName];

    if (!sheet) continue;

    const jsonData = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(sheet, {
      header: 1,
      raw: false,
    });

    const monthExpenses: Expense[] = [];

    for (let i = 2; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row?.[0] || String(row[0]).trim() === '') continue;

      const name = String(row[0]);
      const date = row[1] ? parseInt(String(row[1]), 10) : 1;
      const amount = row[4]
        ? parseFloat(String(row[4]))
        : row[2]
          ? parseFloat(String(row[2]))
          : 0;
      const primary = row[5] ? String(row[5]) : 'OtherExpenses';
      const secondary = row[6] ? String(row[6]) : '';

      if (amount > 0 && name) {
        monthExpenses.push({ name, date, amount, primary, secondary });
      }
    }

    if (monthExpenses.length > 0) {
      monthExpenses.sort((a, b) => a.date - b.date);
      expenses[month] = monthExpenses;
    }
  }

  // Import monthly summaries from "Summaries" sheet if present
  const summaries: MonthlySummaries = {};
  const summarySheet = workbook.Sheets['Summaries'] ?? workbook.Sheets['summaries'];
  if (summarySheet) {
    const summaryData = XLSX.utils.sheet_to_json<(string | undefined)[]>(summarySheet, {
      header: 1,
      raw: false,
    });
    for (let i = 1; i < summaryData.length; i++) {
      const row = summaryData[i];
      if (row?.[0] && row[1]) {
        const monthKey = String(row[0]).toLowerCase().substring(0, 3) as MonthKey;
        if (months.includes(monthKey)) {
          summaries[monthKey] = String(row[1]);
        }
      }
    }
  }

  return { expenses, summaries, workbookBase64: base64 };
};

/**
 * Export/download Excel — creates workbook and opens share sheet.
 */
export const downloadExcel = async (
  expenses: Expenses,
  summaries: MonthlySummaries,
  originalWorkbookBase64: string | null
): Promise<void> => {
  let wb: XLSX.WorkBook;

  if (originalWorkbookBase64) {
    wb = XLSX.read(originalWorkbookBase64, {
      type: 'base64',
      cellFormula: true,
      cellStyles: true,
    });

    for (const month of months) {
      const monthExpenses = expenses[month] ?? [];
      const monthNameCap = month.charAt(0).toUpperCase() + month.slice(1);
      const sheet = wb.Sheets[monthNameCap];
      if (!sheet) continue;

      const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1');
      for (let R = 2; R <= range.e.r; R++) {
        for (let C = 0; C <= 9; C++) {
          delete sheet[XLSX.utils.encode_cell({ r: R, c: C })];
        }
      }

      monthExpenses.forEach((exp, index) => {
        const rowIndex = 2 + index;
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })] = { t: 's', v: exp.name };
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })] = { t: 'n', v: exp.date };
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })] = { t: 'n', v: exp.amount };
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })] = { t: 's', v: '' };
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })] = { t: 'n', v: exp.amount };
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 5 })] = { t: 's', v: exp.primary };
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 6 })] = {
          t: 's',
          v: exp.secondary ?? '',
        };
      });

      const newRange = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1');
      newRange.e.r = Math.max(newRange.e.r, 2 + monthExpenses.length - 1);
      sheet['!ref'] = XLSX.utils.encode_range(newRange);
    }
  } else {
    wb = XLSX.utils.book_new();

    for (const month of months) {
      const monthExpenses = expenses[month] ?? [];
      const monthNameCap = month.charAt(0).toUpperCase() + month.slice(1);

      const wsData: (string | number)[][] = [
        ['Expense name', 'Date', 'Amount', 'Curr', 'EU', 'Primary', 'Secondary', 'Sum', 'EURCHF', 'USDCHF'],
        ['', '', '', '', '', '', '', '', '0.93', '0.8084116'],
      ];

      for (const exp of monthExpenses) {
        wsData.push([exp.name, exp.date, exp.amount, '', exp.amount, exp.primary, exp.secondary ?? '', '', '', '']);
      }

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, monthNameCap);
    }
  }

  // Add/update Summaries sheet
  const summarySheetName = 'Summaries';
  if (wb.Sheets[summarySheetName]) {
    delete wb.Sheets[summarySheetName];
    const idx = wb.SheetNames.indexOf(summarySheetName);
    if (idx > -1) wb.SheetNames.splice(idx, 1);
  }

  const summaryData: (string)[][] = [['Month', 'Summary']];
  for (const m of months) {
    summaryData.push([monthNames[m], summaries[m] ?? '']);
  }
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, summarySheetName);

  // Write to file and share
  const wbOut = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const today = new Date().toISOString().split('T')[0];
  const fileName = `2026 - Expences - ${today}.xlsx`;
  const fileUri = `${LegacyFS.cacheDirectory}${fileName}`;

  await LegacyFS.writeAsStringAsync(fileUri, wbOut, {
    encoding: LegacyFS.EncodingType.Base64,
  });

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Export Expenses',
    UTI: 'org.openxmlformats.spreadsheetml.sheet',
  });
};
