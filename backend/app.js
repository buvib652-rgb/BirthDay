/* ============================================
   app.js – Express Application Setup
============================================ */

'use strict';

require('dotenv').config();

const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const morgan        = require('morgan');
const compression   = require('compression');
const rateLimit     = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path          = require('path');
const fs            = require('fs');

const logger            = require('./utils/logger');
const errorHandler      = require('./middleware/errorHandler');
const notFoundHandler   = require('./middleware/notFoundHandler');

// ── ROUTE IMPORTS ────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const dashboardRoutes   = require('./routes/dashboard.routes');
const galleryRoutes     = require('./routes/gallery.routes');
const videoRoutes       = require('./routes/video.routes');
const voiceRoutes       = require('./routes/voice.routes');
const musicRoutes       = require('./routes/music.routes');
const letterRoutes      = require('./routes/letter.routes');
const timelineRoutes    = require('./routes/timeline.routes');
const settingsRoutes    = require('./routes/settings.routes');
const visitorRoutes     = require('./routes/visitor.routes');
const emailRoutes       = require('./routes/email.routes');
const partnerRoutes     = require('./routes/partner.routes');

const app = express();

// ── TRUST PROXY (for Render / behind load balancer) ─────────────────────────
app.set('trust proxy', 1);

// ── SECURITY HEADERS ─────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Customize if needed
  })
);

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── COMPRESSION ───────────────────────────────────────────────────────────────
app.use(compression());

// ── REQUEST LOGGING ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  // Write access logs to file
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
  );

  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan('dev')); // Console output
}

// ── BODY PARSING ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── MONGO INJECTION SANITIZE ─────────────────────────────────────────────────
app.use(mongoSanitize());

// ── RATE LIMITER ──────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in dev
});

app.use('/api', globalLimiter);

// Stricter limiter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
});

// ── STATIC FILES ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
const healthHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    version: require('./package.json').version,
  });
};

app.get('/', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// ── API ROUTES ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authLimiter, authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gallery',   galleryRoutes);
app.use('/api/videos',    videoRoutes);
app.use('/api/voice',     voiceRoutes);
app.use('/api/music',     musicRoutes);
app.use('/api/letter',    letterRoutes);
app.use('/api/timeline',  timelineRoutes);
app.use('/api/settings',  settingsRoutes);
app.use('/api/visitors',  visitorRoutes);
app.use('/api/email',     emailRoutes);
app.use('/api/partner',   partnerRoutes);

// ── 404 HANDLER ───────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
