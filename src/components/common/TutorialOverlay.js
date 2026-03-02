import { View, Pressable, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';
import TUTORIAL_STEPS from '../../data/tutorialSteps';

/**
 * Full-screen tutorial overlay with FR/EN toggle.
 *
 * @param {number} stepIndex          - Current tutorial step (0-based).
 * @param {Object} highlightLayout    - { x, y, width, height } of highlighted element.
 * @param {Function} onNext           - Advance to next step.
 * @param {Function} onSkip           - Skip/exit tutorial.
 */
export default function TutorialOverlay({ stepIndex, highlightLayout, onNext, onSkip }) {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [lang, setLang] = useState('en');

  const step = TUTORIAL_STEPS[stepIndex];
  const isLast = stepIndex === TUTORIAL_STEPS.length - 1;
  const totalSteps = TUTORIAL_STEPS.length;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [stepIndex]);

  if (!step) return null;

  const t = step[lang] || step.en;
  const isCentered = step.position === 'center' || !highlightLayout;

  const PAD = 8;
  const hl = highlightLayout ? {
    x: highlightLayout.x - PAD,
    y: highlightLayout.y - PAD,
    width: highlightLayout.width + PAD * 2,
    height: highlightLayout.height + PAD * 2,
  } : null;

  const getTooltipStyle = () => {
    if (isCentered) {
      return { top: height * 0.32, left: SPACING.lg, right: SPACING.lg };
    }
    if (step.position === 'bottom') {
      return { top: hl.y + hl.height + SPACING.md, left: SPACING.lg, right: SPACING.lg };
    }
    return { bottom: height - hl.y + SPACING.md, left: SPACING.lg, right: SPACING.lg };
  };

  const renderOverlay = () => {
    if (isCentered || !hl) {
      return <View style={[styles.dimFull, { width, height }]} />;
    }
    return (
      <>
        <View style={[styles.dim, { top: 0, left: 0, right: 0, height: hl.y }]} />
        <View style={[styles.dim, { top: hl.y + hl.height, left: 0, right: 0, bottom: 0 }]} />
        <View style={[styles.dim, { top: hl.y, left: 0, width: hl.x, height: hl.height }]} />
        <View style={[styles.dim, { top: hl.y, left: hl.x + hl.width, right: 0, height: hl.height }]} />
        <View style={[styles.highlightBorder, { top: hl.y, left: hl.x, width: hl.width, height: hl.height }]} />
      </>
    );
  };

  const confirmText = step.confirmLabel
    ? (typeof step.confirmLabel === 'string' ? step.confirmLabel : step.confirmLabel[lang] || step.confirmLabel.en)
    : (isLast ? (lang === 'fr' ? 'Terminer' : 'Finish') : (lang === 'fr' ? 'Suivant' : 'Next'));

  const skipText = lang === 'fr' ? 'Passer' : 'Skip';

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="box-none">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {renderOverlay()}
      </View>

      <Pressable style={StyleSheet.absoluteFill} onPress={onNext}>
        <View style={[styles.tooltip, getTooltipStyle()]} pointerEvents="box-none">

          {/* Top row: step counter + language toggle */}
          <View style={styles.topRow}>
            <Text style={styles.stepCounter}>{stepIndex + 1} / {totalSteps}</Text>

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

          <Text style={styles.tooltipTitle}>{t.title}</Text>
          <Text style={styles.tooltipText}>{t.text}</Text>

          <View style={styles.buttonRow}>
            {!isLast && (
              <Pressable
                style={({ pressed }) => [styles.skipBtn, pressed && styles.skipBtnPressed]}
                onPress={onSkip}
              >
                <Text style={styles.skipBtnText}>{skipText}</Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [styles.nextBtn, pressed && styles.nextBtnPressed]}
              onPress={onNext}
            >
              <Text style={styles.nextBtnText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  dimFull: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  dim: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  highlightBorder: {
    position: 'absolute',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  tooltip: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
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
  stepCounter: {
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
    letterSpacing: 0.3,
  },
  langTextActive: {
    color: COLORS.textPrimary,
  },

  tooltipTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  tooltipText: {
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
  skipBtnPressed: {
    opacity: 0.5,
  },
  skipBtnText: {
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
  nextBtnPressed: {
    opacity: 0.85,
  },
  nextBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.white,
  },
});