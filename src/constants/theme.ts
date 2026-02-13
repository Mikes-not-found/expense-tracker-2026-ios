/**
 * Design Tokens — Kawaii Theme (Celi Expenses).
 * Pink/green pastel palette inspired by the HTML kawaii version.
 * Quicksand font for headings, Inter for body.
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
    sm: 12,
    md: 18,
    lg: 22,
    xl: 28,
    full: 9999,
  },

  fonts: {
    mono: 'Quicksand_400Regular',
    monoMedium: 'Quicksand_500Medium',
    monoSemiBold: 'Quicksand_600SemiBold',
    monoBold: 'Quicksand_700Bold',
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

/** Kawaii light theme — primary palette */
const kawaiiLightColors = {
  bgBase: '#fef9f0',
  bgSurface: '#ffffff',
  bgElevated: '#fff5f8',
  bgOverlay: '#ffeef8',
  bgInteractive: '#ffe4e1',

  accent: '#ff6b9d',
  accentHover: '#ff4081',
  accentMuted: 'rgba(255, 107, 157, 0.12)',
  accentGlow: 'rgba(255, 107, 157, 0.25)',

  green: '#7cb342',
  greenMuted: 'rgba(124, 179, 66, 0.12)',
  red: '#ef5350',
  redMuted: 'rgba(239, 83, 80, 0.10)',
  amber: '#ffb74d',
  amberMuted: 'rgba(255, 183, 77, 0.12)',
  purple: '#ab47bc',
  purpleMuted: 'rgba(171, 71, 188, 0.10)',

  textPrimary: '#558b2f',
  textSecondary: '#6d8b74',
  textMuted: '#a8bfa0',

  border: '#ffe4e1',
  borderHover: '#ffc0cb',
  borderActive: 'rgba(255, 107, 157, 0.4)',

  shadow: 'rgba(255, 154, 158, 0.15)',
  card: '#ffffff',
  tabBar: '#ffffff',
  statusBar: 'dark' as const,
} as const;

/** Kawaii dark theme — soft pastels on dark */
const kawaiiDarkColors = {
  bgBase: '#1a0f1e',
  bgSurface: '#241828',
  bgElevated: '#2d1e33',
  bgOverlay: '#352540',
  bgInteractive: '#3d2c48',

  accent: '#ff8fb4',
  accentHover: '#ffaac8',
  accentMuted: 'rgba(255, 143, 180, 0.15)',
  accentGlow: 'rgba(255, 143, 180, 0.30)',

  green: '#9ccc65',
  greenMuted: 'rgba(156, 204, 101, 0.15)',
  red: '#ef5350',
  redMuted: 'rgba(239, 83, 80, 0.15)',
  amber: '#ffcc80',
  amberMuted: 'rgba(255, 204, 128, 0.15)',
  purple: '#ce93d8',
  purpleMuted: 'rgba(206, 147, 216, 0.15)',

  textPrimary: '#f8e8f0',
  textSecondary: '#c8a8c0',
  textMuted: '#886880',

  border: 'rgba(255, 143, 180, 0.12)',
  borderHover: 'rgba(255, 143, 180, 0.20)',
  borderActive: 'rgba(255, 143, 180, 0.35)',

  shadow: '#000000',
  card: '#241828',
  tabBar: '#241828',
  statusBar: 'light' as const,
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

export const darkTheme: Theme = { colors: kawaiiDarkColors, ...shared };
export const lightTheme: Theme = { colors: kawaiiLightColors, ...shared };

/** Default export — kawaii light is the primary experience */
export const theme = lightTheme;
