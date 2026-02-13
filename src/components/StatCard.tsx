/**
 * StatCard — dashboard statistic card.
 * Uses Card base component (DRY).
 */
import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { Card } from './ui/Card';
import { makeStyles } from '../utils/styles';

interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  valueColor,
  style,
}) => {
  const styles = useStyles();

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.inner}>
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
  },
  inner: {
    padding: t.spacing.lg,
  },
  label: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.xs,
    color: t.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: t.spacing.sm,
  },
  value: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.xl + 4,
    color: t.colors.accent,
  },
}));
