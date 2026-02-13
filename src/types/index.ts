import type { MonthKey } from '../constants/categories';

/** Single expense entry */
export interface Expense {
  name: string;
  date: number;
  amount: number;
  primary: string;
  secondary: string;
}

/** Expenses grouped by month key */
export type Expenses = Partial<Record<MonthKey, Expense[]>>;

/** Monthly summaries indexed by month key */
export type MonthlySummaries = Partial<Record<MonthKey, string>>;

/** Full persisted application state */
export interface AppState {
  expenses: Expenses;
  monthlySummaries: MonthlySummaries;
  originalWorkbookData: string | null;
  isLoaded: boolean;
}

/** Discriminated union of all state actions */
export type Action =
  | { type: 'ADD_EXPENSE'; month: MonthKey; expense: Expense }
  | { type: 'EDIT_EXPENSE'; month: MonthKey; index: number; expense: Expense }
  | { type: 'DELETE_EXPENSE'; month: MonthKey; index: number }
  | { type: 'SAVE_SUMMARY'; month: MonthKey; text: string }
  | {
      type: 'IMPORT_DATA';
      expenses: Expenses;
      summaries: MonthlySummaries;
      workbook: string | null;
    }
  | { type: 'LOAD'; state: AppState };

/** Toast notification types */
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
