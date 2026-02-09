import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../theme/theme';

/**
 * Navigation control that cycles between Previous, Current, and Next views
 * for a single exercise. Displays the active view name as a colored badge
 * flanked by directional arrows.
 *
 * View order: Previous ← Current → Next
 *
 * @param {Object} props
 * @param {'previous'|'current'|'next'} props.activeView - Currently displayed view.
 * @param {Function} props.onChangeView - Callback with the new view name.
 */

const VIEWS = ['previous', 'current', 'next'];

const VIEW_LABELS = {
  previous: 'Previous',
  current: 'Current',
  next: 'Next',
};

export default function ViewSelector({ activeView, onChangeView }) {
  const currentIndex = VIEWS.indexOf(activeView);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < VIEWS.length - 1;

  const goLeft = () => {
    if (hasPrevious) onChangeView(VIEWS[currentIndex - 1]);
  };

  const goRight = () => {
    if (hasNext) onChangeView(VIEWS[currentIndex + 1]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={goLeft}
        activeOpacity={0.6}
        disabled={!hasPrevious}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Feather
          name="chevron-left"
          size={FONT_SIZE.title}
          color={hasPrevious ? COLORS.mediumBlue : COLORS.lightBlue}
        />
      </TouchableOpacity>

      <View style={styles.badge}>
        <Text variant="caption" style={styles.badgeText}>
          {VIEW_LABELS[activeView]}
        </Text>
      </View>

      <TouchableOpacity
        onPress={goRight}
        activeOpacity={0.6}
        disabled={!hasNext}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Feather
          name="chevron-right"
          size={FONT_SIZE.title}
          color={hasNext ? COLORS.mediumBlue : COLORS.lightBlue}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: COLORS.mediumBlue,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  badgeText: {
    color: COLORS.background,
    fontWeight: '600',
  },
});