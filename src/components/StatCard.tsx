/**
 * StatCard — kawaii dashboard statistic card with pastel gradient feel.
 */
import React from 'react';
import { Card } from './ui/Card';
import { makeStyles } from '../utils/styles';

interface StatCardProps {
  label: string;
  value: string;
  emoji?: string;
  valueColor?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  emoji,
  valueColor,
  style,
}) => {
  const styles = useStyles();

  return (
    <Card variant="elevated" style={{ ...styles.card, ...style }}>
      <div style={styles.inner}>
        {emoji && <div style={styles.emoji}>{emoji}</div>}
        <div style={styles.label}>{label}</div>
        <div style={{ ...styles.value, ...(valueColor ? { color: valueColor } : {}) }}>
          {value}
        </div>
      </div>
    </Card>
  );
};

const useStyles = makeStyles((t) => ({
  card: {
    padding: 0,
    borderColor: t.colors.border,
  },
  inner: {
    padding: t.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: t.spacing.xs,
  },
  label: {
    fontFamily: t.fonts.monoMedium,
    fontWeight: t.fontWeights.monoMedium,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: t.spacing.sm,
    textAlign: 'center' as const,
  },
  value: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.xl + 2,
    color: t.colors.accent,
    textAlign: 'center' as const,
  },
}));
