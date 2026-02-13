/**
 * Card — base card component with variants.
 * Open/Closed Principle: extend via `variant` prop, don't modify internals.
 */
import React, { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { createStyles } from '../../utils/styles';

type CardVariant = 'surface' | 'elevated' | 'overlay';

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  children,
  style,
}) => (
  <View style={[styles.base, styles[variant], style]}>
    {children}
  </View>
);

const styles = createStyles((t) => ({
  base: {
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
  },
  surface: {
    backgroundColor: t.colors.bgSurface,
  },
  elevated: {
    backgroundColor: t.colors.bgElevated,
  },
  overlay: {
    backgroundColor: t.colors.bgOverlay,
  },
}));
