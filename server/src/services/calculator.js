// Carbon Emission Factors and Calculation Logic

// Constants for Emission Factors (in kg CO2 equivalent)
const EMISSION_FACTORS = {
  commute: {
    petrol: 0.170,  // per km
    diesel: 0.171,  // per km
    electric: 0.050,// per km (based on average grid intensity)
    public: 0.040,  // per km (bus/train average)
    active: 0.0     // walking, cycling
  },
  diet: {
    'heavy-meat': 8.0, // per day (meat heavy, beef/lamb)
    'low-meat': 4.5,   // per day (flexitarian, poultry/fish)
    vegetarian: 3.5,   // per day
    vegan: 2.5         // per day
  },
  energyBill: {
    low: 60,      // monthly kg CO2 (approx 150 kWh)
    medium: 140,  // monthly kg CO2 (approx 350 kWh)
    high: 280     // monthly kg CO2 (approx 700 kWh)
  },
  heating: {
    gas: 80,         // monthly kg CO2 addition
    electricity: 40, // monthly kg CO2 addition (standard heating/cooling)
    solar: 0         // clean heating
  },
  shopping: {
    frequent: 150,   // monthly kg CO2 (frequent purchases of clothing/tech)
    moderate: 60,    // monthly kg CO2 (average consumption)
    minimalist: 15   // monthly kg CO2 (thrift, buy only when needed)
  },
  waste: {
    none: 50,     // monthly kg CO2 (no recycling or composting)
    partial: 25,  // monthly kg CO2 (recycles some paper/plastic)
    full: 8       // monthly kg CO2 (fully composts and recycles)
  }
};

/**
 * Calculate the monthly carbon footprint in kg CO2e
 * @param {Object} inputs - Questionnaire responses from user
 * @returns {Object} Category-wise breakdown and totals
 */
function calculateFootprint(inputs = {}) {
  // 1. Commute Calculation
  const commuteInput = inputs.commute || {};
  const distance = Math.max(0, parseFloat(commuteInput.distance) || 0); // weekly km
  const commuteType = commuteInput.type || 'petrol';
  const commuteFactor = EMISSION_FACTORS.commute[commuteType] !== undefined 
    ? EMISSION_FACTORS.commute[commuteType] 
    : EMISSION_FACTORS.commute.petrol;
  
  // Weekly distance converted to monthly (average 4.33 weeks per month)
  const commuteEmissions = Math.round(distance * 4.33 * commuteFactor * 10) / 10;

  // 2. Diet Calculation
  const dietInput = inputs.diet || {};
  const dietType = dietInput.type || 'low-meat';
  const dietFactor = EMISSION_FACTORS.diet[dietType] !== undefined
    ? EMISSION_FACTORS.diet[dietType]
    : EMISSION_FACTORS.diet['low-meat'];
  
  // Daily emissions converted to monthly (average 30 days)
  const dietEmissions = Math.round(dietFactor * 30 * 10) / 10;

  // 3. Home Energy Calculation
  const energyInput = inputs.homeEnergy || {};
  const billLevel = energyInput.electricityBill || 'medium';
  const heatingSource = energyInput.heatingSource || 'electricity';
  
  const billEmissions = EMISSION_FACTORS.energyBill[billLevel] !== undefined
    ? EMISSION_FACTORS.energyBill[billLevel]
    : EMISSION_FACTORS.energyBill.medium;
  const heatingEmissions = EMISSION_FACTORS.heating[heatingSource] !== undefined
    ? EMISSION_FACTORS.heating[heatingSource]
    : EMISSION_FACTORS.heating.electricity;
    
  const energyEmissions = Math.round((billEmissions + heatingEmissions) * 10) / 10;

  // 4. Shopping Calculation
  const shoppingInput = inputs.shopping || {};
  const shoppingFreq = shoppingInput.frequency || 'moderate';
  const shoppingEmissions = EMISSION_FACTORS.shopping[shoppingFreq] !== undefined
    ? EMISSION_FACTORS.shopping[shoppingFreq]
    : EMISSION_FACTORS.shopping.moderate;

  // 5. Waste Calculation
  const wasteInput = inputs.waste || {};
  const recyclingLevel = wasteInput.recycling || 'partial';
  const wasteEmissions = EMISSION_FACTORS.waste[recyclingLevel] !== undefined
    ? EMISSION_FACTORS.waste[recyclingLevel]
    : EMISSION_FACTORS.waste.partial;

  // Totals
  const total = Math.round((commuteEmissions + dietEmissions + energyEmissions + shoppingEmissions + wasteEmissions) * 10) / 10;

  // National averages for comparison (e.g. US average is ~1300 kg/month, Global average is ~400 kg/month)
  // Let's set a standard benchmark for comparison (e.g. 500 kg CO2 / month is a healthy target, 1000 kg is average)
  const benchmark = 650; 
  const percentageOfBenchmark = total > 0 ? Math.round((total / benchmark) * 100) : 0;

  return {
    categories: {
      commute: commuteEmissions,
      diet: dietEmissions,
      homeEnergy: energyEmissions,
      shopping: shoppingEmissions,
      waste: wasteEmissions
    },
    total,
    benchmark,
    percentageOfBenchmark,
    inputs // Echo inputs back for reference
  };
}

module.exports = {
  calculateFootprint,
  EMISSION_FACTORS
};
