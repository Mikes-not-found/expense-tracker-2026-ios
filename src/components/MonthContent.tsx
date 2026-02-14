/**
 * MonthContent — kawaii month page with emoji header and pastel styling.
 */
import React, { useCallback } from 'react';
import { ExpenseRow } from './ExpenseRow';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { useExpenses, useSummary } from '../store/hooks';
import { monthNames, monthEmojis, type MonthKey } from '../constants/categories';
import { formatEuro } from '../utils/calculations';
import { makeStyles } from '../utils/styles';

interface MonthContentProps {
  month: MonthKey;
  onAddExpense: () => void;
  onEditExpense: (index: number) => void;
  onDeleteExpense: (index: number) => void;
  onOpenSummary: () => void;
}

export const MonthContent: React.FC<MonthContentProps> = ({
  month,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onOpenSummary,
}) => {
  const styles = useStyles();
  const { expenses, total } = useExpenses(month);
  const { summary } = useSummary(month);

  return (
    <div style={styles.container}>
      {/* Month header */}
      <div style={styles.header}>
        <div>
          <div style={styles.monthTitle}>
            {monthEmojis[month]} {monthNames[month]}{' '}
            <span style={styles.yearText}>2026</span>
          </div>
          <div style={styles.countText}>
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} {'\u{1F4DD}'}
          </div>
        </div>
        <div style={styles.totalBadge}>
          <span style={styles.totalText}>{formatEuro(total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionBar}>
        <Button variant="primary" onClick={onAddExpense} small>
          {'\u2795'} Add Expense
        </Button>
        <Button variant="ghost" onClick={onOpenSummary} small>
          {'\u{1F4DD}'} Summary
        </Button>
      </div>

      {/* Kakeibo summary preview */}
      <div style={styles.summaryPreview} onClick={onOpenSummary}>
        <div style={styles.summaryLabel}>{'\u{1F33F}'} KAKEIBO REFLECTION</div>
        <div style={summary ? styles.summaryText : { ...styles.summaryText, ...styles.summaryEmpty }}>
          {summary || 'Tap to write your monthly reflection, savings goals, and gratitude...'}
        </div>
      </div>

      {/* Expenses list */}
      {expenses.length === 0 ? (
        <EmptyState
          icon={'\u{1F338}'}
          title="No expenses yet!"
          subtitle='Tap "+ Add Expense" to start tracking this month'
        />
      ) : (
        <div style={styles.listContent}>
          {expenses.map((exp, i) => (
            <ExpenseRow
              key={i}
              expense={exp}
              index={i}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
    paddingTop: t.spacing.lg,
    paddingBottom: t.spacing.sm,
  },
  monthTitle: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xl + 6,
    color: t.colors.textPrimary,
  },
  yearText: {
    fontFamily: t.fonts.mono,
    fontWeight: 300,
    color: t.colors.textMuted,
  },
  countText: {
    fontFamily: t.fonts.mono,
    fontWeight: t.fontWeights.mono,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
    marginTop: 2,
  },
  totalBadge: {
    paddingTop: t.spacing.sm + 2,
    paddingBottom: t.spacing.sm + 2,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    backgroundColor: t.colors.accentMuted,
    borderRadius: t.radius.full,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
  },
  totalText: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.accent,
  },
  actionBar: {
    display: 'flex',
    flexDirection: 'row',
    gap: t.spacing.sm,
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.sm,
  },
  summaryPreview: {
    marginLeft: t.spacing.md,
    marginRight: t.spacing.md,
    marginBottom: t.spacing.md,
    backgroundColor: t.colors.bgElevated,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: t.colors.green,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
    cursor: 'pointer',
  },
  summaryLabel: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xs,
    color: t.colors.green,
    letterSpacing: 1,
    marginBottom: t.spacing.xs,
  },
  summaryText: {
    fontFamily: t.fonts.sans,
    fontWeight: t.fontWeights.sans,
    fontSize: t.fontSize.md,
    color: t.colors.textSecondary,
    lineHeight: '22px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  },
  summaryEmpty: {
    fontStyle: 'italic' as const,
    color: t.colors.textMuted,
  },
  listContent: {
    paddingBottom: 100,
  },
}));
