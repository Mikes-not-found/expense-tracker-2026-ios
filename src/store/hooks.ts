/**
 * Custom hooks — Interface Segregation Principle.
 * Each hook exposes only the data/actions a component needs.
 * Prevents unnecessary re-renders (components subscribe to minimal state).
 */
import { useContext, useCallback, useMemo } from 'react';

import { AppContext } from './AppContext';
import type { MonthKey } from '../constants/categories';
import type { Expense } from '../types';
import {
  calculateYearTotal,
  calculateMonthlyTotals,
  calculateCategoryTotals,
  calculateSubcategoryTotals,
  getTotalExpensesCount,
  getMostExpensiveMonth,
  getActiveMonthsCount,
  calculateMonthTotal,
} from '../utils/calculations';

/** Access raw context — prefer the specialized hooks below */
export const useAppContext = () => useContext(AppContext);

/** Expenses for a specific month + CRUD actions */
export const useExpenses = (month: MonthKey) => {
  const { state, dispatch } = useContext(AppContext);

  const expenses = state.expenses[month] ?? [];
  const total = calculateMonthTotal(state.expenses, month);

  const addExpense = useCallback(
    (expense: Expense) => dispatch({ type: 'ADD_EXPENSE', month, expense }),
    [dispatch, month]
  );

  const editExpense = useCallback(
    (index: number, expense: Expense) =>
      dispatch({ type: 'EDIT_EXPENSE', month, index, expense }),
    [dispatch, month]
  );

  const deleteExpense = useCallback(
    (index: number) => dispatch({ type: 'DELETE_EXPENSE', month, index }),
    [dispatch, month]
  );

  return { expenses, total, addExpense, editExpense, deleteExpense };
};

/** Dashboard aggregated data — read-only */
export const useDashboard = () => {
  const { state } = useContext(AppContext);

  return useMemo(() => {
    const yearTotal = calculateYearTotal(state.expenses);
    const monthlyTotals = calculateMonthlyTotals(state.expenses);
    const categoryTotals = calculateCategoryTotals(state.expenses);
    const subcategoryTotals = calculateSubcategoryTotals(state.expenses);
    const activeMonths = getActiveMonthsCount(monthlyTotals);
    const totalEntries = getTotalExpensesCount(state.expenses);
    const topMonth = getMostExpensiveMonth(monthlyTotals);
    const monthlyAverage = yearTotal / activeMonths;

    return {
      yearTotal,
      monthlyTotals,
      categoryTotals,
      subcategoryTotals,
      totalEntries,
      topMonth,
      monthlyAverage,
    };
  }, [state.expenses]);
};

/** Monthly summary for a specific month + save action */
export const useSummary = (month: MonthKey) => {
  const { state, dispatch } = useContext(AppContext);

  const summary = state.monthlySummaries[month] ?? '';

  const saveSummary = useCallback(
    (text: string) => dispatch({ type: 'SAVE_SUMMARY', month, text }),
    [dispatch, month]
  );

  return { summary, saveSummary };
};

/** Import/export data actions */
export const useDataActions = () => {
  const { state, dispatch } = useContext(AppContext);

  const importData = useCallback(
    (data: {
      expenses: typeof state.expenses;
      summaries: typeof state.monthlySummaries;
      workbook: string | null;
    }) =>
      dispatch({
        type: 'IMPORT_DATA',
        expenses: data.expenses,
        summaries: data.summaries,
        workbook: data.workbook,
      }),
    [dispatch]
  );

  return {
    expenses: state.expenses,
    summaries: state.monthlySummaries,
    workbook: state.originalWorkbookData,
    isLoaded: state.isLoaded,
    importData,
  };
};
