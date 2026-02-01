/**
 * Spacing Scale
 * 
 * @module theme/spacing
 * @description 8pt grid spacing system for consistent layouts.
 * Based on Material Design and iOS Human Interface Guidelines.
 * 
 * Usage:
 *   import spacing from '../theme/spacing';
 *   <View style={{ padding: spacing.md }} />
 * 
 * Naming convention:
 *   xs = extra small (8px)
 *   sm = small (16px)
 *   md = medium (24px)
 *   lg = large (32px)
 *   xl = extra large (48px)
 *   xxl = extra extra large (64px)
 * 
 * @version 1.0.0
 */

const spacing = {
  // Base unit (8pt grid)
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
  
  // Micro-spacing (for fine-tuning)
  micro: 4,
  
  // Macro-spacing (for large sections)
  huge: 80,
  massive: 120,
};

export default spacing;