/**
 * Utility functions for formatting strings and numerical values.
 */

/**
 * Rounds a number to exactly one decimal place.
 *
 * @param {number} val - Input numerical value
 * @returns {number} Rounded value
 */
export function roundToOneDecimal(val) {
  if (typeof val !== 'number' || isNaN(val)) return 0;
  return Math.round(val * 10) / 10;
}

/**
 * Formats a number with local digit separators.
 *
 * @param {number} val - Number to format
 * @returns {string} Formatted representation
 */
export function formatNumber(val) {
  if (typeof val !== 'number' || isNaN(val)) return '0';
  return val.toLocaleString();
}
