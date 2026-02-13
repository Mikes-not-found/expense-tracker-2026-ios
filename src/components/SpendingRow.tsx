/**
 * SpendingRow — bar chart row for dashboard sections.
 * Shows name, animated progress bar, value, and percentage.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { createStyles } from '../utils/styles';
import { formatEuro, calcPct } from '../utils/calculations';

interface SpendingRowProps {
  name: string;
  amount: number;
  total: number;
}

export const SpendingRow: React.FC<SpendingRowProps> = ({ name, amount, total }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = calcPct(amount, total);
  const pctNum = parseFloat(pct);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pctNum,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [pctNum]);

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.value}>{formatEuro(amount)}</Text>
      <Text style={styles.pct}>{pct}%</Text>
    </View>
  );
};

const styles = createStyles((t) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm + 4,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.sm,
  },
  name: {
    fontFamily: t.fonts.sansMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
    minWidth: 80,
    flexShrink: 0,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: t.colors.bgInteractive,
    borderRadius: t.radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent,
    minWidth: 2,
  },
  value: {
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.sm,
    color: t.colors.textSecondary,
    minWidth: 75,
    textAlign: 'right',
    flexShrink: 0,
  },
  pct: {
    fontFamily: t.fonts.mono,
    fontSize: t.fontSize.xs + 1,
    color: t.colors.textMuted,
    minWidth: 38,
    textAlign: 'right',
    flexShrink: 0,
  },
}));
