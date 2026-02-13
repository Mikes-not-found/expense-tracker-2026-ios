/**
 * App Context Provider — Dependency Inversion via React Context.
 * Wraps useReducer + auto-persist to AsyncStorage.
 * All child components access state via custom hooks (no prop drilling).
 */
import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

import type { AppState, Action } from '../types';
import { appReducer, initialState } from './reducer';
import { loadData, saveData, saveWorkbook } from '../utils/storage';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextValue>({
  state: initialState,
  dispatch: () => undefined,
});

/** Debounce delay for auto-persist (ms) */
const PERSIST_DELAY = 300;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Load persisted data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadData();
        dispatch({
          type: 'LOAD',
          state: {
            expenses: data.expenses,
            monthlySummaries: data.monthlySummaries,
            originalWorkbookData: data.originalWorkbookData,
            isLoaded: true,
          },
        });
      } catch (err) {
        console.error('Failed to load data:', err);
        dispatch({
          type: 'LOAD',
          state: { ...initialState, isLoaded: true },
        });
      }
    };
    load();
  }, []);

  // Auto-persist on state changes (debounced)
  useEffect(() => {
    if (!state.isLoaded) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveData(state.expenses, state.monthlySummaries);
        if (state.originalWorkbookData !== null) {
          await saveWorkbook(state.originalWorkbookData);
        }
      } catch (err) {
        console.error('Failed to save data:', err);
      }
    }, PERSIST_DELAY);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.expenses, state.monthlySummaries, state.originalWorkbookData, state.isLoaded]);

  const contextValue = React.useMemo(
    () => ({ state, dispatch }),
    [state]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
