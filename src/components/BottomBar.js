import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../theme/theme';

export default function BottomBar({
  timerState = 'idle',
  timeRemaining = 90,
  onPlayPause,
  onReset,
  onTimerPress,
  onAddSet,
  onLLMPress,
  bottomInset = 0,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlayIcon = () => {
    if (timerState === 'done') return 'check';
    if (timerState === 'running') return 'pause';
    return 'play';
  };

  const getPlayStyle = () => {
    if (timerState === 'done') return styles.playDone;
    if (timerState === 'running') return styles.playActive;
    return styles.playIdle;
  };

  const getPlayPressedStyle = () => {
    if (timerState === 'done') return styles.playDonePressed;
    if (timerState === 'running') return styles.playActivePressed;
    return styles.playIdlePressed;
  };

  const getPlayIconColor = () => {
    if (timerState === 'done') return COLORS.timerDone;
    if (timerState === 'running') return COLORS.timerActive;
    return COLORS.timerDone;
  };

  const getTimerTextStyle = () => {
    if (timerState === 'done') return styles.timerDone;
    if (timerState === 'running') return styles.timerActive;
    return styles.timerIdle;
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomInset + SPACING.md }]}>
      {/* LLM */}
      <Pressable
        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
        onPress={onLLMPress}
      >
        <Feather name="message-square" size={22} color={COLORS.textSecondary} />
      </Pressable>

      {/* Play / Pause / Check */}
      <Pressable
        style={({ pressed }) => [styles.roundBtn, getPlayStyle(), pressed && getPlayPressedStyle()]}
        onPress={onPlayPause}
      >
        <Feather name={getPlayIcon()} size={16} color={getPlayIconColor()} />
      </Pressable>

      {/* Timer display */}
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
        <Feather name="rotate-ccw" size={16} color={COLORS.textSecondary} />
      </Pressable>

      {/* Add set */}
      <Pressable
        style={({ pressed }) => [styles.iconBtn, styles.addBtn, pressed && styles.addBtnPressed]}
        onPress={onAddSet}
      >
        <Feather name="plus" size={22} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm,
  },
  iconBtnPressed: {
    backgroundColor: COLORS.timerResetBg,
  },
  roundBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  playIdle: {
    backgroundColor: COLORS.timerDoneBg,
  },
  playIdlePressed: {
    backgroundColor: COLORS.timerIdlePressedBg,
    },
  playActive: {
    backgroundColor: COLORS.timerActiveBg,
  },
  playActivePressed: {
    backgroundColor: COLORS.timerActivePressedBg,
  },
  playDone: {
    backgroundColor: COLORS.timerDoneBg,
  },
  playDonePressed: {
    backgroundColor: COLORS.timerDonePressedBg,
  },
  resetBtn: {
    backgroundColor: COLORS.timerResetBg,
  },
  resetBtnPressed: {
    backgroundColor: COLORS.timerResetPressedBg,
  },
  addBtn: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: RADIUS.sm,
  },
  addBtnPressed: {
    backgroundColor: COLORS.addBtnPressed,
  },
  timerBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  timerBtnPressed: {
    backgroundColor: COLORS.timerResetBg,
  },
  timerText: {
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 56,
  },
  timerIdle: {
    color: COLORS.timerIdle,
  },
  timerActive: {
    color: COLORS.timerActive,
  },
  timerDone: {
    color: COLORS.timerDone,
  },
});