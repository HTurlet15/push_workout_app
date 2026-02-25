import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useCallback } from 'react';
import WorkoutsList from '../components/workout/WorkoutsList';
import WorkoutPager from '../components/workout/WorkoutPager';
import BottomBar from '../components/common/BottomBar';
import TimerPicker from '../components/common/TimerPicker';
import TabIndicator from '../components/common/TabIndicator';
import useRestTimer from '../hooks/useRestTimer';
import MOCK_SESSIONS from '../data/mockSessions';
import { COLORS } from '../theme/theme';

/**
 * MainScreen — top-level orchestrator.
 *
 * Manages:
 * - Sessions state (shared between list and pager)
 * - Zoom-through transition between list and workout views
 * - Global rest timer
 * - Edit mode (shared between list and workout views)
 * - TimerPicker modal
 *
 * Delegates rendering to:
 * - WorkoutsList (layer 0)
 * - WorkoutPager (layer 1 overlay)
 */
export default function MainScreen() {
  const insets = useSafeAreaInsets();

  const [activeWorkoutIndex, setActiveWorkoutIndex] = useState(0);
  const [workoutVisible, setWorkoutVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  // 0 = list, 1 = workout
  const transitionAnim = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef(null);

  // ── Global timer ──────────────────────────────────────────

  const {
    timerState, timeRemaining, duration,
    playPause, reset, updateDuration, startWithDuration,
  } = useRestTimer(90);

  // ── Sessions state ────────────────────────────────────────

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

  // ── Add / Delete workouts ─────────────────────────────────

  const handleAddWorkout = () => {
    const ts = Date.now();
    const id = `w-${ts}`;
    const newSession = {
      current: {
        id,
        name: 'New Workout',
        completedAt: null,
        exercises: [],
      },
      previous: null,
      next: {
        id: `${id}-next`,
        name: 'New Workout',
        exercises: [],
      },
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const handleDeleteWorkout = (index) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Zoom-through transitions ──────────────────────────────

  const navigateToWorkout = (sessionIndex) => {
    setActiveWorkoutIndex(sessionIndex);
    setWorkoutVisible(true);
    setEditMode(false);

    setTimeout(() => {
      pagerRef.current?.scrollToIndex(sessionIndex);
    }, 30);

    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const navigateToList = () => {
    Animated.timing(transitionAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setWorkoutVisible(false);
      setEditMode(false);
    });
  };

  // List: scales down + fades
  const listScale = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.92],
  });
  const listOpacity = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  // Workout: fades in
  const workoutOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  // ── Render ────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      {/* ── Layer 0: List ── */}
      <Animated.View
        style={[
          styles.layer,
          {
            opacity: listOpacity,
            transform: [{ scale: listScale }],
          },
        ]}
        pointerEvents={workoutVisible ? 'none' : 'auto'}
      >
        <TabIndicator
          label="Workouts"
          showLeftDot={true}
          showRightDot={true}
        />

        <WorkoutsList
          sessions={sessions}
          editMode={editMode}
          onSelectWorkout={navigateToWorkout}
          onAddWorkout={handleAddWorkout}
          onDeleteWorkout={handleDeleteWorkout}
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
      </Animated.View>

      {/* ── Layer 1: Workout overlay ── */}
      {workoutVisible && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: workoutOpacity,
              paddingTop: insets.top,
            },
          ]}
        >
          <TabIndicator
            label="Workout"
            totalDots={sessions.length}
            activeIndex={activeWorkoutIndex}
            showLeftDot={true}
            showRightDot={true}
            backLabel="Workouts"
            onBack={navigateToList}
          />

          <WorkoutPager
            ref={pagerRef}
            sessions={sessions}
            makeSetWorkout={makeSetWorkout}
            makeSetNextWorkout={makeSetNextWorkout}
            editMode={editMode}
            startWithDuration={startWithDuration}
            updateDuration={updateDuration}
            onPageChange={setActiveWorkoutIndex}
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
        </Animated.View>
      )}

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
  layer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.screenBackground,
  },
});
