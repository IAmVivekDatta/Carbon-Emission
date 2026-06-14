// Personalized Action Plan Recommendation Engine

const RECOMMENDATIONS_POOL = {
  commute: [
    {
      id: 'commute_carpool',
      title: 'Embrace Carpooling or Transit twice a week',
      category: 'commute',
      reason: 'Sharing your commute or utilizing public transit for mid-distance trips drastically reduces your direct fuel consumption.',
      estimatedSavings: 45, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Log 2 transit trips this week'
    },
    {
      id: 'commute_active',
      title: 'Transition to Active Transit for short journeys',
      category: 'commute',
      reason: 'Walking or cycling for trips under 3 km releases zero carbon, helps dodge city traffic, and improves cardiovascular health.',
      estimatedSavings: 20, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Walk or cycle for a short trip'
    },
    {
      id: 'commute_ev',
      title: 'Upgrade to a Hybrid or Electric Vehicle (EV)',
      category: 'commute',
      reason: 'EVs emit 60-70% less lifetime CO2 than conventional gasoline engines, making them the single highest-impact commute improvement.',
      estimatedSavings: 150, // kg CO2 / month
      difficulty: 'Hard',
      actionVerb: 'Research local EV rebates or test drive'
    }
  ],
  diet: [
    {
      id: 'diet_meatless_mondays',
      title: 'Incorporate one plant-based day a week',
      category: 'diet',
      reason: 'Trading red meats for beans, pulses, and greens just once a week makes a surprisingly heavy dent in global livestock emissions.',
      estimatedSavings: 30, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Prepare a fully plant-based meal today'
    },
    {
      id: 'diet_flexitarian',
      title: 'Adopt a Vegetarian or Flexitarian eating pattern',
      category: 'diet',
      reason: 'Limiting high-intensity beef and dairy intake is one of the most effective personal decisions for lowering carbon footprints.',
      estimatedSavings: 80, // kg CO2 / month
      difficulty: 'Medium',
      actionVerb: 'Enjoy a meat-free day'
    },
    {
      id: 'diet_waste',
      title: 'Plan meals to minimize kitchen food waste',
      category: 'diet',
      reason: 'Decomposing organic waste in landfills produces methane. Buying only what you need prevents this high-impact source of greenhouse gas.',
      estimatedSavings: 15, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Check fridge before shopping & use leftovers'
    }
  ],
  homeEnergy: [
    {
      id: 'energy_led',
      title: 'Switch to LEDs & use Smart Power Strips',
      category: 'homeEnergy',
      reason: 'LEDs consume up to 90% less energy than old incandescent bulbs and eliminate phantom power draws from standby appliances.',
      estimatedSavings: 12, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Switch off idle electronics'
    },
    {
      id: 'energy_thermostat',
      title: 'Adjust thermostat settings by 1-2°C',
      category: 'homeEnergy',
      reason: 'Slightly adjusting heating/cooling reduces load on the electrical grid and cuts utility bills by nearly 10%.',
      estimatedSavings: 25, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Adjust thermostat or use a fan/sweater'
    },
    {
      id: 'energy_insulation',
      title: 'Seal drafts and improve home insulation',
      category: 'homeEnergy',
      reason: 'Adding weatherstripping to doors and windows retains heat and cool air, preventing heating/cooling systems from working overtime.',
      estimatedSavings: 70, // kg CO2 / month
      difficulty: 'Medium',
      actionVerb: 'Seal drafty windows or doors'
    }
  ],
  shopping: [
    {
      id: 'shopping_secondhand',
      title: 'Choose second-hand or refurbished alternatives',
      category: 'shopping',
      reason: 'Extending product life cycles by shopping pre-owned avoids the carbon-heavy manufacturing processes of brand new items.',
      estimatedSavings: 40, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Check pre-owned stores before buying new'
    },
    {
      id: 'shopping_repair',
      title: 'Commit to repairing items instead of replacing',
      category: 'shopping',
      reason: 'Mending clothes or fixing electronics preserves the resources used to make them and dramatically cuts supply-chain carbon loads.',
      estimatedSavings: 20, // kg CO2 / month
      difficulty: 'Medium',
      actionVerb: 'Mend a piece of clothing or fix a broken tool'
    }
  ],
  waste: [
    {
      id: 'waste_compost',
      title: 'Establish a home composting system',
      category: 'waste',
      reason: 'Diverting organic kitchen scraps from landfill bins to compost piles avoids the creation of anaerobic methane gas.',
      estimatedSavings: 20, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Separate organic scraps for composting'
    },
    {
      id: 'waste_recycle',
      title: 'Properly clean and sort all recyclables',
      category: 'waste',
      reason: 'Contaminated recycling ends up in landfills. Clean containers ensure materials can be successfully recycled into new products.',
      estimatedSavings: 10, // kg CO2 / month
      difficulty: 'Easy',
      actionVerb: 'Wash and recycle containers correctly'
    }
  ]
};

