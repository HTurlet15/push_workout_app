/**
 * Color Palette
 * 
 * @module theme/colors
 * @description Monochromatic color system for Push fitness app.
 * Follows a minimalist design philosophy inspired by modern fintech apps.
 * 
 * Usage:
 *   import colors from '../theme/colors';
 *   <View style={{ backgroundColor: colors.gray100 }} />
 * 
 * @author Hugo Turlet
 * @version 1.0.0
 */

const colors = {
  // Base colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Gray scale (900 = darkest, 100 = lightest)
  gray900: '#1A1A1A', // Primary text
  gray800: '#2E2E2E', // Dark borders
  gray700: '#4A4A4A', // Secondary text
  gray600: '#6B6B6B', // Inactive icons
  gray500: '#9E9E9E', // Placeholders
  gray400: '#BDBDBD', // Light borders
  gray300: '#D4D4D4', // Subtle backgrounds
  gray200: '#E8E8E8', // Dividers
  gray100: '#F5F5F5', // Very light backgrounds
  
  // Accent color (sparingly used for CTAs)
  accent: '#0A84FF', // iOS blue
  
  // Success/Progress colors (NEW)
  green: '#10B981',
  green100: '#D1FAE5',
  green500: '#10B981',
  green700: '#047857',

};

export default colors;