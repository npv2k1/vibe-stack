import { useEffect, useState } from 'react';

/**
 * useLocalState<T>
 *
 * A React hook that manages state synchronized with window.localStorage.
 *
 * The hook initializes state by attempting to read the value stored under the
 * provided key in localStorage. If a stored value exists, it is parsed from JSON
 * and used as the initial state; otherwise the provided initialValue is used.
 * Whenever the state changes, it is serialized to JSON and written back to
 * localStorage under the same key.
 *
 * @template T - Type of the stored value.
 * @param key - The localStorage key used to persist the state.
 * @param initialValue - The initial value to use when there is no value in localStorage.
 * @returns A tuple containing the current state and a setter function.
 *
 * @remarks
 * - Values must be JSON-serializable. Non-serializable values (such as functions
 *   or circular structures) will cause JSON.stringify/parse to fail.
 * - In environments where localStorage is unavailable (e.g., some server-side
 *   rendering scenarios or restricted browsers), accessing localStorage may throw.
 *   Consider guarding usage or providing a compatible environment.
 * - The setter works like React's setState for useState: it accepts either a new
 *   value or an updater function (prev => next).
 *
 * @example
 * // Store a string
 * const [name, setName] = useLocalState<string>('user:name', 'Guest');
 *
 * @example
 * // Store a complex object
 * const [prefs, setPrefs] = useLocalState<{ theme: string }>('app:prefs', { theme: 'light' });
 */
export function useLocalState<T = any>(key: string, initialValue: T) {
  // Retrieve from localStorage or use the initial value
  const [state, setState] = useState<T>(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? JSON.parse(savedValue) : initialValue;
  });

  useEffect(() => {
    // Save to localStorage whenever the state changes
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
