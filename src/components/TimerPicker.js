import { View, ScrollView, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import Text from './Text';
import { COLORS, SPACING, RADIUS } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Modal with scroll wheel picker for setting rest timer duration.
 * Two columns: minutes (0-10) and seconds (0-55 in steps of 5).
 *
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is shown.
 * @param {number} props.currentDuration - Currently selected duration in seconds.
 * @param {Function} props.onConfirm - Callback with selected duration in seconds.
 * @param {Function} props.onClose - Callback to close the modal.
 */

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);
const MINUTES = Array.from({ length: 11 }, (_, i) => i);
const SECONDS = Array.from({ length: 12 }, (_, i) => i * 5);

export default function TimerPicker({ visible, currentDuration, onConfirm, onClose }) {
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);
  const selectedMins = useRef(0);
  const selectedSecs = useRef(0);
  const [, forceRender] = useState(0);

  /** Initialize picker position when modal opens */
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

  const handleScrollEnd = useCallback((event, data, ref) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    ref.current = data[clamped];
    forceRender((n) => n + 1);
  }, []);

  const handleConfirm = () => {
    const total = selectedMins.current * 60 + selectedSecs.current;
    onConfirm(Math.max(total, 5));
  };

  const renderWheel = (data, selectedRef, scrollRef, onEnd) => (
    <View style={styles.wheelColumn}>
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
              variant="headline"
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
        <Text variant="subtitle" style={styles.title}>Rest Timer</Text>

        <View style={styles.wheelContainer}>
            {renderWheel(MINUTES, selectedMins, minutesRef, handleScrollEnd)}
            <Text variant="caption" style={styles.label}>min</Text>
            <Text variant="title" style={styles.colon}>:</Text>
            {renderWheel(SECONDS, selectedSecs, secondsRef, handleScrollEnd)}
            <Text variant="caption" style={styles.label}>sec</Text>
        </View>

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
    );}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: 280,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: SPACING.xs },
    shadowOpacity: 0.1,
    shadowRadius: SPACING.md,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  wheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  wheelColumn: {
    width: 80,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
  },
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
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    color: COLORS.mediumGray,
    fontWeight: '600',
  },
  wheelTextSelected: {
    color: COLORS.textPrimary,
  },
  fadeTop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: ITEM_HEIGHT * 1.5,
  zIndex: 2,
},
fadeBottom: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: ITEM_HEIGHT * 1.5,
  zIndex: 2,
},
  label: {
    color: COLORS.textSecondary,
  },
  colon: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btn: {
    flex: 1,
    paddingVertical: SPACING.sm + SPACING.xs,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: COLORS.timerResetBg,
  },
  btnCancelPressed: {
    backgroundColor: COLORS.timerResetPressedBg,
  },
  btnCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  btnConfirm: {
    backgroundColor: COLORS.textPrimary,
  },
  btnConfirmPressed: {
    backgroundColor: COLORS.addBtnPressed,
  },
  btnConfirmText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});