import { IMPACT_CONVERSIONS } from '../constants/ecoConstants';
import { roundToOneDecimal } from './formatters';

/**
 * Calculations helper for carbon metrics, equivalents, and savings values.
 */

/**
 * Computes total savings from active action plan checkboxes.
 *
 * @param {Object} loggedToday - Map of actionId to boolean logged status
 * @param {Array<Object>} recommendations - Loaded action plan options
 * @returns {number} Saved CO2 in kg
 */
export function calculateSavings(loggedToday, recommendations) {
  if (!loggedToday || !recommendations) return 0;
  return Object.entries(loggedToday)
    .filter(([_, logged]) => logged)
    .reduce((sum, [id]) => {
      const rec = recommendations.find(r => r.id === id);
      return sum + (rec ? rec.estimatedSavings : 0);
    }, 0);
}

/**
 * Computes total savings from completed weekly challenges.
 *
 * @param {Object} completedChallenges - Map of challengeId to boolean completion status
 * @param {Array<Object>} challenges - Available weekly challenges
 * @returns {number} Saved CO2 in kg
 */
export function calculateChallengeSavings(completedChallenges, challenges) {
  if (!completedChallenges || !challenges) return 0;
  return Object.entries(completedChallenges)
    .filter(([_, completed]) => completed)
    .reduce((sum, [id]) => {
      const chal = challenges.find(c => c.id === id);
      return sum + (chal ? chal.co2Savings : 0);
    }, 0);
}

/**
 * Derives physical equivalents (e.g. tree days, car distance) from carbon savings.
 *
 * @param {number} totalSavings - Saved emissions in kg CO2e
 * @returns {Object} Equivalent values (carKms, treeDays, phoneCharges)
 */
export function deriveImpactEquivalent(totalSavings) {
  return {
    carKms: roundToOneDecimal(totalSavings * IMPACT_CONVERSIONS.CAR_KMS_PER_KG),
    treeDays: Math.round(totalSavings * IMPACT_CONVERSIONS.TREE_DAYS_PER_KG),
    phoneCharges: Math.round(totalSavings * IMPACT_CONVERSIONS.PHONE_CHARGES_PER_KG)
  };
}
