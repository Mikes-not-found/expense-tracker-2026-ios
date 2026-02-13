/**
 * MonthContent — kawaii month page with emoji header and pastel styling.
 * Wrapped in React.memo for PagerView performance.
 */
import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ExpenseRow } from './ExpenseRow';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { useExpenses, useSummary } from '../store/hooks';
import { monthNames, monthEmojis, type MonthKey } from '../constants/categories';
import { formatEuro } from '../utils/calculations';
import { makeStyles } from '../utils/styles';
import type { Expense } from '../types';

interface MonthContentProps {
  month: MonthKey;
  onAddExpense: () => void;
  onEditExpense: (index: number) => void;
  onDeleteExpense: (index: number) => void;
  onOpenSummary: () => void;
}

const MonthContentInner: React.FC<MonthContentProps> = ({
  month,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onOpenSummary,
}) => {
  const styles = useStyles();
  const { expenses, total } = useExpenses(month);
  const { summary } = useSummary(month);

  const renderExpenseItem = useCallback(
    ({ item, index }: { item: Expense; index: number }) => (
      <ExpenseRow
        expense={item}
        index={index}
        month={month}
        onEdit={onEditExpense}
        onDelete={onDeleteExpense}
      />
    ),
    [month, onEditExpense, onDeleteExpense]
  );

  return (
    <View style={styles.container}>
      {/* Month header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.monthTitle}>
            {monthEmojis[month]} {monthNames[month]}{' '}
            <Text style={styles.yearText}>2026</Text>
          </Text>
          <Text style={styles.countText}>
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} {'\u{1F4DD}'}
          </Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{formatEuro(total)}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionBar}>
        <Button variant="primary" onPress={onAddExpense} small>
          {'\u2795'} Add Expense
        </Button>
        <Button variant="ghost" onPress={onOpenSummary} small>
          {'\u{1F4DD}'} Summary
        </Button>
      </View>

      {/* Kakeibo summary preview */}
      <TouchableOpacity
        style={styles.summaryPreview}
        onPress={onOpenSummary}
        activeOpacity={0.7}
      >
        <Text style={styles.summaryLabel}>{'\u{1F33F}'} KAKEIBO REFLECTION</Text>
        <Text
          style={[styles.summaryText, !summary && styles.summaryEmpty]}
          numberOfLines={2}
        >
          {summary || 'Tap to write your monthly reflection, savings goals, and gratitude...'}
        </Text>
      </TouchableOpacity>

      {/* Expenses list */}
      {expenses.length === 0 ? (
        <EmptyState
          icon={'\u{1F338}'}
          title="No expenses yet!"
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
    </View>
  );
};

export const MonthContent = React.memo(MonthContentInner);

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
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
    fontSize: t.fontSize.xl + 6,
    color: t.colors.textPrimary,
  },
  yearText: {
    fontFamily: t.fonts.mono,
    fontWeight: '300',
    color: t.colors.textMuted,
  },
  countText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
    marginTop: 2,
  },
  totalBadge: {
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.lg,
    backgroundColor: t.colors.accentMuted,
    borderRadius: t.radius.full,
    borderWidth: 1.5,
    borderColor: t.colors.border,
  },
  totalText: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg + 2,
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
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: t.colors.green,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
  },
  summaryLabel: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xs,
    color: t.colors.green,
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
}));
