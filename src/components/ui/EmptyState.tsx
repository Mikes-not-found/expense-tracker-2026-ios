/**
 * EmptyState — shown when a list has no items.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { makeStyles } from '../../utils/styles';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '</>',
  title,
  subtitle,
}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: t.spacing['2xl'],
    paddingHorizontal: t.spacing.lg,
  },
  icon: {
    fontSize: 48,
    opacity: 0.3,
    marginBottom: t.spacing.md,
    color: t.colors.textMuted,
  },
  title: {
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.lg,
    color: t.colors.textSecondary,
    marginBottom: t.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: t.fonts.sans,
    fontSize: t.fontSize.md,
    color: t.colors.textMuted,
    textAlign: 'center',
  },
}));
