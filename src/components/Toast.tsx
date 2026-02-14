/**
 * Toast — kawaii notification with pink-themed styling.
 */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

const SingleToast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [fading, setFading] = useState(false);

  const toastColors: Record<string, { bg: string; text: string }> = {
    success: { bg: theme.colors.green, text: '#ffffff' },
    error: { bg: theme.colors.red, text: '#ffffff' },
    info: { bg: theme.colors.accent, text: '#ffffff' },
  };

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2700);
    return () => clearTimeout(fadeTimer);
  }, []);

  const colors = toastColors[toast.type] ?? toastColors.info;

  return (
    <div
      style={{
        ...styles.toast,
        backgroundColor: colors.bg,
        color: colors.text,
        animation: fading ? 'toastOut 0.3s forwards' : 'toastIn 0.35s ease-out',
      }}
    >
      <span style={styles.toastText}>{toast.message}</span>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const styles = useStyles();
  if (toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <SingleToast key={t.id} toast={t} />
      ))}
    </div>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    position: 'fixed',
    bottom: t.spacing.xl + 60,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
    gap: t.spacing.sm,
    pointerEvents: 'none',
  },
  toast: {
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.md,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.lg,
    borderRadius: t.radius.full,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  toastText: {
    fontFamily: t.fonts.monoBold,
    fontWeight: t.fontWeights.monoBold,
    fontSize: t.fontSize.sm + 1,
  },
}));
