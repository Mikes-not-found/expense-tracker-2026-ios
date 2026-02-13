/**
 * Style utilities — DRY helpers for theme-aware StyleSheet creation.
 *
 * - `createStyles` — static (uses dark theme at import time, for non-themed usage)
 * - `makeStyles`   — dynamic factory, call inside components with current theme
 */
import { StyleSheet } from 'react-native';
import { theme, type Theme } from '../constants/theme';
import { useMemo } from 'react';
import { useTheme } from '../store/ThemeContext';

/** Static helper — builds StyleSheet once using the dark theme (legacy compat) */
export const createStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: (t: Theme) => T
): T => StyleSheet.create(factory(theme));

/**
 * Dynamic style factory — returns a hook that rebuilds styles when theme changes.
 * Usage:
 *   const useStyles = makeStyles((t) => ({ ... }));
 *   const styles = useStyles();
 */
export const makeStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: (t: Theme) => T
) => {
  return (): T => {
    const { theme: currentTheme } = useTheme();
    return useMemo(() => StyleSheet.create(factory(currentTheme)), [currentTheme]);
  };
};
