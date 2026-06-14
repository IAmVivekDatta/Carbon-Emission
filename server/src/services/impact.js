// Impact Translation Engine

/**
 * Translates numeric carbon savings (in kg CO2e) into tangible, real-world stories.
 * 
 * Calculations:
 * - 1 kg CO2 ≈ 5.88 km driven in an average petrol passenger car.
 * - 1 kg CO2 ≈ 1 tree absorbing carbon for 16.5 days (based on 22 kg CO2 absorbed per tree per year).
 * - 1 kg CO2 ≈ 120 smartphone charges (based on ~0.0083 kg CO2 per standard charge cycle).
 * 
 * @param {number} kgSaved - The carbon savings in kilograms
 * @returns {Object} Equivalents object containing car, tree, and phone equivalents
 */
function translateImpact(kgSaved = 0) {
  const value = Math.max(0, parseFloat(kgSaved) || 0);

  // Math conversions
  const carKms = Math.round(value * 5.88 * 10) / 10;
  const treeDays = Math.round(value * 16.5);
  const phoneCharges = Math.round(value * 1205) / 10; // Let's use 120.5 charges per kg

  // Formulate textual equivalents
  const stories = {
    car: `Avoiding a ${carKms.toLocaleString()} km drive in a medium-sized gasoline car.`,
    tree: `Giving one mature tree ${treeDays.toLocaleString()} days to absorb carbon from the atmosphere.`,
    phone: `Charging a standard smartphone ${Math.round(phoneCharges).toLocaleString()} times.`
  };

  return {
    rawKg: value,
    equivalents: {
      carKms,
      treeDays,
      phoneCharges: Math.round(phoneCharges)
    },
    stories
  };
}

module.exports = {
  translateImpact
};
