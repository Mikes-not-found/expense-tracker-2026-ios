/**
 * AsyncStorage wrapper — typed, safe, DRY.
 * Replaces localStorage from the PWA version.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
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

/** Load all persisted data from AsyncStorage */
export const loadData = async (): Promise<StoredData> => {
  const [rawExpenses, rawSummaries, rawWorkbook] = await AsyncStorage.multiGet([
    KEYS.expenses,
    KEYS.summaries,
    KEYS.workbook,
  ]);

  return {
    expenses: rawExpenses[1] ? JSON.parse(rawExpenses[1]) : {},
    monthlySummaries: rawSummaries[1] ? JSON.parse(rawSummaries[1]) : {},
    originalWorkbookData: rawWorkbook[1] ?? null,
  };
};

/** Save expenses and summaries to AsyncStorage */
export const saveData = async (
  expenses: Expenses,
  summaries: MonthlySummaries
): Promise<void> => {
  await AsyncStorage.multiSet([
    [KEYS.expenses, JSON.stringify(expenses)],
    [KEYS.summaries, JSON.stringify(summaries)],
  ]);
};

/** Save original workbook data (base64) */
export const saveWorkbook = async (base64: string | null): Promise<void> => {
  if (base64) {
    await AsyncStorage.setItem(KEYS.workbook, base64);
  } else {
    await AsyncStorage.removeItem(KEYS.workbook);
  }
};
