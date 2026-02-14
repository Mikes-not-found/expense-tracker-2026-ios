/**
 * Card — kawaii base card with soft shadows and pastel borders.
 */
import React, { type ReactNode } from 'react';
import { makeStyles } from '../../utils/styles';

type CardVariant = 'surface' | 'elevated' | 'overlay';

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  children,
  style,
}) => {
  const styles = useStyles();
  return (
    <div style={{ ...styles.base, ...styles[variant], ...style }}>
      {children}
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  base: {
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
    boxShadow: `0 4px 12px ${t.colors.shadow}`,
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
