/* ============================================
   routes/dashboard.routes.js
============================================ */
'use strict';
const express = require('express');
const router  = express.Router();
const { getDashboard }   = require('../controllers/dashboard.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', protect, adminOnly, getDashboard);
module.exports = router;
