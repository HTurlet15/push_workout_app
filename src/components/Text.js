import { Text as RNText, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

const variants = {
  hero:     { fontSize: FONT_SIZE.hero, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  headline: { fontSize: FONT_SIZE.headline, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  title:    { fontSize: FONT_SIZE.title, fontFamily: FONT_FAMILY.semibold, color: COLORS.textPrimary },
  subtitle: { fontSize: FONT_SIZE.subtitle, fontFamily: FONT_FAMILY.medium, color: COLORS.textPrimary },
  body:     { fontSize: FONT_SIZE.body, fontFamily: FONT_FAMILY.regular, color: COLORS.textPrimary },
  caption:  { fontSize: FONT_SIZE.caption, fontFamily: FONT_FAMILY.regular, color: COLORS.textSecondary },
};

export default function Text({ variant = 'body', style, children, ...props }) {
  return (
    <RNText style={[variants[variant], style]} {...props}>
      {children}
    </RNText>
  );
}