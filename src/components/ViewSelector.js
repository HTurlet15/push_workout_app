import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_FAMILY, SIZE } from '../theme/theme';

/**
 * Navigation control cycling between Previous, Current, and Next views.
 *
 * Displays the active view name as a colored pill badge flanked by
 * directional chevron arrows. Badge and arrow colors dynamically
 * match the active view accent (gray / blue / orange).
 *
 * View order: Previous ← Current → Next
 * Disabled arrows (at bounds) render in muted gray.
 *
 * @param {'previous'|'current'|'next'} activeView - Currently displayed view.
 * @param {Function} onChangeView - Callback with the new view name string.
 */

const VIEWS = ['previous', 'current', 'next'];

const VIEW_LABELS = {
  previous: 'Previous',
  current: 'Current',
  next: 'Next',
};

const VIEW_COLORS = {
  previous: COLORS.viewPrevious,
  current: COLORS.viewCurrent,
  next: COLORS.viewNext,
};

export default function ViewSelector({ activeView, onChangeView }) {
  const currentIndex = VIEWS.indexOf(activeView);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < VIEWS.length - 1;
  const accentColor = VIEW_COLORS[activeView];

  const goLeft = () => {
    if (hasPrevious) onChangeView(VIEWS[currentIndex - 1]);
  };

  const goRight = () => {
    if (hasNext) onChangeView(VIEWS[currentIndex + 1]);
  };

  return (
    <View style={styles.container}>
      {/* Left arrow — navigates to previous view */}
      <TouchableOpacity
        onPress={goLeft}
        activeOpacity={0.6}
        disabled={!hasPrevious}
        hitSlop={{ top: SPACING.md, bottom: SPACING.md, left: SPACING.md, right: SPACING.md }}
      >
        <Feather
          name="chevron-left"
          size={SIZE.chevronSize}
          color={hasPrevious ? accentColor : COLORS.mediumGray}
        />
      </TouchableOpacity>

      {/* View label badge — colored by active view */}
      <View style={[styles.badge, { backgroundColor: accentColor }]}>
        <Text variant="caption" style={styles.badgeText}>
          {VIEW_LABELS[activeView]}
        </Text>
      </View>

      {/* Right arrow — navigates to next view */}
      <TouchableOpacity
        onPress={goRight}
        activeOpacity={0.6}
        disabled={!hasNext}
        hitSlop={{ top: SPACING.md, bottom: SPACING.md, left: SPACING.md, right: SPACING.md }}
      >
        <Feather
          name="chevron-right"
          size={SIZE.chevronSize}
          color={hasNext ? accentColor : COLORS.mediumGray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZE.viewSelectorWidth,
    justifyContent: 'space-between',
  },
  /** Colored pill showing active view name */
  badge: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  badgeText: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.semibold,
  },
});