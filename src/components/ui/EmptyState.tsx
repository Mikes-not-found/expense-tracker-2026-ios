/**
 * EmptyState — kawaii empty state with cute emoji.
 */
import React from 'react';
import { makeStyles } from '../../utils/styles';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '\u{1F338}',
  title,
  subtitle,
}) => {
  const styles = useStyles();
  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.title}>{title}</div>
      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: t.spacing['2xl'],
    paddingBottom: t.spacing['2xl'],
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
  },
  icon: {
    fontSize: 56,
    marginBottom: t.spacing.md,
  },
  title: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.lg + 2,
    color: t.colors.textPrimary,
    marginBottom: t.spacing.sm,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontFamily: t.fonts.sans,
    fontWeight: t.fontWeights.sans,
    fontSize: t.fontSize.md,
    color: t.colors.textMuted,
    textAlign: 'center' as const,
    lineHeight: '22px',
  },
}));
