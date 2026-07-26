/* ============================================
   server.js – Entry Point
============================================ */

'use strict';

const app     = require('./app');
const logger  = require('./utils/logger');
const { connectDB } = require('./config/db');
const { startScheduler } = require('./services/scheduler');

const PORT = process.env.PORT || 5000;

// ── BOOT ────────────────────────────────────────────────────────────────────
async function boot() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // Auto-seed default admin user if none exists
    const User = require('./models/User.model');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@birthday.com',
        password: process.env.ADMIN_PASSWORD || 'Change_This_Password_123',
        role: 'admin'
      });
      logger.info('👤 Default admin user seeded successfully.');
    }

    // 2. Start cron scheduler
    startScheduler();

    // 3. Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      logger.info(`📡 API base: http://localhost:${PORT}/api`);
    });

    // ── GRACEFUL SHUTDOWN ──────────────────────────────────────────────────
    const shutdown = (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
      // Force close after 10 s
      setTimeout(() => process.exit(1), 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    // Unhandled rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

boot();
