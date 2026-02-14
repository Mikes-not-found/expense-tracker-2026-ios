/**
 * Style utilities — DRY helpers for theme-aware style creation.
 * Web version: returns React.CSSProperties objects instead of StyleSheet.
 */
import { useMemo } from 'react';
import { useTheme } from '../store/ThemeContext';
import { theme, type Theme } from '../constants/theme';

/** Static helper — builds styles once using the default theme */
export const createStyles = <T extends Record<string, React.CSSProperties>>(
  factory: (t: Theme) => T
): T => factory(theme);

/**
 * Dynamic style factory — returns a hook that rebuilds styles when theme changes.
 * Usage:
 *   const useStyles = makeStyles((t) => ({ ... }));
 *   const styles = useStyles();
 */
export const makeStyles = <T extends Record<string, React.CSSProperties>>(
  factory: (t: Theme) => T
) => {
  return (): T => {
    const { theme: currentTheme } = useTheme();
    return useMemo(() => factory(currentTheme), [currentTheme]);
  };
};
