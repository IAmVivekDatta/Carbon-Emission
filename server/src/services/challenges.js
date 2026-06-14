// Weekly Challenges Definitions

const WEEKLY_CHALLENGES = [
  {
    id: 'challenge_meat_free_friday',
    title: 'Meat-Free Friday',
    description: 'Avoid beef, pork, and chicken for the entire day. Fuel your body with grains, beans, and fresh vegetables instead.',
    co2Savings: 7.5, // kg CO2e saved
    difficulty: 'Easy',
    badge: '🥗 Green Gourmet'
  },
  {
    id: 'challenge_no_cab_week',
    title: 'Zero Ride-Hailing Week',
    description: 'Commit to avoiding all personal taxi or ride-sharing trips for 7 days. Opt for public transit, biking, or walking.',
    co2Savings: 15.0,
    difficulty: 'Medium',
    badge: '🚶 Urban Voyager'
  },
  {
    id: 'challenge_idle_devices',
    title: 'Phantom Power Purge',
    description: 'Unplug chargers, gaming consoles, microwaves, and media systems before bed for 5 consecutive nights.',
    co2Savings: 3.5,
    difficulty: 'Easy',
    badge: '🔌 Power Purger'
  },
  {
    id: 'challenge_public_transit',
    title: 'Transit Champion Week',
    description: 'Commute to work or school using public transport instead of a single-passenger car for 4 days this week.',
    co2Savings: 20.0,
    difficulty: 'Medium',
    badge: '🚇 Transit Hero'
  },
  {
    id: 'challenge_buy_nothing',
    title: 'Buy-Nothing Week',
    description: 'Do not buy any non-essential consumer goods, clothing, or tech gadgets for a full 7 days.',
    co2Savings: 18.0,
    difficulty: 'Hard',
    badge: '🛍️ Mindful Minimalist'
  }
];

/**
 * Retrieve the current set of weekly challenges.
 * @returns {Array} List of challenges
 */
function getWeeklyChallenges() {
  return WEEKLY_CHALLENGES;
}

module.exports = {
  getWeeklyChallenges,
  WEEKLY_CHALLENGES
};
