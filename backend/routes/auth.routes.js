/* ============================================
   routes/auth.routes.js
============================================ */
'use strict';

const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const authCtrl          = require('../controllers/auth.controller');
const { protect }       = require('../middleware/auth.middleware');
const { validate }      = require('../middleware/validate.middleware');

// Validation chains
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ── ROUTES ──────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', registerValidation, validate, authCtrl.register);

// POST /api/auth/login
router.post('/login', loginValidation, validate, authCtrl.login);

// POST /api/auth/logout
router.post('/logout', protect, authCtrl.logout);

// GET /api/auth/profile
router.get('/profile', protect, authCtrl.getProfile);

// PUT /api/auth/profile
router.put('/profile', protect,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  validate,
  authCtrl.updateProfile
);

// PUT /api/auth/change-password
router.put('/change-password', protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be 8+ characters'),
  ],
  validate,
  authCtrl.changePassword
);

module.exports = router;
