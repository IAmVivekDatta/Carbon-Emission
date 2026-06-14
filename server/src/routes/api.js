const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { calculateFootprint } = require('../services/calculator');
const { getRecommendations } = require('../services/recommender');
const { generateCoachResponse } = require('../services/gemini');
const { translateImpact } = require('../services/impact');
const { getWeeklyChallenges } = require('../services/challenges');

/**
 * Middleware to check validation results and return structured bad-request response if there are failures.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {void}
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ 
      error: errorMsg, 
      details: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
}

// ==========================================
// Reusable Validation Sub-Chains
// ==========================================

const commuteTypeValidator = body('commute.type')
  .optional()
  .isIn(['petrol', 'diesel', 'electric', 'public', 'active'])
  .withMessage('Invalid commute type');

const dietTypeValidator = body('diet.type')
  .optional()
  .isIn(['heavy-meat', 'low-meat', 'vegetarian', 'vegan'])
  .withMessage('Invalid diet type option');

const billLevelValidator = body('homeEnergy.electricityBill')
  .optional()
  .isIn(['low', 'medium', 'high'])
  .withMessage('Invalid electricity bill level');

const heatingSourceValidator = body('homeEnergy.heatingSource')
  .optional()
  .isIn(['electricity', 'gas', 'solar'])
  .withMessage('Invalid heating source option');

const shoppingFreqValidator = body('shopping.frequency')
  .optional()
  .isIn(['frequent', 'moderate', 'minimalist'])
  .withMessage('Invalid shopping frequency option');

const recyclingLevelValidator = body('waste.recycling')
  .optional()
  .isIn(['none', 'partial', 'full'])
  .withMessage('Invalid recycling level option');

// Top-Level quiz questionnaire validations
const quizInputsValidation = [
  body('commute.distance')
    .optional()
    .isFloat({ min: 0, max: 5000 })
    .withMessage('Commute distance must be a non-negative number')
    .toFloat(),
  commuteTypeValidator,
  dietTypeValidator,
  billLevelValidator,
  heatingSourceValidator,
  shoppingFreqValidator,
  recyclingLevelValidator
];

// Nested category emissions validations
const categoriesValidation = [
  body('categories.commute').optional().isFloat({ min: 0 }).withMessage('Commute emissions must be a non-negative float').toFloat(),
  body('categories.diet').optional().isFloat({ min: 0 }).withMessage('Diet emissions must be a non-negative float').toFloat(),
  body('categories.homeEnergy').optional().isFloat({ min: 0 }).withMessage('Home energy emissions must be a non-negative float').toFloat(),
  body('categories.shopping').optional().isFloat({ min: 0 }).withMessage('Shopping emissions must be a non-negative float').toFloat(),
  body('categories.waste').optional().isFloat({ min: 0 }).withMessage('Waste emissions must be a non-negative float').toFloat()
];

// Reusable nested inputs validation for recommendations/coach payloads
const nestedInputsValidation = [
  body('inputs.commute.distance').optional().isFloat({ min: 0, max: 5000 }).toFloat(),
  body('inputs.commute.type').optional().isIn(['petrol', 'diesel', 'electric', 'public', 'active']),
  body('inputs.diet.type').optional().isIn(['heavy-meat', 'low-meat', 'vegetarian', 'vegan']),
  body('inputs.homeEnergy.electricityBill').optional().isIn(['low', 'medium', 'high']),
  body('inputs.homeEnergy.heatingSource').optional().isIn(['electricity', 'gas', 'solar']),
  body('inputs.shopping.frequency').optional().isIn(['frequent', 'moderate', 'minimalist']),
  body('inputs.waste.recycling').optional().isIn(['none', 'partial', 'full'])
];

// ==========================================
// Route Declarations
// ==========================================

/**
 * @route POST /api/calculate
 * @desc Calculate carbon footprint based on daily commute, food, energy, shopping and recycling habits.
 * @access Public
 */
