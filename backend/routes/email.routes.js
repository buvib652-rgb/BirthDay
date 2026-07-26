/* routes/email.routes.js */
'use strict';
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const emailCtrl              = require('../controllers/email.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate }           = require('../middleware/validate.middleware');
const rateLimit              = require('express-rate-limit');

// Strict rate limit for email sending
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      5,
  message: { success: false, message: 'Too many emails sent. Try again in an hour.' },
});

const messageValidation = [
  body('to').optional().isEmail().withMessage('Valid recipient email required').normalizeEmail(),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  body('subject').optional().isLength({ max: 200 }),
  body('fromName').optional().isLength({ max: 60 }),
];

// POST /api/email/send-message (Public for reply message, rate-limited and securely locked to admin email)
router.post('/send-message', emailLimiter, messageValidation, validate, emailCtrl.sendMessage);

// POST /api/email/test
router.post('/test', protect, adminOnly, emailCtrl.testEmail);

module.exports = router;
