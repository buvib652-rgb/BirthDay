/* ============================================
   services/email.service.js – Nodemailer
============================================ */
'use strict';

const nodemailer = require('nodemailer');
const logger     = require('../utils/logger');

// ── CREATE TRANSPORTER ────────────────────────────────────────────────────
let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // For some hosting environments
    },
  });

  return transporter;
}

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.to      – Recipient email
 * @param {string} options.subject – Subject line
 * @param {string} [options.html]  – HTML body
 * @param {string} [options.text]  – Plain text body (fallback)
 * @param {string} [options.from]  – From address (defaults to env)
 */
async function sendEmail({ to, subject, html, text, from }) {
  const transport = getTransporter();

  const mailOptions = {
    from:    from || process.env.EMAIL_FROM || `"Birthday Surprise ❤️" <${process.env.SMTP_USER}>`,
    to,
    subject,
    ...(html && { html }),
    ...(text && { text }),
  };

  try {
    const info = await transport.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId} → ${to}`);
    return info;
  } catch (err) {
    logger.error(`Email send failed → ${to}:`, err.message);
    throw new Error(`Failed to send email: ${err.message}`);
  }
}

/**
 * Verify SMTP connection (useful for health checks).
 */
async function verifyConnection() {
  try {
    await getTransporter().verify();
    logger.info('✅ SMTP connection verified');
    return true;
  } catch (err) {
    logger.error('SMTP connection failed:', err.message);
    return false;
  }
}

module.exports = { sendEmail, verifyConnection };
