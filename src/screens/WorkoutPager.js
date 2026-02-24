import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useCallback } from 'react';
import WorkoutScreen from './WorkoutScreen';
import BottomBar from '../components/common/BottomBar';
import TimerPicker from '../components/common/TimerPicker';
import TabIndicator from '../components/common/TabIndicator';
import useRestTimer from '../hooks/useRestTimer';
import MOCK_SESSIONS from '../data/mockSessions';
import { COLORS } from '../theme/theme';

/**
 * Horizontal pager that holds multiple WorkoutScreens.
 *
 * Responsibilities:
 * - Horizontal swipe navigation between séances
 * - Global rest timer shared across all workouts
 * - Global edit mode toggle
 * - Tab indicator via TabIndicator component
 * - TimerPicker modal
 */
export default function WorkoutPager() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  const flatListRef = useRef(null);

  // ── Global timer ──────────────────────────────────────────

  const {
    timerState, timeRemaining, duration,
    playPause, reset, updateDuration, startWithDuration,
  } = useRestTimer(90);

  // ── Session state ─────────────────────────────────────────

  const [sessions, setSessions] = useState(
    MOCK_SESSIONS.map((s) => ({
      current: s.current,
      previous: s.previous,
      next: s.next,
    }))
  );

  const makeSetWorkout = useCallback((index) => {
    return (updater) => {
      setSessions((prev) => {
        const next = [...prev];
        const current = next[index].current;
        next[index] = {
          ...next[index],
          current: typeof updater === 'function' ? updater(current) : updater,
        };
        return next;
      });
    };
  }, []);

  const makeSetNextWorkout = useCallback((index) => {
    return (updater) => {
      setSessions((prev) => {
        const next = [...prev];
        const nextWk = next[index].next;
        next[index] = {
          ...next[index],
          next: typeof updater === 'function' ? updater(nextWk) : updater,
        };
        return next;
      });
    };
  }, []);

  // ── Page tracking ─────────────────────────────────────────

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // ── Render ────────────────────────────────────────────────

  const renderWorkout = ({ item, index }) => (
    <View style={{ width }}>
      <WorkoutScreen
        workout={item.current}
        setWorkout={makeSetWorkout(index)}
        previousWorkout={item.previous}
        nextWorkout={item.next}
        setNextWorkout={makeSetNextWorkout(index)}
        editMode={editMode}
        startWithDuration={startWithDuration}
        updateDuration={updateDuration}
      />
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <TabIndicator
        label="Workout"
        totalDots={sessions.length}
        activeIndex={activeIndex}
        showLeftDot={true}
        showRightDot={true}
      />

      <FlatList
        ref={flatListRef}
        data={sessions}
        renderItem={renderWorkout}
        keyExtractor={(_, index) => `workout-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <BottomBar
        timerState={timerState}
        timeRemaining={timeRemaining}
        editMode={editMode}
        onPlayPause={playPause}
        onReset={reset}
        onTimerPress={() => setShowTimerPicker(true)}
        onEditToggle={() => setEditMode((prev) => !prev)}
        onLLMPress={() => {}}
        bottomInset={insets.bottom}
      />

      <TimerPicker
        visible={showTimerPicker}
        currentDuration={duration}
        onConfirm={(seconds) => {
          updateDuration(seconds);
          setShowTimerPicker(false);
        }}
        onClose={() => setShowTimerPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
});