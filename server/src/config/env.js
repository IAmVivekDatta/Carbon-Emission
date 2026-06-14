/**
 * Startup environment variable validation logic.
 * Ensures critical environment parameters are correctly formatted and warns about missing optional APIs.
 * 
 * @module config/env
 */

/**
 * Validates critical environment variables.
 * Exits the process if required configurations (like PORT or NODE_ENV) are invalid.
 * Logs a warning if optional APIs (like GEMINI_API_KEY) are missing.
 * 
 * @returns {void}
 */
function validateEnv() {
  const errors = [];

  // 1. Validate NODE_ENV
  if (process.env.NODE_ENV) {
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(process.env.NODE_ENV)) {
      errors.push(`NODE_ENV must be one of: ${validEnvs.join(', ')}. Got: '${process.env.NODE_ENV}'`);
    }
  }

  // 2. Validate PORT
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      errors.push(`PORT must be a valid number between 1 and 65535. Got: '${process.env.PORT}'`);
    }
  }

  // 3. Check optional GEMINI_API_KEY
  if (!process.env.GEMINI_API_KEY) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: GEMINI_API_KEY environment variable is not set. The AI Carbon Coach will run in offline rule-based fallback mode.');
  }

  if (errors.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Startup Configuration Validation Failed:');
    errors.forEach(err => console.error('\x1b[31m%s\x1b[0m', `- ${err}`));
    process.exit(1);
  }
}

module.exports = {
  validateEnv
};
