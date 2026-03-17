import { View, ScrollView, Pressable, Animated, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from '../common/Text';
import WorkoutCard from './WorkoutCard';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

/**
 * Scrollable list of workout cards with:
 * - Expand/collapse exercise preview per card
 * - Edit mode: delete workouts (depop animation), add new workout
 * - Pop-in animation for newly added workouts
 */
export default function WorkoutsList({
  sessions,
  selectedProgramId,
  editMode,
  onSelectWorkout,
  onAddWorkout,
  onDeleteWorkout,
  onUpdateWorkoutName,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [newIndices, setNewIndices] = useState(new Set());
  const deleteAnims = useRef({});

  useEffect(() => {
    if (editMode) setExpandedId(null);
  }, [editMode]);

  const getTimeBadge = (completedAt) => {
    if (!completedAt) return { label: 'Never', tier: 'moderate' };
    const now = new Date();
    const completed = new Date(completedAt);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const completedStart = new Date(completed.getFullYear(), completed.getMonth(), completed.getDate());
    const days = Math.round((todayStart - completedStart) / (1000 * 60 * 60 * 24));

    let label;
    if (days === 0) label = 'Today';
    else if (days === 1) label = 'Yesterday';
    else label = `${days}d ago`;

    let tier;
    if (days <= 2) tier = 'recent';
    else if (days <= 6) tier = 'moderate';
    else tier = 'overdue';

    return { label, tier };
  };

  const handleDelete = (index) => {
    const key = `delete-${index}`;
    deleteAnims.current[key] = new Animated.Value(1);
    setNewIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });

    Animated.timing(deleteAnims.current[key], {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      delete deleteAnims.current[key];
      onDeleteWorkout(index);
    });
  };

  const handleAdd = () => {
    const newIndex = sessions.length;
    onAddWorkout();
    setNewIndices((prev) => new Set(prev).add(newIndex));
    setTimeout(() => {
      setNewIndices((prev) => {
        const next = new Set(prev);
        next.delete(newIndex);
        return next;
      });
    }, 500);
  };

  const renderCard = (session, index) => {
    const deleteKey = `delete-${index}`;
    const deleteAnim = deleteAnims.current[deleteKey];
    const isNew = newIndices.has(index);

    const card = (
      <WorkoutCard
        index={index}
        name={session.current.name}
        exercises={session.current.exercises}
        timeBadge={getTimeBadge(session.current?.lastSetAt)}
        isExpanded={expandedId === index}
        editMode={editMode}
        onToggleExpand={() =>
          setExpandedId((prev) => (prev === index ? null : index))
        }
        onPress={() => onSelectWorkout(index)}
        onDelete={() => handleDelete(index)}
        onUpdateName={(text) => onUpdateWorkoutName?.(index, text)}
        isFirst={index === 0}
      />
    );

    if (deleteAnim) {
      const scale = deleteAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      });
      return (
        <Animated.View
          key={session.current.id}
          style={{ opacity: deleteAnim, transform: [{ scale }] }}
        >
          {card}
        </Animated.View>
      );
    }

    if (isNew) {
      return (
        <PopInWrapper key={session.current.id}>
          {card}
        </PopInWrapper>
      );
    }

    return <View key={session.current.id}>{card}</View>;
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="screenTitle">WORKOUTS</Text>
      </View>

      {/* Empty state: no program selected */}
      {!selectedProgramId && sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Feather name="layers" size={32} color={COLORS.mediumGray} />
          <Text style={styles.emptyTitle}>No program selected</Text>
          <Text style={styles.emptySubtitle}>Create and select a program to start adding workouts.</Text>
        </View>
      )}

      {sessions.map((session, index) => renderCard(session, index))}

      {/* Empty state: program selected but no workouts */}
      {selectedProgramId && sessions.length === 0 && !editMode && (
        <Pressable
          style={({ pressed }) => [
            styles.emptyAddBtn,
            pressed && styles.addBtnPressed,
          ]}
          onPress={handleAdd}
        >
          <Feather name="plus" size={SIZE.iconChevron} color={COLORS.viewCurrent} />
          <Text style={[styles.addBtnText, { color: COLORS.viewCurrent }]}>Add Workout</Text>
        </Pressable>
      )}

      {editMode && (
        <Pressable
          style={({ pressed }) => [
            styles.addBtn,
            pressed && styles.addBtnPressed,
          ]}
          onPress={handleAdd}
        >
          <Feather name="plus" size={SIZE.iconChevron} color={COLORS.textSecondary} />
          <Text style={styles.addBtnText}>Add Workout</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function PopInWrapper({ children }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderWidth: SIZE.borderAccent,
    borderColor: COLORS.mediumGray,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xl,
    borderWidth: SIZE.borderAccent,
    borderColor: COLORS.viewCurrent,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  addBtnPressed: {
    backgroundColor: COLORS.lightGray,
  },
  addBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
});