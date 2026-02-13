/**
 * ExpenseRow — kawaii expense entry with pastel styling and emoji badges.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Badge } from './ui/Badge';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';
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
  const styles = useStyles();
  const { theme } = useTheme();
  const dateStr = `${String(expense.date).padStart(2, '0')}/${getMonthNumber(month)}/2026`;

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <View style={styles.info}>
          <Text style={styles.date}>{dateStr}</Text>
          <Text style={styles.name} numberOfLines={1}>{expense.name}</Text>
        </View>
        <Text style={styles.amount}>{'\u20AC'} {expense.amount.toFixed(2)}</Text>
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
            <Text style={styles.editIcon}>{'\u270E'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => onDelete(index)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteIcon}>{'\u2715'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
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
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md + 1,
    color: t.colors.textPrimary,
  },
  amount: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg + 2,
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
    width: 34,
    height: 34,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.bgInteractive,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  deleteBtn: {
    backgroundColor: t.colors.redMuted,
    borderColor: 'transparent',
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
