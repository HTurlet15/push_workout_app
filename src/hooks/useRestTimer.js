import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Custom hook managing a rest timer countdown.
 *
 * Survit aux transitions background/foreground :
 * - En background : sauvegarde le timestamp de fin, programme une notification locale.
 * - Au retour : annule la notification, recalcule le temps restant.
 *
 * @param {number} initialDuration - Default timer duration in seconds.
 * @returns {Object} Timer state and controls.
 */
export default function useRestTimer(initialDuration = 90) {
  const [duration, setDuration] = useState(initialDuration);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [timerState, setTimerState] = useState('idle');

  const intervalRef = useRef(null);
  const endTimestampRef = useRef(null);  // Date.now() + timeRemaining * 1000 au moment du background
  const timerStateRef = useRef('idle');  // miroir synchrone pour AppState listener
  const timeRemainingRef = useRef(initialDuration);

  // Garder les refs synchronisées
  timerStateRef.current = timerState;
  timeRemainingRef.current = timeRemaining;

  // ── Notifications ──────────────────────────────────────────

  const requestNotifPermission = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }, []);

  const scheduleTimerNotification = useCallback(async (seconds) => {
    if (seconds <= 0) return;
    try {
      const granted = await requestNotifPermission();
      if (!granted) return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Push.',
          body: 'Timer done — get back to work 💪',
          sound: true,
        },
        trigger: { type: 'timeInterval', seconds, repeats: false },
      });
    } catch (e) {
      // Permissions refusées ou erreur — le timer continue sans notif
    }
  }, [requestNotifPermission]);

  const cancelScheduledNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {}
  }, []);

  // ── Interval helpers ──────────────────────────────────────

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setTimerState('done');
          endTimestampRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // ── AppState : background / foreground ────────────────────

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        // L'app part en arrière-plan
        if (timerStateRef.current === 'running') {
          endTimestampRef.current = Date.now() + timeRemainingRef.current * 1000;
          clearTimer();
          scheduleTimerNotification(timeRemainingRef.current);
        }
      } else if (nextState === 'active') {
        // L'app revient au premier plan
        cancelScheduledNotifications();

        if (timerStateRef.current === 'running' && endTimestampRef.current !== null) {
          const remaining = Math.round((endTimestampRef.current - Date.now()) / 1000);
          endTimestampRef.current = null;

          if (remaining <= 0) {
            clearTimer();
            setTimeRemaining(0);
            setTimerState('done');
          } else {
            setTimeRemaining(remaining);
            startInterval();
          }
        }
      }
    });

    return () => subscription.remove();
  }, [clearTimer, startInterval, scheduleTimerNotification, cancelScheduledNotifications]);

  // ── Cleanup on unmount ────────────────────────────────────

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // ── Public controls ───────────────────────────────────────

  const play = useCallback(() => {
    if (timerState === 'done') return;
    setTimerState('running');
    startInterval();
  }, [timerState, startInterval]);

  const pause = useCallback(() => {
    clearTimer();
    cancelScheduledNotifications();
    endTimestampRef.current = null;
    setTimerState('idle');
  }, [clearTimer, cancelScheduledNotifications]);

  const playPause = useCallback(() => {
    if (timerState === 'running') {
      pause();
    } else if (timerState === 'done') {
      reset();
    } else {
      play();
    }
  }, [timerState, play, pause]);

  const reset = useCallback(() => {
    clearTimer();
    cancelScheduledNotifications();
    endTimestampRef.current = null;
    setTimeRemaining(duration);
    setTimerState('idle');
  }, [clearTimer, cancelScheduledNotifications, duration]);

  const updateDuration = useCallback((newDuration) => {
    clearTimer();
    cancelScheduledNotifications();
    endTimestampRef.current = null;
    setDuration(newDuration);
    setTimeRemaining(newDuration);
    setTimerState('idle');
  }, [clearTimer, cancelScheduledNotifications]);

  const startWithDuration = useCallback((seconds) => {
    clearTimer();
    cancelScheduledNotifications();
    endTimestampRef.current = null;
    setDuration(seconds);
    setTimeRemaining(seconds);
    setTimerState('running');

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setTimerState('done');
          endTimestampRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, cancelScheduledNotifications]);

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
