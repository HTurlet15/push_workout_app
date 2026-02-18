import { Text as RNText } from 'react-native';
import { COLORS, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

/**
 * Design system Text component.
 *
 * Wraps React Native's Text with predefined typography variants.
 * Each variant maps to a specific UI role, ensuring consistent
 * font size, family, and color across the app.
 *
 * Variants can be overridden with the style prop for one-off adjustments
 * (e.g. changing color on a caption), but font sizes and families
 * should always come from theme tokens.
 *
 * @param {'hero'|'screenTitle'|'title'|'exercise'|'body'|'subtitle'|'caption'|'tableHeader'|'small'} variant
 * @param {object} style - Optional style overrides (applied after variant).
 * @param {React.ReactNode} children - Text content.
 */

const variants = {
  hero:        { fontSize: FONT_SIZE.hero, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  screenTitle: { fontSize: FONT_SIZE.xl, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  title:       { fontSize: FONT_SIZE.title, fontFamily: FONT_FAMILY.semibold, color: COLORS.textPrimary },
  exercise:    { fontSize: FONT_SIZE.lg, fontFamily: FONT_FAMILY.semibold, color: COLORS.textPrimary },
  subtitle:    { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY.medium, color: COLORS.textPrimary },
  body:        { fontSize: FONT_SIZE.body, fontFamily: FONT_FAMILY.regular, color: COLORS.textPrimary },
  caption:     { fontSize: FONT_SIZE.caption, fontFamily: FONT_FAMILY.regular, color: COLORS.textSecondary },
  tableHeader: { fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY.semibold, color: COLORS.textPrimary },
  small:       { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY.bold, color: COLORS.textSecondary },
};

export default function Text({ variant = 'body', style, children, ...props }) {
  return (
    <RNText style={[variants[variant], style]} {...props}>
      {children}
    </RNText>
  );
}