/* routes/visitor.routes.js */
'use strict';
const express = require('express');
const router  = express.Router();
const contentCtrl            = require('../controllers/content.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public: frontend posts visit data
router.post('/', contentCtrl.trackVisitor);

// Admin: view visitor analytics
router.get('/', protect, adminOnly, contentCtrl.getVisitors);

module.exports = router;
