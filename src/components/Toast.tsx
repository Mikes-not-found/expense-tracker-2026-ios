/**
 * Toast — notification system with animated entries.
 * Matches PWA's toast behavior (auto-dismiss after 3.2s).
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { makeStyles } from '../utils/styles';
import { useTheme } from '../store/ThemeContext';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

const SingleToast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const toastColors: Record<string, { bg: string; text: string }> = {
    success: { bg: theme.colors.green, text: theme.colors.bgBase },
    error: { bg: theme.colors.red, text: '#ffffff' },
    info: { bg: theme.colors.accent, text: theme.colors.bgBase },
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const fadeTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -10, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 2700);

    return () => clearTimeout(fadeTimer);
  }, []);

  const colors = toastColors[toast.type] ?? toastColors.info;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: colors.bg, transform: [{ translateY }], opacity },
      ]}
    >
      <Text style={[styles.toastText, { color: colors.text }]}>{toast.message}</Text>
    </Animated.View>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const styles = useStyles();
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {toasts.map((t) => (
        <SingleToast key={t.id} toast={t} />
      ))}
    </View>
  );
};

const useStyles = makeStyles((t) => ({
  container: {
    position: 'absolute',
    bottom: t.spacing.xl + 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    gap: t.spacing.sm,
  },
  toast: {
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    fontFamily: t.fonts.monoMedium,
    fontSize: t.fontSize.sm + 1,
  },
}));
