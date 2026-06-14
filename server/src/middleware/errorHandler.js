/**
 * Centralized Express Error Handling Middleware.
 * Standardizes API error formats, handles operational/unhandled exceptions, and prevents sensitive leakage.
 * 
 * @module middleware/errorHandler
 */

/**
 * Standardized error handling middleware function for Express.
 * Logs error details and returns structured JSON response.
 * 
 * @param {Error} err - The error object
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @param {import('express').NextFunction} next - The next middleware function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Log error stacks for debugging
  console.error(`[Express Error] Status: ${status} | Message: ${err.message}`);
  if (err.stack && !isProd) {
    console.error(err.stack);
  }

  // Construct standardized error response
  res.status(status).json({
    error: {
      message: isProd && status === 500 
        ? 'An unexpected error occurred. Please try again later.' 
        : err.message || 'Internal Server Error',
      status,
      // Hide stack trace in production for safety
      ...(isProd ? {} : { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
