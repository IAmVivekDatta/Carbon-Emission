/**
 * Safe read, write, and removal operations for browser localStorage.
 */

/**
 * Safely fetches and parses an item from localStorage.
 *
 * @param {string} key - Storage key identifier
 * @param {*} fallbackValue - Fallback value if storage is empty or errors
 * @returns {*} Retrieved value or fallback
 */
export function getStorageItem(key, fallbackValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage:`, err);
    return fallbackValue;
  }
}

/**
 * Safely writes a value to localStorage.
 *
 * @param {string} key - Storage key identifier
 * @param {*} value - Data to serialize and store
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing key "${key}" to localStorage:`, err);
  }
}

/**
 * Safely deletes a value from localStorage.
 *
 * @param {string} key - Storage key identifier
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing key "${key}" from localStorage:`, err);
  }
}
