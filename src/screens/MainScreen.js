import {
  View, FlatList, ScrollView, Pressable, Animated,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import WorkoutScreen from './WorkoutScreen';
import BottomBar from '../components/common/BottomBar';
import TimerPicker from '../components/common/TimerPicker';
import TabIndicator from '../components/common/TabIndicator';
import Text from '../components/common/Text';
import useRestTimer from '../hooks/useRestTimer';
import MOCK_SESSIONS from '../data/mockSessions';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SHADOW } from '../theme/theme';

/**
 * MainScreen — zoom-through transition between two layers:
 *
 *  Layer 0: Workouts list
 *  Layer 1: Workout pager (horizontal swipe)
 *
 * Transition forward:
 *  - List scales to 0.95 + fades to 0.4
 *  - Workout fades in from 0 to 1
 *
 * Transition back:
 *  - Workout fades out
 *  - List scales back to 1 + fades to 1
 */
export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [activeWorkoutIndex, setActiveWorkoutIndex] = useState(0);
  const [workoutVisible, setWorkoutVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  // 0 = list visible, 1 = workout visible
  const transitionAnim = useRef(new Animated.Value(0)).current;

  const horizontalListRef = useRef(null);

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

  // ── Zoom-through transitions ──────────────────────────────

  const navigateToWorkout = (sessionIndex) => {
    setActiveWorkoutIndex(sessionIndex);
    setWorkoutVisible(true);

    setTimeout(() => {
      horizontalListRef.current?.scrollToIndex({
        index: sessionIndex,
        animated: false,
      });
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

  // ── Horizontal page tracking ──────────────────────────────

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveWorkoutIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // ── Render workout pages ──────────────────────────────────

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
          onSelectWorkout={navigateToWorkout}
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
          {/* Header: tab + back button */}
          <View style={styles.overlayHeader}>
            <View style={styles.headerSpacer} />
            <View style={styles.headerCenter}>
              <TabIndicator
                label="Workout"
                totalDots={sessions.length}
                activeIndex={activeWorkoutIndex}
                showLeftDot={true}
                showRightDot={true}
              />
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.backBtnPressed,
              ]}
              onPress={navigateToList}
            >
              <View style={styles.backBtnInner}>
                <Feather name="chevron-up" size={14} color={COLORS.textSecondary} />
                <Text style={styles.backBtnText}>Workouts</Text>
              </View>
            </Pressable>
          </View>

          {/* Horizontal workout pager */}
          <FlatList
            ref={horizontalListRef}
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

// ═══════════════════════════════════════════════════════════════
// WorkoutsList
// ═══════════════════════════════════════════════════════════════

function WorkoutsList({ sessions, onSelectWorkout }) {
  const [expandedId, setExpandedId] = useState(null);

  const getTimeBadge = (completedAt) => {
    if (!completedAt) return { label: 'Never', tier: 'moderate' };
    const diff = Date.now() - new Date(completedAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    let label;
    if (days === 0 && hours < 24) label = 'Today';
    else if (days === 1) label = 'Yesterday';
    else label = `${days}d ago`;

    let tier;
    if (days <= 2) tier = 'recent';
    else if (days <= 6) tier = 'moderate';
    else tier = 'overdue';

    return { label, tier };
  };

  return (
    <ScrollView
      style={styles.listScroll}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.listHeader}>
        <Text variant="screenTitle">WORKOUTS</Text>
      </View>

      {sessions.map((session, index) => (
        <ExpandableCard
          key={session.current.id}
          index={index}
          name={session.current.name}
          exercises={session.current.exercises}
          timeBadge={getTimeBadge(session.previous?.completedAt)}
          isExpanded={expandedId === index}
          onToggleExpand={() =>
            setExpandedId((prev) => (prev === index ? null : index))
          }
          onPress={() => onSelectWorkout(index)}
        />
      ))}
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════════
// ExpandableCard
// ═══════════════════════════════════════════════════════════════

function ExpandableCard({
  index,
  name,
  exercises,
  timeBadge,
  isExpanded,
  onToggleExpand,
  onPress,
}) {
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const chevronAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const numberColorAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(chevronAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(numberColorAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded]);

  const getRepRange = (exercise) => {
    const reps = exercise.sets
      .map((s) => s.reps?.value ?? s.reps)
      .filter((r) => r != null);
    if (reps.length === 0) return '';
    const min = Math.min(...reps);
    const max = Math.max(...reps);
    if (min === max) return `${min} reps`;
    return `${min}-${max} reps`;
  };

  const maxExerciseHeight = exercises.length * 40 + 16;

  const animatedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxExerciseHeight],
  });

  const chevronRotation = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const numberBg = numberColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.lightGray, COLORS.textPrimary],
  });

  const numberColor = numberColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.white],
  });

  const timeColor =
    timeBadge.tier === 'recent' ? COLORS.success :
    timeBadge.tier === 'overdue' ? COLORS.error :
    COLORS.textSecondary;

  return (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        {/* Tap to navigate */}
        <Pressable
          style={({ pressed }) => [
            styles.cardNavArea,
            pressed && styles.cardNavAreaPressed,
          ]}
          onPress={onPress}
        >
          <Animated.View style={[styles.cardNumber, { backgroundColor: numberBg }]}>
            <Animated.Text style={[styles.cardNumberText, { color: numberColor }]}>
              {index + 1}
            </Animated.Text>
          </Animated.View>

          <View style={styles.cardBody}>
            <Text style={styles.cardName}>{name}</Text>
            <View style={styles.cardMeta}>
              <Text style={[styles.cardMetaText, { color: timeColor }]}>
                {timeBadge.label}
              </Text>
              <Text style={styles.cardMetaText}>
                {' · '}{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Tap to expand/collapse */}
        <Pressable
          style={({ pressed }) => [
            styles.chevronHitArea,
            pressed && styles.chevronPressed,
          ]}
          onPress={onToggleExpand}
        >
          <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
            <Feather name="chevron-down" size={18} color={COLORS.textMuted} />
          </Animated.View>
        </Pressable>
      </View>

      <Animated.View style={[styles.exercisesContainer, { height: animatedHeight }]}>
        <View style={styles.exercisesInner}>
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <View style={styles.exerciseDot} />
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetail}>
                {exercise.sets.length} sets · {getRepRange(exercise)}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },

  // ── Layers ────────────────────────────────────────────────

  layer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.screenBackground,
    paddingTop: 0, // will be set inline
  },

  // ── Overlay header ────────────────────────────────────────

  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerSpacer: {
    width: SPACING.sm,
  },
  backBtn: {
    paddingHorizontal: SPACING.sm + 2,
    height: 44,
    justifyContent: 'center',
  },
  backBtnPressed: {
    opacity: 0.5,
  },
  backBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },

  // ── List ──────────────────────────────────────────────────

  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  listHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },

  // ── Card ──────────────────────────────────────────────────

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNavArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm + 2,
  },
  cardNavAreaPressed: {
    backgroundColor: COLORS.lightGray,
  },
  chevronHitArea: {
    width: 48,
    height: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronPressed: {
    backgroundColor: COLORS.lightGray,
  },

  // ── Number badge ──────────────────────────────────────────

  cardNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumberText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
  },

  // ── Body ──────────────────────────────────────────────────

  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  cardMeta: {
    flexDirection: 'row',
  },
  cardMetaText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },

  // ── Exercise list ─────────────────────────────────────────

  exercisesContainer: {
    overflow: 'hidden',
  },
  exercisesInner: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm + 2,
    paddingLeft: SPACING.md + 36 + SPACING.sm + 2,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  exerciseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  exerciseName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  exerciseDetail: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textMuted,
  },
});