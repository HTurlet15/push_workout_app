import { View, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';
import { TUTORIAL_TEXTS } from '../../data/tutorialConfig';

/**
 * Custom tooltip for react-native-copilot.
 * Shows FR/EN toggle, translated text, step counter, Skip/Next buttons.
 */
export default function TutorialTooltip({ isFirstStep, isLastStep, handleNext, handlePrev, handleStop, currentStep }) {
  const [lang, setLang] = useState('en');

  const stepName = currentStep?.name || '';
  const texts = TUTORIAL_TEXTS[stepName];
  const t = texts ? (texts[lang] || texts.en) : { title: stepName, text: '' };

  // Count steps
  const stepNames = Object.keys(TUTORIAL_TEXTS);
  const currentIndex = stepNames.indexOf(stepName);
  const total = stepNames.length;

  return (
    <View style={styles.tooltip}>
      {/* Top row: counter + lang toggle */}
      <View style={styles.topRow}>
        <Text style={styles.counter}>{currentIndex + 1} / {total}</Text>
        <View style={styles.langToggle}>
          <Pressable
            style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
            onPress={() => setLang('en')}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>EN</Text>
          </Pressable>
          <Pressable
            style={[styles.langBtn, lang === 'fr' && styles.langBtnActive]}
            onPress={() => setLang('fr')}
          >
            <Text style={[styles.langText, lang === 'fr' && styles.langTextActive]}>FR</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.text}>{t.text}</Text>

      <View style={styles.buttonRow}>
        {!isLastStep && (
          <Pressable style={styles.skipBtn} onPress={handleStop}>
            <Text style={styles.skipText}>{lang === 'fr' ? 'Passer' : 'Skip'}</Text>
          </Pressable>
        )}
        <Pressable style={styles.nextBtn} onPress={isLastStep ? handleStop : handleNext}>
          <Text style={styles.nextText}>
            {isLastStep
              ? (lang === 'fr' ? "C'est parti" : 'Start Training')
              : (lang === 'fr' ? 'Suivant' : 'Next')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.smd,
  },
  counter: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.xs,
    padding: 1.5,
  },
  langBtn: {
    paddingVertical: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs,
  },
  langBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  langText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textMuted,
  },
  langTextActive: {
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.md,
  },
  skipBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  skipText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textMuted,
  },
  nextBtn: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.smd,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  nextText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.white,
  },
});