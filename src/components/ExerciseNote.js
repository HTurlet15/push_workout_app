import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Note strip for an exercise. Displays inline in all views.
 * Tap to edit when note exists. In edit mode, shows "add note..." placeholder.
 *
 * @param {string|undefined} note - The current note text.
 * @param {boolean} editMode - Whether the global edit mode is active.
 * @param {Function} onUpdateNote - Callback with new note text.
 */
export default function ExerciseNote({ note, editMode = false, onUpdateNote }) {
  const [editing, setEditing] = useState(false);

  // Edit mode + no note → show add button
  if (!note && !editing) {
    if (!editMode) return null;

    return (
      <Pressable
        style={({ pressed }) => [styles.addNoteBtn, pressed && styles.addNoteBtnPressed]}
        onPress={() => setEditing(true)}
      >
        <Feather name="edit-2" size={12} color="#BDA200" />
        <Text variant="caption" style={styles.addNoteText}>add note...</Text>
      </Pressable>
    );
  }

  // Editing state → show input
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

  // Note exists, not editing → tap to edit
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
  noteStrip: {
    backgroundColor: '#FFFDE7',
    borderLeftWidth: 3,
    borderLeftColor: '#FDD835',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + SPACING.xs,
  },
  noteStripPressed: {
    backgroundColor: '#FFF9C4',
  },
  noteText: {
    color: '#8D6E00',
    fontStyle: 'italic',
  },
  noteInput: {
    fontSize: 12,
    color: '#8D6E00',
    fontStyle: 'italic',
    paddingVertical: SPACING.xs,
    minHeight: 28,
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#FFFDE7',
    borderLeftWidth: 3,
    borderLeftColor: '#FDD835',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + SPACING.xs,
  },
  addNoteBtnPressed: {
    backgroundColor: '#FFF9C4',
  },
  addNoteText: {
    color: '#BDA200',
    fontStyle: 'italic',
  },
});