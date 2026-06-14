/**
 * @typedef {Object} CategoryEmissions
 * @property {number} commute - Monthly commute emissions in kg CO2e
 * @property {number} diet - Monthly diet emissions in kg CO2e
 * @property {number} homeEnergy - Monthly home energy emissions in kg CO2e
 * @property {number} shopping - Monthly shopping emissions in kg CO2e
 * @property {number} waste - Monthly waste emissions in kg CO2e
 */

/**
 * @typedef {Object} CarbonProfile
 * @property {CategoryEmissions} categories - Detailed category breakdown
 * @property {number} total - Total baseline emissions in kg CO2e
 * @property {number} benchmark - Target benchmark emissions in kg CO2e
 * @property {Object} inputs - User questionnaire inputs
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} id - Unique recommendation ID
 * @property {string} title - Actionable recommendation title
 * @property {string} category - Associated emission category
 * @property {string} reason - Justification for the recommendation
 * @property {number} estimatedSavings - Monthly savings in kg CO2e
 * @property {string} difficulty - Easy, Medium, or Hard difficulty
 * @property {string} [actionVerb] - Optional text for action button
 */

/**
 * @typedef {Object} Challenge
 * @property {string} id - Unique challenge ID
 * @property {string} title - Challenge name
 * @property {string} description - Brief summary of instructions
 * @property {number} co2Savings - Saved emissions in kg CO2e
 * @property {string} difficulty - Easy, Medium, or Hard difficulty
 * @property {string} badge - Badge title awarded upon completion
 */

/**
 * @typedef {Object} ChatMessage
 * @property {'coach'|'user'} sender - Message author
 * @property {string} text - Message body
 * @property {Date} timestamp - Time sent
 */
export {};
