/**
 * ExpenseRow — kawaii expense entry with card-style layout.
 * Date shown as prominent day circle, name + amount on the right.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Badge } from './ui/Badge';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';
import type { Expense } from '../types';
import type { MonthKey } from '../constants/categories';

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
  const day = String(expense.date).padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Left: day circle */}
      <View style={styles.dayCircle}>
        <Text style={styles.dayNumber}>{day}</Text>
      </View>

      {/* Center: name + badges */}
      <View style={styles.center}>
        <Text style={styles.name} numberOfLines={1}>{expense.name}</Text>
        <View style={styles.badges}>
          <Badge label={expense.primary} />
          {expense.secondary ? (
            <Text style={styles.secondary} numberOfLines={1}>{expense.secondary}</Text>
          ) : null}
        </View>
      </View>

      {/* Right: amount + actions */}
      <View style={styles.right}>
        <Text style={styles.amount}>{'\u20AC'}{expense.amount.toFixed(2)}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
    gap: t.spacing.md,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: t.colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: t.colors.border,
  },
  dayNumber: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.lg,
    color: t.colors.accent,
  },
  center: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.xs,
  },
  secondary: {
    fontFamily: t.fonts.mono,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: t.spacing.xs,
  },
  amount: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.md + 2,
    color: t.colors.accent,
  },
  actions: {
    flexDirection: 'row',
    gap: t.spacing.xs,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: t.radius.sm + 2,
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
    fontSize: 13,
    color: t.colors.textSecondary,
  },
  deleteIcon: {
    fontSize: 12,
    color: t.colors.red,
  },
}));
