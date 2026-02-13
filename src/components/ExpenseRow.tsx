/**
 * ExpenseRow — single expense entry in month view.
 * Supports edit and delete actions via callbacks.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Badge } from './ui/Badge';
import { createStyles } from '../utils/styles';
import { theme } from '../constants/theme';
import type { Expense } from '../types';
import type { MonthKey } from '../constants/categories';
import { getMonthNumber } from '../constants/categories';

interface ExpenseRowProps {
  expense: Expense;
  index: number;
  month: MonthKey;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  index,
  month,
  onEdit,
  onDelete,
}) => {
  const dateStr = `${String(expense.date).padStart(2, '0')}/${getMonthNumber(month)}/2026`;

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <View style={styles.info}>
          <Text style={styles.date}>{dateStr}</Text>
          <Text style={styles.name} numberOfLines={1}>{expense.name}</Text>
        </View>
        <Text style={styles.amount}>€ {expense.amount.toFixed(2)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Badge label={expense.primary} />
        {expense.secondary ? (
          <Text style={styles.secondary}>{expense.secondary}</Text>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit(index)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => onDelete(index)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = createStyles((t) => ({
  container: {
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: t.spacing.sm,
  },
  info: {
    flex: 1,
    marginRight: t.spacing.md,
  },
  date: {
    fontFamily: t.fonts.mono,
    fontSize: t.fontSize.sm,
    color: t.colors.textMuted,
    marginBottom: 2,
  },
  name: {
    fontFamily: t.fonts.sansSemiBold,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
  },
  amount: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg,
    color: t.colors.accent,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
  },
  secondary: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.sm,
    color: t.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: t.spacing.xs,
    marginLeft: 'auto',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.bgInteractive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: t.colors.redMuted,
  },
  editIcon: {
    fontSize: 14,
    color: t.colors.textSecondary,
  },
  deleteIcon: {
    fontSize: 14,
    color: t.colors.red,
  },
}));
