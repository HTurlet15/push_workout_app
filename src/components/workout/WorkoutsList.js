import { View, ScrollView, Pressable, Animated, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from '../common/Text';
import WorkoutCard from './WorkoutCard';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SHADOW } from '../../theme/theme';

/**
 * Scrollable list of workout cards with:
 * - Expand/collapse exercise preview per card
 * - Edit mode: delete workouts (depop animation), add new workout
 * - Pop-in animation for newly added workouts
 *
 * @param {Array} sessions           - Array of session objects.
 * @param {boolean} editMode         - Whether edit controls are visible.
 * @param {Function} onSelectWorkout - Navigate to a workout by index.
 * @param {Function} onAddWorkout    - Add a new workout.
 * @param {Function} onDeleteWorkout - Delete a workout by index.
 */
export default function WorkoutsList({
  sessions,
  editMode,
  onSelectWorkout,
  onAddWorkout,
  onDeleteWorkout,
}) {
  const [expandedId, setExpandedId] = useState(null);

  /** Set of session indices that were just added — triggers pop-in */
  const [newIndices, setNewIndices] = useState(new Set());

  /** Animated values for sessions being deleted */
  const deleteAnims = useRef({});

  // Collapse expanded cards when entering edit mode
  useEffect(() => {
    if (editMode) setExpandedId(null);
  }, [editMode]);

  // ── Time badge ────────────────────────────────────────────

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

  // ── Delete animation ──────────────────────────────────────

  const handleDelete = (index) => {
    const key = `delete-${index}`;
    deleteAnims.current[key] = new Animated.Value(1);

    // Force re-render to show animation wrapper
    setNewIndices((prev) => new Set(prev));

    Animated.timing(deleteAnims.current[key], {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      delete deleteAnims.current[key];
      onDeleteWorkout(index);
    });
  };

  // ── Add animation ─────────────────────────────────────────

  const handleAdd = () => {
    const newIndex = sessions.length;
    onAddWorkout();

    // Track for pop-in
    setNewIndices((prev) => new Set(prev).add(newIndex));
    setTimeout(() => {
      setNewIndices((prev) => {
        const next = new Set(prev);
        next.delete(newIndex);
        return next;
      });
    }, 500);
  };

  // ── Render card with optional animation wrapper ───────────

  const renderCard = (session, index) => {
    const deleteKey = `delete-${index}`;
    const deleteAnim = deleteAnims.current[deleteKey];
    const isNew = newIndices.has(index);

    const card = (
      <WorkoutCard
        index={index}
        name={session.current.name}
        exercises={session.current.exercises}
        timeBadge={getTimeBadge(session.previous?.completedAt)}
        isExpanded={expandedId === index}
        editMode={editMode}
        onToggleExpand={() =>
          setExpandedId((prev) => (prev === index ? null : index))
        }
        onPress={() => onSelectWorkout(index)}
        onDelete={() => handleDelete(index)}
      />
    );

    // Depop wrapper
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

    // Pop-in wrapper
    if (isNew) {
      return (
        <PopInWrapper key={session.current.id}>
          {card}
        </PopInWrapper>
      );
    }

    return <View key={session.current.id}>{card}</View>;
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="screenTitle">WORKOUTS</Text>
      </View>

      {sessions.map((session, index) => renderCard(session, index))}

      {/* Add workout button — edit mode only */}
      {editMode && (
        <Pressable
          style={({ pressed }) => [
            styles.addBtn,
            pressed && styles.addBtnPressed,
          ]}
          onPress={handleAdd}
        >
          <Feather name="plus" size={18} color={COLORS.textSecondary} />
          <Text style={styles.addBtnText}>Add Workout</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

/**
 * Pop-in animation wrapper for newly added cards.
 */
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

  // ── Add button ────────────────────────────────────────────

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.mediumGray,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
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
