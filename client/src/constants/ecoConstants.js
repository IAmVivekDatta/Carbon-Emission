/**
 * Constant values and configurations for the Verdant Pulse application.
 */

export const DIET_OPTIONS = [
  { value: 'heavy-meat', label: 'Meat-Loving', desc: 'Frequent beef, lamb, and pork meals' },
  { value: 'low-meat', label: 'Flexitarian / Low-Meat', desc: 'Mostly poultry, fish, and vegetarian meals' },
  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, but eats eggs and dairy products' },
  { value: 'vegan', label: 'Vegan', desc: 'Strictly plant-based nutrition' }
];

export const COMMUTE_TYPES = [
  { value: 'petrol', label: 'Gasoline / Petrol Car' },
  { value: 'diesel', label: 'Diesel Car' },
  { value: 'electric', label: 'Electric Vehicle (EV)' },
  { value: 'public', label: 'Public Transport (Train/Bus)' },
  { value: 'active', label: 'Active Transit (Biking/Walking)' }
];

export const ELECTRICITY_BILLS = [
  { value: 'low', label: 'Low (Under $50 / ~150 kWh)' },
  { value: 'medium', label: 'Medium ($50 - $120 / ~350 kWh)' },
  { value: 'high', label: 'High (Over $120 / ~700 kWh)' }
];

export const HEATING_SOURCES = [
  { value: 'electricity', label: 'Electric Heat Pump / AC' },
  { value: 'gas', label: 'Natural Gas Furnace' },
  { value: 'solar', label: 'Solar Energy / Geothermal / None' }
];

export const SHOPPING_FREQUENCIES = [
  { value: 'minimalist', label: 'Minimalist (Buy only essentials, second-hand first)' },
  { value: 'moderate', label: 'Average (Moderate buy-new rates)' },
  { value: 'frequent', label: 'Frequent (Buy new items weekly)' }
];

export const RECYCLING_LEVELS = [
  { value: 'full', label: 'Full recycling & organic waste composting' },
  { value: 'partial', label: 'Recycle basic items (paper, plastic)' },
  { value: 'none', label: 'No sorting or recycling' }
];

/**
 * Emission boundaries for the Carbon Twin visualization states.
 */
export const EMISSION_THRESHOLDS = {
  LOW: 350,
  MEDIUM: 700
};

/**
 * Conversion constants mapping CO2 savings to physical equivalent impact metrics.
 */
export const IMPACT_CONVERSIONS = {
  CAR_KMS_PER_KG: 5.88,
  TREE_DAYS_PER_KG: 16.5,
  PHONE_CHARGES_PER_KG: 120
};

/**
 * Static suggestion chips for the AI coach conversational agent.
 */
export const COACH_SUGGESTION_CHIPS = [
  "What should I change first?",
  "How can I cut my food footprint?",
  "Tips for lowering energy bills",
  "Explain my recycling impact"
];
