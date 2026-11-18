import { useCallback, useEffect, useRef, useState } from 'react';

const SYNC_EVENT = 'homevoice:stored-state';

export function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the current session functional when storage is unavailable.
    }
  }, [key, value]);

  useEffect(() => {
    function synchronizePreference(event) {
      if (event.detail?.key !== key) return;
      valueRef.current = event.detail.value;
      setValue(event.detail.value);
    }
    window.addEventListener(SYNC_EVENT, synchronizePreference);
    return () => window.removeEventListener(SYNC_EVENT, synchronizePreference);
  }, [key]);

  const setStoredValue = useCallback((nextValue) => {
    const next = typeof nextValue === 'function' ? nextValue(valueRef.current) : nextValue;
    valueRef.current = next;
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // The preference still applies for this session if storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value: next } }));
  }, [key]);

  return [value, setStoredValue];
}
