import { useRef, useState, useCallback } from 'react';
import { Animated } from 'react-native';

/**
 * Custom hook that manages a horizontal slide transition between views.
 * Animates the outgoing view sliding out and the incoming view sliding in.
 *
 * @param {string} initialView - The starting view name.
 * @param {string[]} viewOrder - Ordered array of view names (left to right).
 * @param {number} duration - Animation duration in ms.
 * @returns {Object} Animation state and controls.
 */
export default function useSlideTransition(initialView = 'current', viewOrder = ['previous', 'current', 'next'], duration = 250) {
  const [displayedView, setDisplayedView] = useState(initialView);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  /**
   * Transitions to a new view with a slide animation.
   * Direction is determined by comparing positions in viewOrder.
   *
   * @param {string} newView - The view to transition to.
   */
  const transitionTo = useCallback((newView) => {
    if (newView === displayedView || isAnimating.current) return;

    isAnimating.current = true;

    const oldIndex = viewOrder.indexOf(displayedView);
    const newIndex = viewOrder.indexOf(newView);
    const goingRight = newIndex > oldIndex;

    // Slide current view out
    Animated.timing(slideAnim, {
      toValue: goingRight ? -1 : 1,
      duration: duration / 2,
      useNativeDriver: true,
    }).start(() => {
      // Swap the view
      setDisplayedView(newView);

      // Position new view on the opposite side
      slideAnim.setValue(goingRight ? 1 : -1);

      // Slide new view in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: duration / 2,
        useNativeDriver: true,
      }).start(() => {
        isAnimating.current = false;
      });
    });
  }, [displayedView, slideAnim, viewOrder, duration]);

  return {
    displayedView,
    slideAnim,
    transitionTo,
  };
}