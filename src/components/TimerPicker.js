import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_FAMILY, SIZE, SHADOW } from '../theme/theme';

/**
 * Modal overlay with dual scroll wheel picker for rest timer duration.
 *
 * Layout: Minutes (0-10) and Seconds (0-55 in 5s steps) side by side,
 * with a highlighted selection band in the center row.
 *
 * Scroll behavior:
 * - Snaps to nearest item on momentum end
 * - Also snaps on slow drag release (velocity < 0.2)
 * - Top/bottom fade gradients indicate scrollable content
 *
 * Minimum selectable duration: 5 seconds (enforced on confirm).
 *
 * @param {boolean} visible          - Whether the picker overlay is shown.
 * @param {number} currentDuration   - Currently configured duration in seconds.
 * @param {Function} onConfirm       - Callback with selected duration in seconds.
 * @param {Function} onClose         - Callback to dismiss the picker.
 */

/** Layout constants for the scroll wheel */
const ITEM_HEIGHT = SIZE.wheelItemHeight;
const VISIBLE_ITEMS = SIZE.wheelVisibleItems;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

/** Data arrays for each wheel column */
const MINUTES = Array.from({ length: 11 }, (_, i) => i);         // 0–10
const SECONDS = Array.from({ length: 12 }, (_, i) => i * 5);     // 0, 5, 10, ..., 55

export default function TimerPicker({ visible, currentDuration, onConfirm, onClose }) {
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);
  const selectedMins = useRef(0);
  const selectedSecs = useRef(0);
  const [, forceRender] = useState(0);

  /**
   * When the modal opens, parse the current duration into minutes + seconds
   * and scroll both wheels to the correct position.
   */
  useEffect(() => {
    if (visible) {
      const mins = Math.floor(currentDuration / 60);
      const secs = Math.floor((currentDuration % 60) / 5) * 5;
      selectedMins.current = mins;
      selectedSecs.current = secs;
      forceRender((n) => n + 1);

      setTimeout(() => {
        minutesRef.current?.scrollTo({ y: mins * ITEM_HEIGHT, animated: false });
        secondsRef.current?.scrollTo({ y: (secs / 5) * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  }, [visible, currentDuration]);

  /**
   * Generic scroll end handler for both wheels.
   * Snaps to nearest item index and updates the corresponding ref.
   */
  const handleScrollEnd = useCallback((event, data, ref) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    ref.current = data[clamped];
    forceRender((n) => n + 1);
  }, []);

  /** Confirm selection: combine minutes + seconds, enforce 5s minimum */
  const handleConfirm = () => {
    const total = selectedMins.current * 60 + selectedSecs.current;
    onConfirm(Math.max(total, 5));
  };

  /**
   * Renders a single scroll wheel column.
   * Includes: selection band highlight, scrollable items, and fade gradients.
   */
  const renderWheel = (data, selectedRef, scrollRef, onEnd) => (
    <View style={styles.wheelColumn}>
      {/* Highlighted band behind the center (selected) row */}
      <View style={styles.selectionBand} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={true}
        overScrollMode="always"
        nestedScrollEnabled={true}
        onMomentumScrollEnd={(e) => onEnd(e, data, selectedRef)}
        onScrollEndDrag={(e) => {
          /* Snap on slow drag release (not enough momentum for onMomentumScrollEnd) */
          const v = e.nativeEvent.velocity?.y || 0;
          if (Math.abs(v) < 0.2) {
            onEnd(e, data, selectedRef);
          }
        }}
        contentContainerStyle={{ paddingVertical: PADDING }}
      >
        {data.map((value) => (
          <View key={value} style={styles.wheelItem}>
            <Text
              variant="title"
              style={[
                styles.wheelText,
                value === selectedRef.current && styles.wheelTextSelected,
              ]}
            >
              {String(value).padStart(2, '0')}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Top and bottom fade gradients to indicate overflow */}
      <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
        style={styles.fadeTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.fadeBottom}
        pointerEvents="none"
      />
    </View>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Modal title */}
        <Text variant="subtitle" style={styles.title}>Rest Timer</Text>

        {/* Dual wheel picker: minutes : seconds */}
        <View style={styles.wheelContainer}>
          {renderWheel(MINUTES, selectedMins, minutesRef, handleScrollEnd)}
          <Text variant="caption" style={styles.label}>min</Text>
          <Text variant="title" style={styles.colon}>:</Text>
          {renderWheel(SECONDS, selectedSecs, secondsRef, handleScrollEnd)}
          <Text variant="caption" style={styles.label}>sec</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnCancel, pressed && styles.btnCancelPressed]}
            onPress={onClose}
          >
            <Text variant="body" style={styles.btnCancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnConfirm, pressed && styles.btnConfirmPressed]}
            onPress={handleConfirm}
          >
            <Text variant="body" style={styles.btnConfirmText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Full-screen dimmed overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  /** Modal card with elevated shadow */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: 280,
    ...SHADOW.modal,
  },
  /** Modal title */
  title: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  /** Horizontal container for both wheel columns and labels */
  wheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  /** Single wheel column with fixed width and hidden overflow */
  wheelColumn: {
    width: SIZE.wheelWidth,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
  },
  /** Highlighted band behind the selected value */
  selectionBand: {
    position: 'absolute',
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.timerResetBg,
    borderRadius: RADIUS.sm,
    zIndex: 0,
  },
  /** Individual wheel item container */
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Unselected wheel text: muted */
  wheelText: {
    color: COLORS.mediumGray,
    fontFamily: FONT_FAMILY.semibold,
  },
  /** Selected wheel text: primary */
  wheelTextSelected: {
    color: COLORS.textPrimary,
  },
  /** Top fade gradient for scroll overflow indication */
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    zIndex: 2,
  },
  /** Bottom fade gradient */
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    zIndex: 2,
  },
  /** Unit labels (min, sec) */
  label: {
    color: COLORS.textSecondary,
  },
  /** Colon separator between wheels */
  colon: {
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.bold,
  },
  /** Button row */
  buttons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  /** Shared button base */
  btn: {
    flex: 1,
    paddingVertical: SPACING.sm + SPACING.xs,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  /** Cancel button: neutral gray */
  btnCancel: {
    backgroundColor: COLORS.timerResetBg,
  },
  btnCancelPressed: {
    backgroundColor: COLORS.timerResetPressedBg,
  },
  btnCancelText: {
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.semibold,
  },
  /** Confirm button: dark primary */
  btnConfirm: {
    backgroundColor: COLORS.black,
  },
  btnConfirmPressed: {
    backgroundColor: COLORS.btnDarkPressed,
  },
  btnConfirmText: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.semibold,
  },
});