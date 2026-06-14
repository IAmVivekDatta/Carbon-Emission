const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { calculateFootprint } = require('../services/calculator');
const { getRecommendations } = require('../services/recommender');
const { generateCoachResponse } = require('../services/gemini');
const { translateImpact } = require('../services/impact');
const { getWeeklyChallenges } = require('../services/challenges');

// Middleware to handle and return validation errors
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

/**
 * Route: POST /api/calculate
 * Security: Strict type checking, value boundaries, and sanitization
 */
router.post('/calculate',
  [
    body('commute.distance')
      .optional()
      .isFloat({ min: 0, max: 5000 })
      .withMessage('Commute distance must be a non-negative number')
      .toFloat(),
    body('commute.type')
      .optional()
      .isIn(['petrol', 'diesel', 'electric', 'public', 'active'])
      .withMessage('Invalid commute type'),
    body('diet.type')
      .optional()
      .isIn(['heavy-meat', 'low-meat', 'vegetarian', 'vegan'])
      .withMessage('Invalid diet type option'),
    body('homeEnergy.electricityBill')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid electricity bill level'),
    body('homeEnergy.heatingSource')
      .optional()
      .isIn(['electricity', 'gas', 'solar'])
      .withMessage('Invalid heating source option'),
    body('shopping.frequency')
      .optional()
      .isIn(['frequent', 'moderate', 'minimalist'])
      .withMessage('Invalid shopping frequency option'),
    body('waste.recycling')
      .optional()
      .isIn(['none', 'partial', 'full'])
      .withMessage('Invalid recycling level option')
  ],
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
 * Route: POST /api/recommendations
 * Security: Structure validation
 */
router.post('/recommendations',
  [
    body('categories').isObject().withMessage('Categories breakdown must be a structured object'),
    body('inputs').isObject().withMessage('Original quiz inputs must be a structured object')
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
 * Route: POST /api/chat (AI Carbon Coach)
 * Security: Strict input size limit, escaping HTML characters, and structure checks
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
      .escape(), // Escape HTML brackets to avoid injection/XSS
    body('profileData')
      .notEmpty()
      .withMessage('Carbon profile data is required')
      .isObject()
      .withMessage('Carbon profile must be an object'),
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
 * Route: POST /api/impact
 * Security: Convert raw number safely
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
 * Route: GET /api/challenges
 * Security: None required (static GET)
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
