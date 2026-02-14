/**
 * localStorage wrapper — typed, safe, DRY.
 * Web replacement for AsyncStorage.
 */
import type { Expenses, MonthlySummaries } from '../types';

const KEYS = {
  expenses: 'codeExpenses2026',
  summaries: 'monthlySummaries2026',
  workbook: 'originalExcelWorkbook',
} as const;

export interface StoredData {
  expenses: Expenses;
  monthlySummaries: MonthlySummaries;
  originalWorkbookData: string | null;
}

/** Load all persisted data from localStorage */
export const loadData = async (): Promise<StoredData> => {
  const rawExpenses = localStorage.getItem(KEYS.expenses);
  const rawSummaries = localStorage.getItem(KEYS.summaries);
  const rawWorkbook = localStorage.getItem(KEYS.workbook);

  return {
    expenses: rawExpenses ? JSON.parse(rawExpenses) : {},
    monthlySummaries: rawSummaries ? JSON.parse(rawSummaries) : {},
    originalWorkbookData: rawWorkbook ?? null,
  };
};

/** Save expenses and summaries to localStorage */
export const saveData = async (
  expenses: Expenses,
  summaries: MonthlySummaries
): Promise<void> => {
  localStorage.setItem(KEYS.expenses, JSON.stringify(expenses));
  localStorage.setItem(KEYS.summaries, JSON.stringify(summaries));
};

/** Save original workbook data (base64) */
export const saveWorkbook = async (base64: string | null): Promise<void> => {
  if (base64) {
    localStorage.setItem(KEYS.workbook, base64);
  } else {
    localStorage.removeItem(KEYS.workbook);
  }
};
