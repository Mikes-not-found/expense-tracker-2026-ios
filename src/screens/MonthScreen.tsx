/**
 * MonthScreen — monthly expense view with list, summary, and FAB.
 * Mirrors the PWA's renderMonth() function.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthTabs } from '../components/MonthTabs';
import { ExpenseRow } from '../components/ExpenseRow';
import { ExpenseModal } from '../components/ExpenseModal';
import { SummaryModal } from '../components/SummaryModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ToastContainer } from '../components/Toast';

import { useExpenses, useSummary } from '../store/hooks';
import { useToast } from '../hooks/useToast';
import { useHaptics } from '../hooks/useHaptics';

import { months, monthNames, type MonthKey } from '../constants/categories';
import { formatEuro } from '../utils/calculations';
import { createStyles } from '../utils/styles';
import type { Expense } from '../types';

export const MonthScreen: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState<MonthKey>(() => {
    const now = new Date();
    return months[now.getMonth()];
  });

  const { expenses, total, addExpense, editExpense, deleteExpense } = useExpenses(activeMonth);
  const { summary, saveSummary } = useSummary(activeMonth);
  const { toasts, showToast } = useToast();
  const haptics = useHaptics();

  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<{
    expense: Expense;
    index: number;
  } | null>(null);

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

  const renderExpenseItem = useCallback(
    ({ item, index }: { item: Expense; index: number }) => (
      <ExpenseRow
        expense={item}
        index={index}
        month={activeMonth}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
    ),
    [activeMonth, handleEditExpense, handleDeleteExpense]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Month tabs */}
      <MonthTabs activeMonth={activeMonth} onSelect={setActiveMonth} />

      {/* Month header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.monthTitle}>
            {monthNames[activeMonth]}{' '}
            <Text style={styles.yearText}>2026</Text>
          </Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{formatEuro(total)}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionBar}>
        <Button variant="primary" onPress={handleAddExpense} small>
          + Add Expense
        </Button>
        <Button
          variant="ghost"
          onPress={() => setSummaryModalVisible(true)}
          small
        >
          Monthly Summary
        </Button>
      </View>

      {/* Summary preview */}
      <TouchableOpacity
        style={styles.summaryPreview}
        onPress={() => setSummaryModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.summaryLabel}>MONTHLY SUMMARY</Text>
        <Text
          style={[styles.summaryText, !summary && styles.summaryEmpty]}
          numberOfLines={2}
        >
          {summary || 'Click to write your monthly summary, reflections, and goals...'}
        </Text>
      </TouchableOpacity>

      {/* Expenses list */}
      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses recorded"
          subtitle='Tap "+ Add Expense" to start tracking this month'
        />
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
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

const styles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: t.spacing.md,
    paddingTop: t.spacing.lg,
    paddingBottom: t.spacing.sm,
  },
  monthTitle: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xl + 4,
    color: t.colors.textPrimary,
  },
  yearText: {
    fontFamily: t.fonts.mono,
    fontWeight: '300',
    color: t.colors.textMuted,
  },
  totalBadge: {
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    backgroundColor: t.colors.accentMuted,
    borderRadius: t.radius.full,
  },
  totalText: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg,
    color: t.colors.accent,
  },
  actionBar: {
    flexDirection: 'row',
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
  },
  summaryPreview: {
    marginHorizontal: t.spacing.md,
    marginBottom: t.spacing.md,
    backgroundColor: t.colors.bgSurface,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: t.colors.purple,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
  },
  summaryLabel: {
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.xs,
    color: t.colors.purple,
    letterSpacing: 1,
    marginBottom: t.spacing.xs,
  },
  summaryText: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
    lineHeight: 22,
  },
  summaryEmpty: {
    fontStyle: 'italic',
    color: t.colors.textMuted,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: t.spacing.xl,
    right: t.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: t.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: t.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: t.colors.bgBase,
    fontWeight: '600',
    marginTop: -2,
  },
}));
