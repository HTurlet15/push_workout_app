import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../components/common/Text';
import { useData } from '../context/DataContext';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../theme/theme';

/**
 * Settings screen — language selection and future app preferences.
 *
 * Displayed as a full-screen overlay from MainScreen.
 * The language toggle calls DataContext.setLanguage() which persists
 * the choice to AsyncStorage and updates i18next globally.
 *
 * @param {Function} onClose - Callback to dismiss this screen.
 */
export default function SettingsScreen({ onClose }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useData();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          onPress={onClose}
        >
          <Feather name="chevron-down" size={SIZE.iconXs} color={COLORS.textSecondary} />
          <Text style={styles.backBtnText}>{t('settings.title')}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Language section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.languageLabel')}</Text>

          <View style={styles.card}>
            {/* English option */}
            <Pressable
              style={({ pressed }) => [
                styles.optionRow,
                pressed && styles.optionRowPressed,
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text style={styles.optionText}>{t('settings.english')}</Text>
              {language === 'en' && (
                <Feather name="check" size={SIZE.iconMd} color={COLORS.viewCurrent} />
              )}
            </Pressable>

            <View style={styles.separator} />

            {/* French option */}
            <Pressable
              style={({ pressed }) => [
                styles.optionRow,
                pressed && styles.optionRowPressed,
              ]}
              onPress={() => setLanguage('fr')}
            >
              <Text style={styles.optionText}>{t('settings.french')}</Text>
              {language === 'fr' && (
                <Feather name="check" size={SIZE.iconMd} color={COLORS.viewCurrent} />
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  header: {
    paddingVertical: SPACING.sm,
    minHeight: SIZE.touchTargetLg,
    justifyContent: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    height: SIZE.touchTarget,
    alignSelf: 'flex-start',
  },
  backBtnPressed: {
    opacity: 0.5,
  },
  backBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.semibold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    minHeight: SIZE.cardRowHeight,
  },
  optionRowPressed: {
    backgroundColor: COLORS.lightGray,
  },
  optionText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginLeft: SPACING.md,
  },
});
