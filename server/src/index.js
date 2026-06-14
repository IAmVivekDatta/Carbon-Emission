const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Validate Environment Variables immediately on startup
const { validateEnv } = require('./config/env');
validateEnv();

const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// Configure Content Security Policy to secure endpoints without breaking fonts, local scripts, and styles
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS Configuration - Restrict to local development and same-origin requests in production
const allowedOrigins = [
  'http://localhost:5173', // Vite local development
  'http://localhost:5000', // Express local server
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  const origin = req.header('Origin');
  const host = req.header('Host');

  const isSameOrigin = origin && (origin.replace(/^https?:\/\//, '') === host);
  const isAllowedLocal = origin && allowedOrigins.includes(origin);

  if (!origin || isSameOrigin || isAllowedLocal) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

// Request Parsers
app.use(express.json());
// Catch malformed JSON syntax errors before they hit routes
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
  next();
});
app.use(express.urlencoded({ extended: true }));

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Register API Routes with Rate Limiting
app.use('/api', apiLimiter, apiRoutes);

// Health Check Endpoint (not rate-limited)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Serve Frontend Static Files in Production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(distPath));
  
  // React SPA routing fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Start listening if not imported as a module (e.g. for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Verdant Pulse backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
