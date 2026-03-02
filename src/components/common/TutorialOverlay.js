import { View, Pressable, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';
import TUTORIAL_STEPS from '../../data/tutorialSteps';

/**
 * Full-screen tutorial overlay.
 *
 * Displays step-by-step guide with:
 * - Semi-transparent dark overlay
 * - Highlighted zone (cutout) for the current element
 * - Tooltip with title, text, step counter, and Next/Skip buttons
 *
 * @param {number} stepIndex          - Current tutorial step (0-based).
 * @param {Object} highlightLayout    - { x, y, width, height } of the highlighted element (null for center).
 * @param {Function} onNext           - Advance to next step.
 * @param {Function} onSkip           - Skip/exit tutorial.
 */
export default function TutorialOverlay({ stepIndex, highlightLayout, onNext, onSkip }) {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(true);

  const step = TUTORIAL_STEPS[stepIndex];
  const isLast = stepIndex === TUTORIAL_STEPS.length - 1;
  const isFirst = stepIndex === 0;
  const totalSteps = TUTORIAL_STEPS.length;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [stepIndex]);

  if (!step || !visible) return null;

  const isCentered = step.position === 'center' || !highlightLayout;

  // Highlight cutout padding
  const PAD = 8;
  const hl = highlightLayout ? {
    x: highlightLayout.x - PAD,
    y: highlightLayout.y - PAD,
    width: highlightLayout.width + PAD * 2,
    height: highlightLayout.height + PAD * 2,
  } : null;

  // Tooltip positioning
  const getTooltipStyle = () => {
    if (isCentered) {
      return {
        top: height * 0.35,
        left: SPACING.lg,
        right: SPACING.lg,
      };
    }

    if (step.position === 'bottom') {
      return {
        top: hl.y + hl.height + SPACING.md,
        left: SPACING.lg,
        right: SPACING.lg,
      };
    }

    // position === 'top'
    return {
      bottom: height - hl.y + SPACING.md,
      left: SPACING.lg,
      right: SPACING.lg,
    };
  };

  const renderOverlayWithCutout = () => {
    if (isCentered || !hl) {
      return <View style={[styles.dimFull, { width, height }]} />;
    }

    // 4 rectangles around the highlight cutout
    return (
      <>
        {/* Top */}
        <View style={[styles.dim, { top: 0, left: 0, right: 0, height: hl.y }]} />
        {/* Bottom */}
        <View style={[styles.dim, { top: hl.y + hl.height, left: 0, right: 0, bottom: 0 }]} />
        {/* Left */}
        <View style={[styles.dim, { top: hl.y, left: 0, width: hl.x, height: hl.height }]} />
        {/* Right */}
        <View style={[styles.dim, { top: hl.y, left: hl.x + hl.width, right: 0, height: hl.height }]} />
        {/* Highlight border */}
        <View style={[styles.highlightBorder, {
          top: hl.y,
          left: hl.x,
          width: hl.width,
          height: hl.height,
        }]} />
      </>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="box-none">
      {/* Overlay dim + cutout */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {renderOverlayWithCutout()}
      </View>

      {/* Full-screen touch catcher — tap anywhere to advance */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onNext}>
        {/* Tooltip */}
        <View style={[styles.tooltip, getTooltipStyle()]} pointerEvents="box-none">
          {/* Step counter */}
          <Text style={styles.stepCounter}>
            {stepIndex + 1} / {totalSteps}
          </Text>

          <Text style={styles.tooltipTitle}>{step.title}</Text>
          <Text style={styles.tooltipText}>{step.text}</Text>

          <View style={styles.buttonRow}>
            {!isLast && (
              <Pressable
                style={({ pressed }) => [styles.skipBtn, pressed && styles.skipBtnPressed]}
                onPress={onSkip}
              >
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [styles.nextBtn, pressed && styles.nextBtnPressed]}
              onPress={onNext}
            >
              <Text style={styles.nextText}>
                {step.confirmLabel || (isLast ? 'Finish' : 'Next')}
              </Text>
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
  stepCounter: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
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
  nextBtnPressed: {
    opacity: 0.85,
  },
  nextText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.white,
  },
});