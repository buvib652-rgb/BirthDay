/* ============================================
   services/scheduler.js – node-cron Jobs
============================================ */
'use strict';

const cron   = require('node-cron');
const logger = require('../utils/logger');
const path   = require('path');
const fs     = require('fs');

/**
 * Start all scheduled background tasks.
 * Called once at server startup.
 */
function startScheduler() {
  logger.info('📅 Starting cron scheduler...');

  // ── JOB 1: Daily cleanup of temp uploads folder ───────────────────────────
  // Runs every day at 03:00 AM
  cron.schedule('0 3 * * *', async () => {
    logger.info('[CRON] Running daily uploads cleanup...');
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) return;

      const files = fs.readdirSync(uploadsDir);
      const now   = Date.now();
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stat = fs.statSync(filePath);
        // Delete files older than 24 hours
        if (now - stat.mtimeMs > 24 * 60 * 60 * 1000) {
          fs.unlinkSync(filePath);
          deleted++;
        }
      }

      logger.info(`[CRON] Cleanup done: ${deleted} file(s) removed from uploads/`);
    } catch (err) {
      logger.error('[CRON] Cleanup error:', err.message);
    }
  }, { timezone: 'UTC' });

  // ── JOB 2: Log rotation — archive old logs ─────────────────────────────────
  // Runs every Sunday at 02:00 AM
  cron.schedule('0 2 * * 0', () => {
    logger.info('[CRON] Weekly log rotation check...');
    try {
      const logsDir = path.join(__dirname, '..', 'logs');
      if (!fs.existsSync(logsDir)) return;

      const files = fs.readdirSync(logsDir);
      const now   = Date.now();
      const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

      for (const file of files) {
        if (!file.endsWith('.log')) continue;
        const filePath = path.join(logsDir, file);
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > MAX_AGE) {
          fs.unlinkSync(filePath);
          logger.info(`[CRON] Deleted old log: ${file}`);
        }
      }
    } catch (err) {
      logger.error('[CRON] Log rotation error:', err.message);
    }
  }, { timezone: 'UTC' });

  // ── JOB 3: Database health check ──────────────────────────────────────────
  // Runs every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    try {
      const mongoose = require('mongoose');
      const state = mongoose.connection.readyState;
      const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
      logger.info(`[CRON] DB health check: ${states[state] || 'unknown'}`);

      if (state !== 1) {
        logger.warn('[CRON] Database not connected — attempting reconnect...');
        await require('../config/db').connectDB();
      }
    } catch (err) {
      logger.error('[CRON] DB health check error:', err.message);
    }
  }, { timezone: 'UTC' });

  // ── JOB 4: Daily visitor stats summary (logged to file) ───────────────────
  // Runs every day at midnight UTC
  cron.schedule('0 0 * * *', async () => {
    try {
      const { Visitor } = require('../models/models');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date(yesterday);
      today.setDate(today.getDate() + 1);

      const count = await Visitor.countDocuments({
        visitedAt: { $gte: yesterday, $lt: today },
      });

      logger.info(`[CRON] Yesterday's visitors: ${count}`);
    } catch (err) {
      logger.error('[CRON] Visitor summary error:', err.message);
    }
  }, { timezone: 'UTC' });

  // ── JOB 5: Birthday reminder (email) ──────────────────────────────────────
  // Runs every day at 08:00 AM — sends a reminder 1 day before birthday
  cron.schedule('0 8 * * *', async () => {
    try {
      const { WebsiteSettings } = require('../models/models');
      const settings = await WebsiteSettings.findOne();
      if (!settings?.birthdayDate) return;

      const birthday = new Date(settings.birthdayDate);
      const now      = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (
        birthday.getMonth() === tomorrow.getMonth() &&
        birthday.getDate()  === tomorrow.getDate()
      ) {
        const { sendEmail } = require('./email.service');
        await sendEmail({
          to:      process.env.SMTP_USER,
          subject: `🎂 Tomorrow is ${settings.hername || "the"} Birthday!`,
          html: `
            <div style="background:#0a0a0f;color:#fff;padding:30px;font-family:Georgia,serif;">
              <h1 style="color:#ffd700;">🎂 Birthday Reminder!</h1>
              <p>Tomorrow is <strong>${settings.hername || "her"}</strong>'s birthday!</p>
              <p>Make sure the surprise website is ready and the voice message is uploaded.</p>
              <p style="color:#c41e5a;">❤️ Don't forget to make it magical!</p>
            </div>
          `,
        });
        logger.info('[CRON] Birthday reminder email sent');
      }
    } catch (err) {
      logger.error('[CRON] Birthday reminder error:', err.message);
    }
  }, { timezone: 'UTC' });

  logger.info('✅ All cron jobs scheduled');
}

module.exports = { startScheduler };
