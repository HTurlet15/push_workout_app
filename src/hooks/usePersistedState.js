import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook that behaves like useState but persists the value
 * to AsyncStorage. On mount, it loads the saved value if available.
 * On every state change, it saves the new value automatically.
 *
 * @param {string} storageKey - Unique key for AsyncStorage (e.g. 'push_workout').
 * @param {*} defaultValue - Fallback value if nothing is stored yet.
 * @returns {[*, Function, boolean]} - [value, setValue, isLoading]
 */
export default function usePersistedState(storageKey, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  /** Load saved data from AsyncStorage on first render */
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);

        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.warn(`Failed to load ${storageKey}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [storageKey]);

  /** Save to AsyncStorage whenever the value changes */
  useEffect(() => {
    if (isLoading) return;

    const save = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save ${storageKey}:`, error);
      }
    };

    save();
  }, [value, storageKey, isLoading]);

  return [value, setValue, isLoading];
}