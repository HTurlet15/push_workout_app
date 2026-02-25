import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import WorkoutScreen from '../../screens/WorkoutScreen';

/**
 * Horizontal pager wrapping multiple WorkoutScreens.
 *
 * Extracted from MainScreen for clarity.
 * Parent controls: initialIndex, sessions, setSessions, editMode, timer.
 *
 * @param {Array} sessions            - Session data array.
 * @param {Function} makeSetWorkout   - Factory for per-session workout setters.
 * @param {Function} makeSetNextWorkout - Factory for per-session next setters.
 * @param {boolean} editMode          - Edit mode state.
 * @param {Function} startWithDuration - Timer start callback.
 * @param {Function} updateDuration   - Timer update callback.
 * @param {Function} onPageChange     - Called with new index when page changes.
 */
const WorkoutPager = forwardRef(({
  sessions,
  makeSetWorkout,
  makeSetNextWorkout,
  editMode,
  startWithDuration,
  updateDuration,
  onPageChange,
}, ref) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);

  // Expose scrollToIndex to parent
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index) => {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    },
  }));

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      onPageChange?.(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

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

  return (
    <FlatList
      ref={flatListRef}
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
  );
});

WorkoutPager.displayName = 'WorkoutPager';

export default WorkoutPager;
