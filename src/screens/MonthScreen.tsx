/**
 * MonthScreen — kawaii monthly expense view with tab navigation.
 * Web version: tabs instead of PagerView swipe.
 */
import React, { useState, useCallback } from 'react';

import { MonthTabs } from '../components/MonthTabs';
import { MonthContent } from '../components/MonthContent';
import { ExpenseModal } from '../components/ExpenseModal';
import { SummaryModal } from '../components/SummaryModal';
import { FloatingEmojis } from '../components/FloatingEmojis';
import { ToastContainer } from '../components/Toast';

import { useExpenses, useSummary } from '../store/hooks';
import { useToast } from '../hooks/useToast';
import { useHaptics } from '../hooks/useHaptics';

import { months, monthNames, type MonthKey } from '../constants/categories';
import { makeStyles } from '../utils/styles';
import type { Expense } from '../types';

export const MonthScreen: React.FC = () => {
  const styles = useStyles();

  const initialIndex = new Date().getMonth();
  const [activeMonthIndex, setActiveMonthIndex] = useState(initialIndex);
  const activeMonth = months[activeMonthIndex];

  const { expenses, addExpense, editExpense, deleteExpense } = useExpenses(activeMonth);
  const { summary, saveSummary } = useSummary(activeMonth);
  const { toasts, showToast } = useToast();
  const haptics = useHaptics();

  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<{
    expense: Expense;
    index: number;
  } | null>(null);

  const handleTabSelect = useCallback(
    (month: MonthKey) => {
      const idx = months.indexOf(month);
      if (idx >= 0) {
        setActiveMonthIndex(idx);
      }
    },
    []
  );

  const handleAddExpense = useCallback(() => {
    setEditingExpense(null);
    setExpenseModalVisible(true);
  }, []);

  const handleEditExpense = useCallback(
    (index: number) => {
      setEditingExpense({ expense: expenses[index], index });
      setExpenseModalVisible(true);
    },
    [expenses]
  );

  const handleDeleteExpense = useCallback(
    (index: number) => {
      if (window.confirm('Delete this expense?')) {
        deleteExpense(index);
        haptics.warning();
        showToast('Expense deleted', 'info');
      }
    },
    [deleteExpense, haptics, showToast]
  );

  const handleSaveExpense = useCallback(
    (expense: Expense) => {
      if (editingExpense) {
        editExpense(editingExpense.index, expense);
        showToast('Expense updated', 'success');
      } else {
        addExpense(expense);
        showToast('Expense added', 'success');
      }
      haptics.light();
      setExpenseModalVisible(false);
      setEditingExpense(null);
    },
    [editingExpense, addExpense, editExpense, haptics, showToast]
  );

  const handleSaveSummary = useCallback(
    (text: string) => {
      saveSummary(text);
      haptics.light();
      showToast('Summary saved', 'success');
      setSummaryModalVisible(false);
    },
    [saveSummary, haptics, showToast]
  );

  const handleOpenSummary = useCallback(() => {
    setSummaryModalVisible(true);
  }, []);

  return (
    <div style={styles.safe}>
      <FloatingEmojis />

      {/* Month tabs */}
      <MonthTabs activeMonth={activeMonth} onSelect={handleTabSelect} />

      {/* Month content */}
      <div style={styles.pageContainer}>
        <MonthContent
          month={activeMonth}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onOpenSummary={handleOpenSummary}
        />
      </div>

      {/* FAB — kawaii pink circle */}
      <button style={styles.fab} onClick={handleAddExpense}>
        <span style={styles.fabText}>+</span>
      </button>

      {/* Modals */}
      <ExpenseModal
        visible={expenseModalVisible}
        expense={editingExpense?.expense ?? null}
        onSave={handleSaveExpense}
        onClose={() => {
          setExpenseModalVisible(false);
          setEditingExpense(null);
        }}
      />

      <SummaryModal
        visible={summaryModalVisible}
        title={`${monthNames[activeMonth]} Summary`}
        initialText={summary}
        onSave={handleSaveSummary}
        onClose={() => setSummaryModalVisible(false)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  safe: {
    position: 'relative',
    height: '100%',
    backgroundColor: t.colors.bgBase,
    display: 'flex',
    flexDirection: 'column',
  },
  pageContainer: {
    flex: 1,
    overflowY: 'auto' as const,
  },
  fab: {
    position: 'absolute',
    bottom: t.spacing.xl,
    right: t.spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: t.colors.accent,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 6px 16px ${t.colors.accentGlow}`,
    zIndex: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    padding: 0,
  },
  fabText: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: -2,
    lineHeight: '1',
  },
}));
