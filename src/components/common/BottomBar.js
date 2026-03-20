import { View, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_FAMILY, FONT_SIZE, SIZE, SHADOW } from '../../theme/theme';

/**
 * Persistent bottom navigation bar for the workout session.
 *
 * Five buttons (left to right), each with a circular icon and a label beneath:
 * 1. Coach IA — outlined circle with pulsing star
 * 2. Play/Pause/Check — controls the rest timer lifecycle
 * 3. Timer display — tappable to open duration picker
 * 4. Reset — resets timer to configured duration
 * 5. Edit toggle — switches between workout mode and edit mode
 *
 * @param {'idle'|'running'|'done'} timerState - Current timer lifecycle state.
 * @param {number} timeRemaining              - Seconds left on the timer.
 * @param {boolean} editMode                  - Whether edit mode is currently active.
 * @param {Function} onPlayPause              - Toggle timer play/pause.
 * @param {Function} onReset                  - Reset timer to configured duration.
 * @param {Function} onTimerPress             - Open timer duration picker.
 * @param {Function} onEditToggle             - Toggle edit mode on/off.
 * @param {Function} onLLMPress               - Open Coach IA panel.
 * @param {number} bottomInset                - Safe area bottom inset for notch devices.
 */
export default function BottomBar({
  timerState = 'idle',
  timeRemaining = 90,
  editMode = false,
  onPlayPause,
  onReset,
  onTimerPress,
  onEditToggle,
  onLLMPress,
  bottomInset = 0,
}) {
  // ── Coach star pulse animation ─────────────────────────────
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.2,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.75,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  /** Format seconds into M:SS display string */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /** Map timer state to appropriate Feather icon name */
  const getPlayIcon = () => {
    if (timerState === 'done') return 'check';
    if (timerState === 'running') return 'pause';
    return 'play';
  };

  /** Map timer state to play button background style */
  const getPlayStyle = () => {
    if (timerState === 'done') return styles.playDone;
    if (timerState === 'running') return styles.playActive;
    return styles.playIdle;
  };

  /** Map timer state to play button pressed style */
  const getPlayPressedStyle = () => {
    if (timerState === 'done') return styles.playDonePressed;
    if (timerState === 'running') return styles.playActivePressed;
    return styles.playIdlePressed;
  };

  /** Map timer state to play icon color */
  const getPlayIconColor = () => {
    if (timerState === 'done') return COLORS.timerDone;
    if (timerState === 'running') return COLORS.timerActive;
    return COLORS.timerDone;
  };

  /** Map timer state to timer text color style */
  const getTimerTextStyle = () => {
    if (timerState === 'done') return styles.timerDone;
    if (timerState === 'running') return styles.timerActive;
    return styles.timerIdle;
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomInset + SPACING.md }]}>

      {/* Coach IA — outlined circle with pulsing star */}
      <Pressable
        style={({ pressed }) => [styles.outlinedCircle, pressed && styles.pressedOpacity]}
        onPress={onLLMPress}
      >
        <Animated.View style={{ transform: [{ scale: pulseScale }], opacity: pulseOpacity }}>
          <Text style={styles.coachStar}>✦</Text>
        </Animated.View>
      </Pressable>

      {/* Play / Pause / Check */}
      <Pressable
        style={({ pressed }) => [styles.roundBtn, getPlayStyle(), pressed && getPlayPressedStyle()]}
        onPress={onPlayPause}
      >
        <Feather name={getPlayIcon()} size={SIZE.iconSm} color={getPlayIconColor()} />
      </Pressable>

      {/* Timer display — tap to open duration picker */}
      <Pressable
        style={({ pressed }) => [styles.timerBtn, pressed && styles.timerBtnPressed]}
        onPress={onTimerPress}
      >
        <Text variant="title" style={[styles.timerText, getTimerTextStyle()]}>
          {formatTime(timeRemaining)}
        </Text>
      </Pressable>

      {/* Reset */}
      <Pressable
        style={({ pressed }) => [styles.roundBtn, styles.resetBtn, pressed && styles.resetBtnPressed]}
        onPress={onReset}
      >
        <Feather name="rotate-ccw" size={SIZE.iconSm} color={COLORS.textSecondary} />
      </Pressable>

      {/* Edit mode toggle — pencil (normal) / checkmark (active) */}
      <Pressable
        style={({ pressed }) => [
          styles.outlinedCircle,
          editMode ? styles.editBtnActive : null,
          pressed && (editMode ? styles.editBtnActivePressed : styles.pressedOpacity),
        ]}
        onPress={onEditToggle}
      >
        <Feather
          name={editMode ? 'check' : 'edit-2'}
          size={SIZE.iconMd}
          color={editMode ? COLORS.white : COLORS.black}
        />
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  /** Bar container with upward shadow */
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOW.bottomBar,
  },

  /** Outlined circle — used by Coach and Edit (normal mode) */
  outlinedCircle: {
    width: SIZE.iconBtn,
    height: SIZE.iconBtn,
    borderRadius: SIZE.iconBtn / 2,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Shared pressed feedback for outlined buttons */
  pressedOpacity: {
    opacity: 0.7,
  },

  /** Black star character inside the Coach circle */
  coachStar: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.bold,
  },

  /** Circular button for play/reset */
  roundBtn: {
    width: SIZE.roundBtn,
    height: SIZE.roundBtn,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE.roundBtn / 2,
  },

  /** Timer play button states */
  playIdle: { backgroundColor: COLORS.timerDoneBg },
  playIdlePressed: { backgroundColor: COLORS.timerIdlePressedBg },
  playActive: { backgroundColor: COLORS.timerActiveBg },
  playActivePressed: { backgroundColor: COLORS.timerActivePressedBg },
  playDone: { backgroundColor: COLORS.timerDoneBg },
  playDonePressed: { backgroundColor: COLORS.timerDonePressedBg },

  /** Reset button */
  resetBtn: { backgroundColor: COLORS.timerResetBg },
  resetBtnPressed: { backgroundColor: COLORS.timerResetPressedBg },

  /** Edit button — active mode (blue, fills the outlined circle) */
  editBtnActive: {
    backgroundColor: COLORS.viewCurrent,
    borderColor: COLORS.viewCurrent,
  },
  editBtnActivePressed: {
    backgroundColor: COLORS.editBtnActivePressed,
    borderColor: COLORS.editBtnActivePressed,
  },

  /** Timer display touch target */
  timerBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  timerBtnPressed: {
    backgroundColor: COLORS.timerResetBg,
  },

  /** Timer text — semibold with fixed minimum width */
  timerText: {
    fontFamily: FONT_FAMILY.semibold,
    textAlign: 'center',
    minWidth: SIZE.timerMinWidth,
  },
  timerIdle: { color: COLORS.timerIdle },
  timerActive: { color: COLORS.timerActive },
  timerDone: { color: COLORS.timerDone },
});
