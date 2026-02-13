/**
 * Design Tokens — Single Source of Truth
 * Mirrors the CSS custom properties from the PWA version.
 * Use `as const` for full type inference.
 */
export const theme = {
  colors: {
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
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 20,
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

export type Theme = typeof theme;
