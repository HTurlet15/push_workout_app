import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, SIZE } from '../theme/theme';

/**
 * Exercise annotation strip displayed below the table header.
 *
 * Renders in three modes:
 * 1. No note + not in edit mode → hidden (returns null)
 * 2. No note + edit mode → yellow "add note..." button
 * 3. Note exists → yellow strip, tappable to edit inline
 *
 * Notes persist across views (Previous, Current, Next) and are
 * always editable by tapping, regardless of edit mode.
 * Uses DM Sans Italic for visual distinction from data content.
 *
 * @param {string|undefined} note    - Current note text.
 * @param {boolean} editMode         - Whether global edit mode is active.
 * @param {Function} onUpdateNote    - Callback with updated note text.
 */
export default function ExerciseNote({ note, editMode = false, onUpdateNote }) {
  const [editing, setEditing] = useState(false);

  // ── No note, not editing: show add button only in edit mode ──
  if (!note && !editing) {
    if (!editMode) return null;

    return (
      <Pressable
        style={({ pressed }) => [styles.addNoteBtn, pressed && styles.addNoteBtnPressed]}
        onPress={() => setEditing(true)}
      >
        <Feather name="edit-2" size={FONT_SIZE.caption} color={COLORS.notePlaceholder} />
        <Text variant="caption" style={styles.addNoteText}>add note...</Text>
      </Pressable>
    );
  }

  // ── Editing: inline TextInput ──
  if (editing) {
    return (
      <View style={styles.noteStrip}>
        <TextInput
          style={styles.noteInput}
          value={note || ''}
          onChangeText={onUpdateNote}
          placeholder="Write a note..."
          placeholderTextColor={COLORS.mediumGray}
          returnKeyType="done"
          autoFocus
          onSubmitEditing={() => setEditing(false)}
          onBlur={() => setEditing(false)}
        />
      </View>
    );
  }

  // ── Display: tappable note strip ──
  return (
    <Pressable
      style={({ pressed }) => [styles.noteStrip, pressed && styles.noteStripPressed]}
      onPress={() => setEditing(true)}
    >
      <Text variant="caption" style={styles.noteText}>{note}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /** Yellow strip container — consistent height whether reading or editing */
  noteStrip: {
    backgroundColor: COLORS.noteBackground,
    borderLeftWidth: SIZE.noteBorderLeft,
    borderLeftColor: COLORS.noteBorder,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + SPACING.xs,
    minHeight: 36,
    justifyContent: 'center',
  },
  noteStripPressed: {
    backgroundColor: COLORS.noteBackgroundPressed,
  },
  /** Display text: italic for visual distinction from data */
  noteText: {
    color: COLORS.noteText,
    fontSize: FONT_SIZE.caption,
    fontFamily: FONT_FAMILY.italic,
  },
  /** Edit input: matches noteText styling to prevent layout shift */
  noteInput: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.noteText,
    fontFamily: FONT_FAMILY.italic,
    padding: 0,
    margin: 0,
    minHeight: SPACING.md,
  },
  /** "add note..." button — same yellow theme as note strip */
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.noteBackground,
    borderLeftWidth: SIZE.noteBorderLeft,
    borderLeftColor: COLORS.noteBorder,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + SPACING.xs,
  },
  addNoteBtnPressed: {
    backgroundColor: COLORS.noteBackgroundPressed,
  },
  addNoteText: {
    color: COLORS.notePlaceholder,
    fontFamily: FONT_FAMILY.italic,
  },
});