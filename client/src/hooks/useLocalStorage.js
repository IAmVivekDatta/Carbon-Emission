import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

/**
 * Custom React hook for safely managing reactive state synchronized with localStorage.
 *
 * @param {string} key - Storage key identifier
 * @param {*} initialValue - Fallback value if storage is empty
 * @returns {[*, Function, Function]} State value, state setter, and state remover
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => getStorageItem(key, initialValue));

  const setValue = useCallback((value) => {
    setStoredValue((prevValue) => {
      const valueToStore = value instanceof Function ? value(prevValue) : value;
      setStorageItem(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    removeStorageItem(key);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
