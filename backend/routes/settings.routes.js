/* routes/settings.routes.js */
'use strict';
const express = require('express');
const router  = express.Router();
const contentCtrl            = require('../controllers/content.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public: frontend reads settings (theme, colors, countdown, etc.)
router.get('/', contentCtrl.getSettings);

// Admin: update settings
router.put('/', protect, adminOnly, contentCtrl.updateSettings);

module.exports = router;
