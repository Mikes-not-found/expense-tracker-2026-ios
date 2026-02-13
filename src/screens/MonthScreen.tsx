/**
 * MonthScreen — kawaii monthly expense view with swipe navigation.
 * FloatingEmojis background, pink FAB, pastel styling.
 */
import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

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
  const pagerRef = useRef<PagerView>(null);

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
        pagerRef.current?.setPage(idx);
      }
    },
    []
  );

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      setActiveMonthIndex(e.nativeEvent.position);
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
      Alert.alert('Delete Expense', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(index);
            haptics.warning();
            showToast('Expense deleted', 'info');
          },
        },
      ]);
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FloatingEmojis />

      {/* Month tabs */}
      <MonthTabs activeMonth={activeMonth} onSelect={handleTabSelect} />

      {/* Swipeable month pages */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={initialIndex}
        onPageSelected={handlePageSelected}
      >
        {months.map((m) => (
          <View key={m} style={styles.page}>
            <MonthContent
              month={m}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onOpenSummary={handleOpenSummary}
            />
          </View>
        ))}
      </PagerView>

      {/* FAB — kawaii pink circle */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddExpense}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

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
    </SafeAreaView>
  );
};

const useStyles = makeStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bgBase,
  },
  pager: {
    flex: 1,
    zIndex: 1,
  },
  page: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: t.spacing.xl,
    right: t.spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: t.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: t.colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  fabText: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: -2,
  },
}));
