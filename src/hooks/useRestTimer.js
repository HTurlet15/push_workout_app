import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook managing a rest timer countdown.
 *
 * Returns the current state, time remaining, and control functions.
 * Uses useRef for the interval to avoid stale closures.
 *
 * @param {number} initialDuration - Default timer duration in seconds.
 * @returns {Object} Timer state and controls.
 */
export default function useRestTimer(initialDuration = 90) {
  const [duration, setDuration] = useState(initialDuration);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [timerState, setTimerState] = useState('idle');
  const intervalRef = useRef(null);

  /**
   * Cleans up the interval to prevent memory leaks.
   * Called on pause, reset, done, and component unmount.
   */
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Starts the countdown from the current timeRemaining.
   * Creates an interval that decrements every second.
   */
  const play = useCallback(() => {
    if (timerState === 'done') return;

    setTimerState('running');

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setTimerState('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timerState, clearTimer]);

  /**
   * Pauses the countdown without resetting.
   */
  const pause = useCallback(() => {
    clearTimer();
    setTimerState('idle');
  }, [clearTimer]);

  /**
   * Toggles between play and pause.
   * If done, resets and starts again.
   */
  const playPause = useCallback(() => {
    if (timerState === 'running') {
      pause();
    } else if (timerState === 'done') {
      reset();
    } else {
      play();
    }
  }, [timerState, play, pause]);

  /**
   * Resets the timer to the configured duration.
   */
  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(duration);
    setTimerState('idle');
  }, [clearTimer, duration]);

  /**
   * Updates the timer duration and resets to idle.
   *
   * @param {number} newDuration - New duration in seconds.
   */
  const updateDuration = useCallback((newDuration) => {
    clearTimer();
    setDuration(newDuration);
    setTimeRemaining(newDuration);
    setTimerState('idle');
  }, [clearTimer]);

  /**
   * Sets a specific duration and immediately starts the countdown.
   * Used for auto-starting the timer when a set is completed.
   *
   * @param {number} seconds - Duration in seconds to count down from.
   */
  const startWithDuration = useCallback((seconds) => {
    clearTimer();
    setDuration(seconds);
    setTimeRemaining(seconds);
    setTimerState('running');

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setTimerState('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  /** Cleanup interval on unmount */
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    timerState,
    timeRemaining,
    duration,
    playPause,
    reset,
    updateDuration,
    startWithDuration,
  };
}