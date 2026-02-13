/**
 * SpendingRow — kawaii bar chart row with pink progress bar.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
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
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = calcPct(amount, total);
  const pctNum = parseFloat(pct);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pctNum,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [pctNum]);

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {emoji ? `${emoji} ${name}` : name}
      </Text>
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

const useStyles = makeStyles((t) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm + 4,
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.sm,
  },
  name: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.md,
    color: t.colors.textPrimary,
    minWidth: 80,
    flexShrink: 0,
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
  },
  value: {
    fontFamily: t.fonts.monoBold,
    fontSize: t.fontSize.sm,
    color: t.colors.accent,
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
