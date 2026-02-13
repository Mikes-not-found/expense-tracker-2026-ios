/**
 * Pure calculation functions — no side effects.
 * Mirrors the PWA's calculation logic exactly.
 */
import { months, monthNames, type MonthKey } from '../constants/categories';
import type { Expenses } from '../types';

/** Total spending for one month */
export const calculateMonthTotal = (expenses: Expenses, month: MonthKey): number =>
  (expenses[month] ?? []).reduce((sum, exp) => sum + exp.amount, 0);

/** Total spending for the entire year */
export const calculateYearTotal = (expenses: Expenses): number =>
  months.reduce((total, m) => total + calculateMonthTotal(expenses, m), 0);

/** Object with each month's total */
export const calculateMonthlyTotals = (expenses: Expenses): Record<MonthKey, number> => {
  const totals = {} as Record<MonthKey, number>;
  for (const m of months) {
    totals[m] = calculateMonthTotal(expenses, m);
  }
  return totals;
};

/** Object with each primary category's total */
export const calculateCategoryTotals = (expenses: Expenses): Record<string, number> => {
  const totals: Record<string, number> = {};
  for (const m of months) {
    for (const exp of expenses[m] ?? []) {
      totals[exp.primary] = (totals[exp.primary] ?? 0) + exp.amount;
    }
  }
  return totals;
};

/** Object with each subcategory's total */
export const calculateSubcategoryTotals = (expenses: Expenses): Record<string, number> => {
  const totals: Record<string, number> = {};
  for (const m of months) {
    for (const exp of expenses[m] ?? []) {
      const sub = exp.secondary?.trim();
      if (sub) {
        totals[sub] = (totals[sub] ?? 0) + exp.amount;
      }
    }
  }
  return totals;
};

/** Total number of expense entries across all months */
export const getTotalExpensesCount = (expenses: Expenses): number =>
  months.reduce((count, m) => count + (expenses[m]?.length ?? 0), 0);

/** Name of the month with highest spending */
export const getMostExpensiveMonth = (totals: Record<MonthKey, number>): string => {
  let maxMonth: MonthKey = 'jan';
  let maxAmount = 0;
  for (const [m, amount] of Object.entries(totals) as [MonthKey, number][]) {
    if (amount > maxAmount) {
      maxAmount = amount;
      maxMonth = m;
    }
  }
  return monthNames[maxMonth];
};

/** Number of months that have at least one expense */
export const getActiveMonthsCount = (totals: Record<MonthKey, number>): number =>
  Object.values(totals).filter((v) => v > 0).length || 1;

/** Filtered total by optional month and category */
export const calculateFilteredTotal = (
  expenses: Expenses,
  filterMonth?: MonthKey | '',
  filterCategory?: string
): number => {
  let total = 0;
  for (const m of months) {
    if (filterMonth && m !== filterMonth) continue;
    for (const exp of expenses[m] ?? []) {
      if (filterCategory && exp.primary !== filterCategory) continue;
      total += exp.amount;
    }
  }
  return total;
};

/** Sort entries by spending amount descending, return as [key, value] tuples */
export const sortByAmountDesc = (
  totals: Record<string, number>
): [string, number][] =>
  Object.entries(totals)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

/** Format a number as Euro currency string */
export const formatEuro = (amount: number): string => `€ ${amount.toFixed(2)}`;

/** Calculate percentage string */
export const calcPct = (part: number, total: number): string =>
  total > 0 ? ((part / total) * 100).toFixed(1) : '0.0';
