/**
 * Push — Design System Tokens
 *
 * Single source of truth for all visual styling across the app.
 * Every component must reference these tokens instead of hardcoding values.
 * Built around a minimal, monochromatic aesthetic inspired by modern fintech apps.
 */

export const COLORS = {
  white: '#FFFFFF',
  screenBackground: '#f7f7f7',

  textPrimary: '#1A1A1A',
  textSecondary: '#8E8E93',

  lightBlue: '#B6C0FF',
  mediumBlue: '#007AFF',

  lightGray: '#f7f7f7',
  selectedInput: '#d6d6d6',
  mediumGray: '#C0C0C0',
  darkGray: '#C0C0C0',

  successLight: '#E8F5E9',

  //SetInput = Badges
  badgePressed: '#ECECEC',
  completedBadge: '#D4EDDA',
  
  // Timer states
  timerIdle: '#C0C0C0',
  timerActive: '#E65100',
  timerActiveBg: '#FFF3E0',
  timerDone: '#2E7D32',
  timerDoneBg: '#E8F5E9',
  timerResetBg: '#F4F4F4',
  timerIdlePressedBg: '#C8E6C9',
  timerActivePressedBg: '#FFE0B2',
  timerDonePressedBg: '#C8E6C9',
  timerResetPressedBg: '#EAEAEA',
  addBtnPressed: '#333333',

  // View accents
  viewPrevious: '#8E8E93',
  viewCurrent: '#007AFF',
  viewNext: '#E65100',
  viewNextBg: '#FFF8F0',
  viewNextBadge: '#FFF3E0',
  viewPreviousBg: '#F4F4F4',
  
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
  small: 10,
  caption: 13,
  subtitle: 14,
  body: 15,
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
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
};

export const SET_TABLE = {
  headerHeight: 32,
};

export const FONT_FAMILY = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  semibold: 'DMSans-SemiBold',
  bold: 'DMSans-Bold',
};