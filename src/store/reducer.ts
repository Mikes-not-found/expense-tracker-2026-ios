/**
 * Pure reducer — no side effects.
 * Handles all state transitions via discriminated union actions.
 */
import type { AppState, Action } from '../types';

export const initialState: AppState = {
  expenses: {},
  monthlySummaries: {},
  originalWorkbookData: null,
  isLoaded: false,
};

export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const current = [...(state.expenses[action.month] ?? []), action.expense];
      current.sort((a, b) => a.date - b.date);
      return {
        ...state,
        expenses: { ...state.expenses, [action.month]: current },
      };
    }

    case 'EDIT_EXPENSE': {
      const list = [...(state.expenses[action.month] ?? [])];
      list[action.index] = action.expense;
      list.sort((a, b) => a.date - b.date);
      return {
        ...state,
        expenses: { ...state.expenses, [action.month]: list },
      };
    }

    case 'DELETE_EXPENSE': {
      const filtered = (state.expenses[action.month] ?? []).filter(
        (_, i) => i !== action.index
      );
      return {
        ...state,
        expenses: { ...state.expenses, [action.month]: filtered },
      };
    }

    case 'SAVE_SUMMARY':
      return {
        ...state,
        monthlySummaries: {
          ...state.monthlySummaries,
          [action.month]: action.text,
        },
      };

    case 'IMPORT_DATA':
      return {
        ...state,
        expenses: action.expenses,
        monthlySummaries: action.summaries,
        originalWorkbookData: action.workbook,
      };

    case 'LOAD':
      return { ...action.state, isLoaded: true };

    default:
      return state;
  }
};
