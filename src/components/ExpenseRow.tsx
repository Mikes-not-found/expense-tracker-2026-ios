/**
 * ExpenseRow — kawaii expense entry with card-style layout.
 */
import React from 'react';
import { Badge } from './ui/Badge';
import { makeStyles } from '../utils/styles';
import type { Expense } from '../types';

interface ExpenseRowProps {
  expense: Expense;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  index,
  onEdit,
  onDelete,
}) => {
  const styles = useStyles();
  const day = String(expense.date).padStart(2, '0');

  return (
    <div style={styles.container}>
      {/* Left: day circle */}
      <div style={styles.dayCircle}>
        <span style={styles.dayNumber}>{day}</span>
      </div>

      {/* Center: name + badges */}
      <div style={styles.center}>
        <div style={styles.name}>{expense.name}</div>
        <div style={styles.badges}>
          <Badge label={expense.primary} />
          {expense.secondary ? (
            <span style={styles.secondary}>{expense.secondary}</span>
          ) : null}
        </div>
      </div>

      {/* Right: amount + actions */}
      <div style={styles.right}>
        <span style={styles.amount}>{'\u20AC'}{expense.amount.toFixed(2)}</span>
        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => onEdit(index)}>
            <span style={styles.editIcon}>{'\u270E'}</span>
          </button>
          <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => onDelete(index)}>
            <span style={styles.deleteIcon}>{'\u2715'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.md,
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: t.colors.border,
    backgroundColor: t.colors.bgSurface,
    gap: t.spacing.md,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: t.colors.accentMuted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    flexShrink: 0,
  },
  dayNumber: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.lg,
    color: t.colors.accent,
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  badges: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.xs,
  },
  secondary: {
    fontFamily: t.fonts.mono,
    fontWeight: t.fontWeights.mono,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textSecondary,
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: t.spacing.xs,
    flexShrink: 0,
  },
  amount: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.md + 2,
    color: t.colors.accent,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: t.spacing.xs,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: t.radius.sm + 2,
    backgroundColor: t.colors.bgInteractive,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    cursor: 'pointer',
    outline: 'none',
    padding: 0,
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
