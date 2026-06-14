/**
 * Chat and advisor integrations for the AI Coach API.
 */

/**
 * Sends a query to the AI Coach chat endpoint.
 *
 * @param {string} userQuestion - Prompt question from the user
 * @param {Object} profileData - Calculated carbon profile categories
 * @param {Array<Object>} recommendations - Action checklist recommendations
 * @returns {Promise<string>} Coach response text
 */
export async function sendCoachMessage(userQuestion, profileData, recommendations) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userQuestion,
      profileData,
      recommendations
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Coach is offline.');
  }
  return data.reply;
}
