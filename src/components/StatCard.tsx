/**
 * StatCard — kawaii dashboard statistic card with pastel gradient feel.
 */
import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { Card } from './ui/Card';
import { makeStyles } from '../utils/styles';

interface StatCardProps {
  label: string;
  value: string;
  emoji?: string;
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
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
    <Card variant="elevated" style={[styles.card, style]}>
      <View style={styles.inner}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueColor ? { color: valueColor } : undefined]}>
          {value}
        </Text>
      </View>
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
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: t.spacing.xs,
  },
  label: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: t.spacing.sm,
    textAlign: 'center',
  },
  value: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xl + 2,
    color: t.colors.accent,
    textAlign: 'center',
  },
}));
