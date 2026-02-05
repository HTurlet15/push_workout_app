/**
 * Push — Design System Tokens
 *
 * Single source of truth for all visual styling across the app.
 * Every component must reference these tokens instead of hardcoding values.
 * Built around a minimal, monochromatic aesthetic inspired by modern fintech apps.
 */

export const COLORS = {
  background: '#FFFFFF',
  surface: '#F8F8F8',

  textPrimary: '#1A1A1A',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',

  accent: '#2D2D2D',

  border: '#E5E5EA',
  success: '#34C759',
  destructive: '#FF3B30',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  caption: 12,
  body: 16,
  title: 20,
  headline: 28,
  hero: 34,
};

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
};