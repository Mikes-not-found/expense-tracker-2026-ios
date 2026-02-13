/**
 * Card — kawaii base card with soft shadows and pastel borders.
 */
import React, { type ReactNode } from 'react';
import { View, Platform, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles } from '../../utils/styles';

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
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  base: {
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' && {
      shadowColor: t.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    }),
    ...(Platform.OS === 'android' && {
      elevation: 3,
    }),
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
