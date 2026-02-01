/**
 * Typography System
 * 
 * @module theme/typography
 * @description Type scale and font styles for consistent text hierarchy.
 * Uses system fonts for optimal performance and native feel.
 * 
 * Usage:
 *   import typography from '../theme/typography';
 *   <Text style={typography.h1}>Title</Text>
 *   <Text style={typography.body}>Regular text</Text>
 * 
 * Scale:
 *   h1 = 32px / Bold (Page titles)
 *   h2 = 24px / Semibold (Section headers)
 *   h3 = 20px / Semibold (Subsections)
 *   body = 16px / Regular (Main content)
 *   bodyBold = 16px / Semibold (Emphasized content)
 *   caption = 14px / Regular (Secondary info)
 *   small = 12px / Regular (Footnotes, timestamps)
 * 
 * @version 1.0.0
 */

import { Platform } from 'react-native';

/**
 * System font families for iOS and Android
 * Uses native sans-serif fonts for best performance
 */
const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
};

/**
 * Font weights (cross-platform compatible)
 */
const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/**
 * Typography styles ready to use in <Text> components
 */
const typography = {
  // Headings
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: fontWeight.bold,
    lineHeight: 40,
    letterSpacing: -0.5, // Tighter for large text
  },
  
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: fontWeight.semibold,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  
  h3: {
    fontFamily: fontFamily.medium,
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  
  // Body text
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: fontWeight.regular,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  bodyBold: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Secondary text
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: fontWeight.regular,
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  small: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: fontWeight.regular,
    lineHeight: 16,
    letterSpacing: 0.2, // Slightly wider for legibility
  },
};

export default typography;