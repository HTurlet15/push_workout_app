import { Text as RNText } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../theme/theme';

/**
 * Predefined text style variants mapped to the design system tokens.
 * Each variant enforces consistent typography across the app.
 */
const variants = {
  hero: {
    fontSize: FONT_SIZE.hero,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  headline: {
    fontSize: FONT_SIZE.headline,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.textPrimary,
  },
  caption: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.textSecondary,
  },
};

/**
 * Custom Text component that wraps React Native's Text.
 * Ensures all rendered text follows the design system.
 *
 * @param {Object} props
 * @param {'hero'|'headline'|'title'|'body'|'caption'} [props.variant='body'] - Typography variant to apply.
 * @param {Object} [props.style] - Optional style overrides (merged after variant styles).
 * @param {React.ReactNode} props.children - Text content to render.
 */
export default function Text({ variant = 'body', style, children, ...props }) {
  return (
    <RNText style={[variants[variant], style]} {...props}>
      {children}
    </RNText>
  );
}