/**
 * Generate a personalized action plan with 3 to 5 recommendations
 * ordered by carbon savings impact, prioritizing the user's highest-emission categories.
 * @param {Object} categoryEmissions - Breakdown of monthly emissions per category
 * @param {Object} inputs - User questionnaire responses for detailed routing
 * @returns {Array} List of selected recommendations
 */
function getRecommendations(categoryEmissions = {}, inputs = {}) {
  const recommendations = [];
  const commuteInput = inputs.commute || {};
  const dietInput = inputs.diet || {};
  const energyInput = inputs.homeEnergy || {};
  const shoppingInput = inputs.shopping || {};
  const wasteInput = inputs.waste || {};

  // Sort categories by highest emissions to lowest
  const sortedCategories = Object.entries(categoryEmissions)
    .sort((a, b) => b[1] - a[1]) // sort desc
    .map(entry => entry[0]);

  // For each category, pick recommendations matching user inputs
  // We want to return 4 recommendations in total (or up to 5)
  // Let's iterate through the sorted (prioritized) categories and select relevant ones
  
  const selectedIds = new Set();

  for (const category of sortedCategories) {
    const pool = RECOMMENDATIONS_POOL[category] || [];
    
    // Filter recommendations based on current user inputs to make them hyper-personalized
    const filteredPool = pool.filter(rec => {
      if (selectedIds.has(rec.id)) return false;

      // Specific conditions based on quiz answers
      if (rec.id === 'commute_carpool') {
        return (commuteInput.type === 'petrol' || commuteInput.type === 'diesel') && commuteInput.distance > 20;
      }
      if (rec.id === 'commute_active') {
        return commuteInput.distance > 5;
      }
      if (rec.id === 'commute_ev') {
        return (commuteInput.type === 'petrol' || commuteInput.type === 'diesel') && commuteInput.distance > 80;
      }
      if (rec.id === 'diet_meatless_mondays') {
        return dietInput.type === 'heavy-meat' || dietInput.type === 'low-meat';
      }
      if (rec.id === 'diet_flexitarian') {
        return dietInput.type === 'heavy-meat' || dietInput.type === 'low-meat';
      }
      if (rec.id === 'energy_led') {
        return energyInput.electricityBill === 'medium' || energyInput.electricityBill === 'high';
      }
      if (rec.id === 'energy_thermostat') {
        return energyInput.heatingSource === 'electricity' || energyInput.heatingSource === 'gas';
      }
      if (rec.id === 'energy_insulation') {
        return energyInput.electricityBill === 'high';
      }
      if (rec.id === 'shopping_secondhand' || rec.id === 'shopping_repair') {
        return shoppingInput.frequency === 'frequent' || shoppingInput.frequency === 'moderate';
      }
      if (rec.id === 'waste_compost') {
        return wasteInput.recycling === 'none' || wasteInput.recycling === 'partial';
      }
      if (rec.id === 'waste_recycle') {
        return wasteInput.recycling === 'none' || wasteInput.recycling === 'partial';
      }

      return true; // Fallback
    });

    // If we have personalized recommendations, pick the highest impact one from the filtered pool
    if (filteredPool.length > 0) {
      // Sort by savings desc
      filteredPool.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
      const chosen = filteredPool[0];
      recommendations.push(chosen);
      selectedIds.add(chosen.id);
    } else if (pool.length > 0) {
      // Fallback to anything in the pool for this category that is not already selected
      const fallback = pool.find(rec => !selectedIds.has(rec.id));
      if (fallback) {
        recommendations.push(fallback);
        selectedIds.add(fallback.id);
      }
    }
  }

  // Ensure we have at least 4 recommendations. If not, add fallback ones
  if (recommendations.length < 4) {
    const allRecs = Object.values(RECOMMENDATIONS_POOL).flat();
    for (const rec of allRecs) {
      if (!selectedIds.has(rec.id) && recommendations.length < 5) {
        recommendations.push(rec);
        selectedIds.add(rec.id);
      }
    }
  }

  // "Show the top 3 highest-impact suggestions first."
  // So we sort the chosen recommendations list by estimatedSavings desc
  recommendations.sort((a, b) => b.estimatedSavings - a.estimatedSavings);

  // Return exactly 4 or 5 recommendations (the prompt asks for 3 to 5)
  return recommendations.slice(0, 5);
}

module.exports = {
  getRecommendations,
  RECOMMENDATIONS_POOL
};
