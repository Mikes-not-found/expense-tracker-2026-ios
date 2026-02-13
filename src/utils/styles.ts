import { StyleSheet } from 'react-native';
import { theme, type Theme } from '../constants/theme';

/**
 * DRY helper — create StyleSheet with theme access.
 * Avoids repeating `theme.colors.xxx` imports in every component.
 *
 * Usage:
 *   const styles = createStyles((t) => ({
 *     container: { backgroundColor: t.colors.bgBase },
 *   }));
 */
export const createStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: (t: Theme) => T
): T => StyleSheet.create(factory(theme));