router.post('/calculate',
  quizInputsValidation,
  handleValidationErrors,
  (req, res, next) => {
    try {
      const result = calculateFootprint(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/recommendations
 * @desc Generate custom emission savings recommendations prioritizing largest footprint categories.
 * @access Public
 */
router.post('/recommendations',
  [
    body('categories').isObject().withMessage('Categories breakdown must be a structured object'),
    body('inputs').isObject().withMessage('Original quiz inputs must be a structured object'),
    ...categoriesValidation,
    ...nestedInputsValidation
  ],
  handleValidationErrors,
  (req, res, next) => {
    try {
      const { categories, inputs } = req.body;
      const recommendations = getRecommendations(categories, inputs);
      res.status(200).json({ recommendations });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/chat
 * @desc AI Carbon Coach chat advisor. Leverages Gemini REST API with local offline fallback.
 * @access Public
 */
router.post('/chat',
  [
    body('userQuestion')
      .notEmpty()
      .withMessage('Question cannot be empty')
      .isString()
      .withMessage('Question must be a valid text string')
      .isLength({ max: 500 })
      .withMessage('Question must be under 500 characters to prevent API abuse')
      .trim()
      .escape(),
    body('profileData')
      .notEmpty()
      .withMessage('Carbon profile data is required')
      .isObject()
      .withMessage('Carbon profile must be an object'),
    body('profileData.total').optional().isFloat({ min: 0 }).toFloat(),
    body('profileData.benchmark').optional().isFloat({ min: 0 }).toFloat(),
    body('profileData.percentageOfBenchmark').optional().isInt().toInt(),
    
    // Nested categories under profileData
    body('profileData.categories.commute').optional().isFloat({ min: 0 }).toFloat(),
    body('profileData.categories.diet').optional().isFloat({ min: 0 }).toFloat(),
    body('profileData.categories.homeEnergy').optional().isFloat({ min: 0 }).toFloat(),
    body('profileData.categories.shopping').optional().isFloat({ min: 0 }).toFloat(),
    body('profileData.categories.waste').optional().isFloat({ min: 0 }).toFloat(),
    
    // Nested inputs under profileData
    body('profileData.inputs.commute.distance').optional().isFloat({ min: 0, max: 5000 }).toFloat(),
    body('profileData.inputs.commute.type').optional().isIn(['petrol', 'diesel', 'electric', 'public', 'active']),
    body('profileData.inputs.diet.type').optional().isIn(['heavy-meat', 'low-meat', 'vegetarian', 'vegan']),
    body('profileData.inputs.homeEnergy.electricityBill').optional().isIn(['low', 'medium', 'high']),
    body('profileData.inputs.homeEnergy.heatingSource').optional().isIn(['electricity', 'gas', 'solar']),
    body('profileData.inputs.shopping.frequency').optional().isIn(['frequent', 'moderate', 'minimalist']),
    body('profileData.inputs.waste.recycling').optional().isIn(['none', 'partial', 'full']),
    
    body('recommendations')
      .isArray()
      .withMessage('Recommendations list must be an array')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { profileData, recommendations, userQuestion } = req.body;
      const coachReply = await generateCoachResponse(profileData, recommendations, userQuestion);
      res.status(200).json({ reply: coachReply });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/impact
 * @desc Translate numeric CO2e savings into tangible, real-world comparison stories.
 * @access Public
 */
router.post('/impact',
  [
    body('kgSaved')
      .notEmpty()
      .withMessage('Carbon kilograms saved is required')
      .isFloat({ min: 0, max: 100000 })
      .withMessage('Carbon saved must be a non-negative number')
      .toFloat()
  ],
  handleValidationErrors,
  (req, res, next) => {
    try {
      const { kgSaved } = req.body;
      const results = translateImpact(kgSaved);
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /api/challenges
 * @desc Get list of weekly sustainable habit-building challenges.
 * @access Public
 */
router.get('/challenges', (req, res, next) => {
  try {
    const challenges = getWeeklyChallenges();
    res.status(200).json({ challenges });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
