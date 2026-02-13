/**
 * Button — reusable button with variants.
 * Open/Closed Principle: add new variants without modifying existing code.
 */
import React, { type ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { createStyles } from '../../utils/styles';
import { theme } from '../../constants/theme';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  onPress: () => void;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  small?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: {
    bg: theme.colors.accent,
    text: theme.colors.bgBase,
    border: theme.colors.accent,
  },
  success: {
    bg: theme.colors.green,
    text: theme.colors.bgBase,
    border: theme.colors.green,
  },
  danger: {
    bg: theme.colors.redMuted,
    text: theme.colors.red,
    border: 'transparent',
  },
  ghost: {
    bg: 'transparent',
    text: theme.colors.textSecondary,
    border: theme.colors.border,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onPress,
  children,
  icon,
  disabled = false,
  style,
  small = false,
}) => {
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.5 : 1,
        },
        small && styles.small,
        style,
      ]}
    >
      {icon}
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: v.text }, small && styles.textSmall]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = createStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.sm,
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.md,
    borderWidth: 1,
    borderRadius: t.radius.sm,
  },
  small: {
    paddingVertical: t.spacing.xs + 2,
    paddingHorizontal: t.spacing.sm + 4,
  },
  text: {
    fontFamily: t.fonts.monoSemiBold,
    fontSize: t.fontSize.sm + 1,
  },
  textSmall: {
    fontSize: t.fontSize.sm,
  },
}));
