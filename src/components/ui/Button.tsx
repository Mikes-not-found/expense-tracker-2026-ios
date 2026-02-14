/**
 * Button — kawaii button with rounded pill shapes and pastel colors.
 */
import React, { type ReactNode } from 'react';
import { makeStyles } from '../../utils/styles';
import { useTheme } from '../../store/ThemeContext';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  small?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  icon,
  disabled = false,
  style,
  small = false,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();

  const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
    primary: {
      bg: theme.colors.accent,
      text: '#ffffff',
      border: theme.colors.accent,
    },
    success: {
      bg: theme.colors.green,
      text: '#ffffff',
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

  const v = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.base,
        backgroundColor: v.bg,
        borderColor: v.border,
        color: v.text,
        opacity: disabled ? 0.5 : 1,
        ...(small ? styles.small : {}),
        ...style,
      }}
    >
      {icon}
      <span style={{
        fontFamily: theme.fonts.monoBold,
        fontWeight: theme.fontWeights.monoBold,
        fontSize: small ? theme.fontSize.sm : theme.fontSize.sm + 1,
      }}>
        {children}
      </span>
    </button>
  );
};

const useStyles = makeStyles((t) => ({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.sm,
    paddingTop: t.spacing.sm + 2,
    paddingBottom: t.spacing.sm + 2,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: t.radius.full,
    cursor: 'pointer',
    outline: 'none',
    transition: 'opacity 0.15s, transform 0.1s',
    WebkitTapHighlightColor: 'transparent',
  },
  small: {
    paddingTop: t.spacing.xs + 3,
    paddingBottom: t.spacing.xs + 3,
    paddingLeft: t.spacing.md,
    paddingRight: t.spacing.md,
  },
}));
