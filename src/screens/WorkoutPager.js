import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useCallback } from 'react';
import WorkoutScreen from './WorkoutScreen';
import BottomBar from '../components/common/BottomBar';
import TimerPicker from '../components/common/TimerPicker';
import Text from '../components/common/Text';
import useRestTimer from '../hooks/useRestTimer';
import MOCK_SESSIONS from '../data/mockSessions';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

/**
 * Horizontal pager that holds multiple WorkoutScreens.
 *
 * Responsibilities:
 * - Horizontal swipe navigation between séances
 * - Global rest timer shared across all workouts
 * - Global edit mode toggle
 * - Tab indicator with dots + "Workout" label
 * - TimerPicker modal
 *
 * Each WorkoutScreen manages its own workout state and mutations,
 * but receives timer controls from here.
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

  // ── Session state — each séance has its own current/previous/next ──

  const [sessions, setSessions] = useState(
    MOCK_SESSIONS.map((s) => ({
      current: s.current,
      previous: s.previous,
      next: s.next,
    }))
  );

  /** Create a setter for a specific session's current workout */
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

  /** Create a setter for a specific session's next workout */
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
      {/* Tab indicator: dots + Workout label */}
      <View style={styles.tabBar}>
        {/* Left dot — placeholder for WORKOUTS list page */}
        <View style={styles.dot} />

        {/* Center: Workout label + séance dots */}
        <View style={styles.tabCenter}>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>Workout</Text>
          </View>
          <View style={styles.sessionDots}>
            {sessions.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.sessionDot,
                  i === activeIndex && styles.sessionDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Right dot — placeholder for next section */}
        <View style={styles.dot} />
      </View>

      {/* Horizontal pager */}
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

      {/* Global bottom bar */}
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

  // ── Tab bar ───────────────────────────────────────────────

  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tabCenter: {
    alignItems: 'center',
    gap: 6,
  },
  labelPill: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 4,
    paddingHorizontal: SPACING.md + 4,
    borderRadius: 20,
  },
  labelText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semibold,
    letterSpacing: 0.5,
  },
  sessionDots: {
    flexDirection: 'row',
    gap: 5,
  },
  sessionDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.mediumGray,
  },
  sessionDotActive: {
    backgroundColor: COLORS.textSecondary,
  },

  // ── Placeholder dots for adjacent pages ───────────────────

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.mediumGray,
  },
});