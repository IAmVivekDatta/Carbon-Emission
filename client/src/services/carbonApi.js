/**
 * Network requests and data integrations for carbon calculation, suggestions, and challenges.
 */

/**
 * Sends a questionnaire payload to calculate a carbon profile.
 *
 * @param {Object} formData - Questionnaire input answers
 * @returns {Promise<Object>} Calculated carbon profile
 */
export async function calculateFootprint(formData) {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
      });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to calculate footprint.');
  }
  return data;
}

/**
 * Fetches personalized action recommendations based on emission categories.
 *
 * @param {Object} categories - Emission category breakdown map
 * @param {Object} inputs - User questionnaire answers
 * @returns {Promise<Array<Object>>} Recommended actions
 */
export async function fetchRecommendations(categories, inputs) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories, inputs })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch recommendations.');
  }
  return data.recommendations || [];
}

/**
 * Fetches all available weekly eco challenges.
 *
 * @returns {Promise<Array<Object>>} Weekly eco challenges list
 */
export async function fetchWeeklyChallenges() {
  const response = await fetch('/api/challenges');
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch challenges.');
  }
  return data.challenges || [];
}
