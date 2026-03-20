import { View, ScrollView, Pressable, Animated, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../common/Text';
import ProgramCard from './ProgramCard';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE } from '../../theme/theme';

/**
 * Scrollable list of program cards with:
 * - Radio selection (one active program at a time)
 * - Expand/collapse workout preview per card
 * - Edit mode: delete programs, add new program
 * - Pop-in / depop animations
 *
 * @param {Array} programs            - Array of program objects.
 * @param {string} selectedProgramId  - ID of the currently active program.
 * @param {boolean} editMode          - Whether edit controls are visible.
 * @param {Function} onSelectProgram  - Select a program by ID.
 * @param {Function} onAddProgram     - Add a new program.
 * @param {Function} onDeleteProgram  - Delete a program by index.
 * @param {Function} onUpdateProgramNote - Update a program's note by index.
 * @param {Function} onUpdateProgramFrequency - Update a program's frequency by index.
 * @param {Function} onUpdateProgramName - Update a program's name by index.
 */
export default function ProgramsList({
  programs,
  selectedProgramId,
  editMode,
  onSelectProgram,
  onAddProgram,
  onDeleteProgram,
  onUpdateProgramNote,
  onUpdateProgramFrequency,
  onUpdateProgramName,
}) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);
  const [newIndices, setNewIndices] = useState(new Set());
  const deleteAnims = useRef({});

  // Collapse expanded cards when entering edit mode
  useEffect(() => {
    if (editMode) setExpandedId(null);
  }, [editMode]);

  // ── Delete animation ──────────────────────────────────────

  const handleDelete = (index) => {
    const key = `delete-${index}`;
    deleteAnims.current[key] = new Animated.Value(1);
    setNewIndices((prev) => new Set(prev));

    Animated.timing(deleteAnims.current[key], {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      delete deleteAnims.current[key];
      onDeleteProgram(index);
    });
  };

  // ── Add animation ─────────────────────────────────────────

  const handleAdd = () => {
    const newIndex = programs.length;
    onAddProgram();
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

  const renderCard = (program, index) => {
    const deleteKey = `delete-${index}`;
    const deleteAnim = deleteAnims.current[deleteKey];
    const isNew = newIndices.has(index);

    const card = (
      <ProgramCard
        program={program}
        isSelected={program.id === selectedProgramId}
        isExpanded={expandedId === program.id}
        editMode={editMode}
        onSelect={() => onSelectProgram(program.id)}
        onToggleExpand={() =>
          setExpandedId((prev) => (prev === program.id ? null : program.id))
        }
        onDelete={() => handleDelete(index)}
        onUpdateNote={(text) => onUpdateProgramNote?.(index, text)}
        onUpdateFrequency={(text) => onUpdateProgramFrequency?.(index, text)}
        onUpdateName={(text) => onUpdateProgramName?.(index, text)}
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
          key={program.id}
          style={{ opacity: deleteAnim, transform: [{ scale }] }}
        >
          {card}
        </Animated.View>
      );
    }

    if (isNew) {
      return (
        <PopInWrapper key={program.id}>
          {card}
        </PopInWrapper>
      );
    }

    return <View key={program.id}>{card}</View>;
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="screenTitle">{t('programs.title')}</Text>
      </View>

      {programs.map((program, index) => renderCard(program, index))}

      {programs.length === 0 && !editMode && (
        <Pressable
          style={({ pressed }) => [
            styles.emptyAddBtn,
            pressed && styles.addBtnPressed,
          ]}
          onPress={handleAdd}
        >
          <Feather name="plus" size={SIZE.iconChevron} color={COLORS.viewCurrent} />
          <Text style={[styles.addBtnText, { color: COLORS.viewCurrent }]}>{t('programs.add')}</Text>
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
          <Text style={styles.addBtnText}>{t('programs.add')}</Text>
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
  addBtnPressed: {
    backgroundColor: COLORS.lightGray,
  },
  addBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
});