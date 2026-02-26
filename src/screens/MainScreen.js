import { View, FlatList, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useCallback } from 'react';
import ProgramsList from '../components/program/ProgramsList';
import WorkoutsList from '../components/workout/WorkoutsList';
import WorkoutPager from '../components/workout/WorkoutPager';
import BottomBar from '../components/common/BottomBar';
import TimerPicker from '../components/common/TimerPicker';
import TabIndicator from '../components/common/TabIndicator';
import useRestTimer from '../hooks/useRestTimer';
import MOCK_PROGRAMS from '../data/mockPrograms';
import { COLORS } from '../theme/theme';

/**
 * MainScreen — top-level orchestrator.
 *
 * Manages:
 * - Horizontal tab pager: Programs (page 0) ↔ Workouts (page 1)
 * - Sessions state (shared between list and pager)
 * - Programs state (list, selection)
 * - Zoom-through transition between list and workout views
 * - Global rest timer
 * - Edit mode (shared between all views)
 * - TimerPicker modal
 *
 * Delegates rendering to:
 * - ProgramsList (tab page 0)
 * - WorkoutsList (tab page 1)
 * - WorkoutPager (layer 1 overlay via zoom-through)
 */
export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // ── Horizontal tab pager (Programs ↔ Workouts) ────────────

  const [activeTab, setActiveTab] = useState(1); // 0 = Programs, 1 = Workouts
  const tabPagerRef = useRef(null);
  const TAB_LABELS = ['Programs', 'Workouts'];

  const onTabViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveTab(viewableItems[0].index);
    }
  }).current;

  const tabViewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // ── Workout overlay state ─────────────────────────────────

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

  // ── Programs state ────────────────────────────────────────

  const [programs, setPrograms] = useState(MOCK_PROGRAMS);
  const [selectedProgramId, setSelectedProgramId] = useState(MOCK_PROGRAMS[0]?.id);

  /** Get sessions array from a program by ID */
  const getSessionsForProgram = useCallback((programId) => {
    const program = programs.find((p) => p.id === programId);
    if (!program?.sessions) return [];
    return program.sessions.map((s) => ({
      current: s.current,
      previous: s.previous,
      next: s.next,
    }));
  }, [programs]);

  const handleSelectProgram = useCallback((programId) => {
    setSelectedProgramId(programId);
    setSessions(getSessionsForProgram(programId));
    // Navigate to Workouts tab after selection
    setTimeout(() => {
      tabPagerRef.current?.scrollToIndex({ index: 1, animated: true });
    }, 200);
  }, [getSessionsForProgram]);

  const handleAddProgram = useCallback(() => {
    const ts = Date.now();
    setPrograms((prev) => [...prev, {
      id: `prog-${ts}`,
      name: 'New Program',
      note: null,
      frequency: null,
      sessions: [],
    }]);
  }, []);

  const handleDeleteProgram = useCallback((index) => {
    setPrograms((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index]?.id === selectedProgramId && next.length > 0) {
        setSelectedProgramId(next[0].id);
        setSessions(getSessionsForProgram(next[0].id));
      }
      return next;
    });
  }, [selectedProgramId, getSessionsForProgram]);

  // ── Sessions state (loaded from selected program) ─────────

  const [sessions, setSessions] = useState(() =>
    getSessionsForProgram(MOCK_PROGRAMS[0]?.id)
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

  // ── Tab pages ─────────────────────────────────────────────

  const tabPages = [{ key: 'programs' }, { key: 'workouts' }];

  const renderTabPage = ({ item }) => (
    <View style={{ width, flex: 1 }}>
      {item.key === 'programs' ? (
        <ProgramsList
          programs={programs}
          selectedProgramId={selectedProgramId}
          editMode={editMode}
          onSelectProgram={handleSelectProgram}
          onAddProgram={handleAddProgram}
          onDeleteProgram={handleDeleteProgram}
        />
      ) : (
        <WorkoutsList
          sessions={sessions}
          editMode={editMode}
          onSelectWorkout={navigateToWorkout}
          onAddWorkout={handleAddWorkout}
          onDeleteWorkout={handleDeleteWorkout}
        />
      )}
    </View>
  );

  // ── Render ────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      {/* ── Layer 0: Tab pager (Programs ↔ Workouts) ── */}
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
          label={TAB_LABELS[activeTab]}
          tabPosition={activeTab}
        />

        <FlatList
          ref={tabPagerRef}
          data={tabPages}
          renderItem={renderTabPage}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEnabled={!editMode}
          onViewableItemsChanged={onTabViewableItemsChanged}
          viewabilityConfig={tabViewabilityConfig}
          initialScrollIndex={1}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          style={styles.tabPager}
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
            tabPosition={2}
            totalDots={sessions.length}
            activeIndex={activeWorkoutIndex}
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
  tabPager: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.screenBackground,
  },
});