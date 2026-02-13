/**
 * Design Tokens — Single Source of Truth.
 * Supports both dark and light themes.
 * Use `as const` for full type inference.
 */

/** Shared tokens (spacing, radius, fonts, fontSize) — same in both themes */
const shared = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  fonts: {
    mono: 'JetBrainsMono-Regular',
    monoMedium: 'JetBrainsMono-Medium',
    monoSemiBold: 'JetBrainsMono-SemiBold',
    monoBold: 'JetBrainsMono-Bold',
    sans: 'Inter-Regular',
    sansMedium: 'Inter-Medium',
    sansSemiBold: 'Inter-SemiBold',
    sansBold: 'Inter-Bold',
  },

  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
} as const;

/** Dark theme color palette */
const darkColors = {
  bgBase: '#0a0e14',
  bgSurface: '#111820',
  bgElevated: '#1a2230',
  bgOverlay: '#1e2a3a',
  bgInteractive: '#253040',

  accent: '#4fc3f7',
  accentHover: '#81d4fa',
  accentMuted: 'rgba(79, 195, 247, 0.12)',
  accentGlow: 'rgba(79, 195, 247, 0.25)',

  green: '#66bb6a',
  greenMuted: 'rgba(102, 187, 106, 0.12)',
  red: '#ef5350',
  redMuted: 'rgba(239, 83, 80, 0.12)',
  amber: '#ffca28',
  amberMuted: 'rgba(255, 202, 40, 0.12)',
  purple: '#ab47bc',
  purpleMuted: 'rgba(171, 71, 188, 0.12)',

  textPrimary: '#e3e8ef',
  textSecondary: '#8899aa',
  textMuted: '#556677',

  border: 'rgba(255, 255, 255, 0.06)',
  borderHover: 'rgba(255, 255, 255, 0.12)',
  borderActive: 'rgba(79, 195, 247, 0.3)',

  shadow: '#000000',
  card: '#111820',
  tabBar: '#111820',
  statusBar: 'light' as const,
} as const;

/** Light theme color palette */
const lightColors = {
  bgBase: '#f5f6fa',
  bgSurface: '#ffffff',
  bgElevated: '#f0f1f5',
  bgOverlay: '#e8eaf0',
  bgInteractive: '#e2e4ea',

  accent: '#1e88e5',
  accentHover: '#1565c0',
  accentMuted: 'rgba(30, 136, 229, 0.10)',
  accentGlow: 'rgba(30, 136, 229, 0.18)',

  green: '#43a047',
  greenMuted: 'rgba(67, 160, 71, 0.10)',
  red: '#e53935',
  redMuted: 'rgba(229, 57, 53, 0.10)',
  amber: '#f9a825',
  amberMuted: 'rgba(249, 168, 37, 0.10)',
  purple: '#8e24aa',
  purpleMuted: 'rgba(142, 36, 170, 0.10)',

  textPrimary: '#1a1a2e',
  textSecondary: '#5a6070',
  textMuted: '#9099a8',

  border: 'rgba(0, 0, 0, 0.08)',
  borderHover: 'rgba(0, 0, 0, 0.14)',
  borderActive: 'rgba(30, 136, 229, 0.3)',

  shadow: 'rgba(0, 0, 0, 0.08)',
  card: '#ffffff',
  tabBar: '#ffffff',
  statusBar: 'dark' as const,
} as const;

export type ThemeMode = 'dark' | 'light';

/** Theme color interface — widened from literal types so both themes satisfy it */
export interface ThemeColors {
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  bgOverlay: string;
  bgInteractive: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  accentGlow: string;
  green: string;
  greenMuted: string;
  red: string;
  redMuted: string;
  amber: string;
  amberMuted: string;
  purple: string;
  purpleMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderHover: string;
  borderActive: string;
  shadow: string;
  card: string;
  tabBar: string;
  statusBar: 'light' | 'dark';
}

/** Full theme type — colors + shared tokens */
export interface Theme {
  colors: ThemeColors;
  spacing: typeof shared.spacing;
  radius: typeof shared.radius;
  fonts: typeof shared.fonts;
  fontSize: typeof shared.fontSize;
}

export const darkTheme: Theme = { colors: darkColors, ...shared };
export const lightTheme: Theme = { colors: lightColors, ...shared };

/** Legacy default export for backward compat during migration */
export const theme = darkTheme;
