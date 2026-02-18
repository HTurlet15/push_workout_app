import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_FAMILY, SIZE, SHADOW } from '../theme/theme';

/**
 * Persistent bottom navigation bar for the workout session.
 *
 * Contains five interactive elements (left to right):
 * 1. LLM chat — opens AI assistant (future feature)
 * 2. Play/Pause/Check — controls the rest timer lifecycle
 * 3. Timer display — tappable to open duration picker
 * 4. Reset — resets timer to configured duration
 * 5. Edit toggle — switches between workout mode and edit mode
 *
 * Timer button appearance adapts to timer state:
 * - idle: green play icon on green background
 * - running: orange pause icon on orange background
 * - done: green check icon on green background
 *
 * Edit button toggles between:
 * - Normal: black background with pencil icon
 * - Active: blue background with checkmark icon
 *
 * @param {'idle'|'running'|'done'} timerState - Current timer lifecycle state.
 * @param {number} timeRemaining              - Seconds left on the timer.
 * @param {boolean} editMode                  - Whether edit mode is currently active.
 * @param {Function} onPlayPause              - Toggle timer play/pause.
 * @param {Function} onReset                  - Reset timer to configured duration.
 * @param {Function} onTimerPress             - Open timer duration picker.
 * @param {Function} onEditToggle             - Toggle edit mode on/off.
 * @param {Function} onLLMPress               - Open AI assistant panel.
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
      {/* LLM assistant button */}
      <Pressable
        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
        onPress={onLLMPress}
      >
        <Feather name="message-square" size={SIZE.iconLg} color={COLORS.textSecondary} />
      </Pressable>

      {/* Play / Pause / Check button */}
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

      {/* Reset button */}
      <Pressable
        style={({ pressed }) => [styles.roundBtn, styles.resetBtn, pressed && styles.resetBtnPressed]}
        onPress={onReset}
      >
        <Feather name="rotate-ccw" size={SIZE.iconSm} color={COLORS.textSecondary} />
      </Pressable>

      {/* Edit mode toggle — pencil (normal) / checkmark (active) */}
      <Pressable
        style={({ pressed }) => [
          styles.iconBtn,
          editMode ? styles.editBtnActive : styles.editBtn,
          pressed && (editMode ? styles.editBtnActivePressed : styles.editBtnPressed),
        ]}
        onPress={onEditToggle}
      >
        <Feather
          name={editMode ? 'check' : 'edit-2'}
          size={SIZE.iconMd}
          color={COLORS.white}
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

  /** Square touch target for icon buttons (LLM, edit) */
  iconBtn: {
    width: SIZE.iconBtn,
    height: SIZE.iconBtn,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm,
  },
  iconBtnPressed: {
    backgroundColor: COLORS.timerResetBg,
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

  /** Edit button — normal mode (black) */
  editBtn: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.sm,
  },
  editBtnPressed: {
    backgroundColor: COLORS.btnDarkPressed,
  },
  /** Edit button — active mode (blue) */
  editBtnActive: {
    backgroundColor: COLORS.viewCurrent,
    borderRadius: RADIUS.sm,
  },
  editBtnActivePressed: {
    backgroundColor: COLORS.editBtnActivePressed,
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
  /** Timer text color states */
  timerIdle: { color: COLORS.timerIdle },
  timerActive: { color: COLORS.timerActive },
  timerDone: { color: COLORS.timerDone },
});