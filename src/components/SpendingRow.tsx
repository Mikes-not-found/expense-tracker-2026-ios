/**
 * SpendingRow — kawaii bar chart row with pink progress bar.
 */
import React from 'react';
import { makeStyles } from '../utils/styles';
import { formatEuro, calcPct } from '../utils/calculations';

interface SpendingRowProps {
  name: string;
  amount: number;
  total: number;
  emoji?: string;
}

export const SpendingRow: React.FC<SpendingRowProps> = ({ name, amount, total, emoji }) => {
  const styles = useStyles();
  const pct = calcPct(amount, total);
  const pctNum = parseFloat(pct);

  return (
    <div style={styles.container}>
      <span style={styles.name}>
        {emoji ? `${emoji} ${name}` : name}
      </span>
      <div style={styles.barContainer}>
        <div
          style={{
            ...styles.barFill,
            width: `${pctNum}%`,
            animation: 'barGrow 0.8s ease-out',
          }}
        />
      </div>
      <span style={styles.value}>{formatEuro(amount)}</span>
      <span style={styles.pct}>{pct}%</span>
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm + 4,
    paddingTop: t.spacing.sm + 2,
    paddingBottom: t.spacing.sm + 2,
    paddingLeft: t.spacing.sm,
    paddingRight: t.spacing.sm,
  },
  name: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
    minWidth: 80,
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: t.colors.bgInteractive,
    borderRadius: t.radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent,
    minWidth: 2,
    transition: 'width 0.8s ease-out',
  },
  value: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.sm,
    color: t.colors.accent,
    minWidth: 75,
    textAlign: 'right' as const,
    flexShrink: 0,
  },
  pct: {
    fontFamily: t.fonts.mono,
    fontWeight: t.fontWeights.mono,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    minWidth: 38,
    textAlign: 'right' as const,
    flexShrink: 0,
  },
}));
