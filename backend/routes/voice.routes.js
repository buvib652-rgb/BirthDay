/* ============================================
   routes/voice.routes.js
============================================ */
'use strict';
const express  = require('express');
const router   = express.Router();
const mediaCtrl              = require('../controllers/media.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadVoice }        = require('../config/cloudinary');

const handleVoiceUpload = (req, res, next) => {
  uploadVoice(req, res, (err) => { if (err) return next(err); next(); });
};

// Public: frontend fetches voice URL to play at midnight
router.get('/',    mediaCtrl.getVoice);

// Protected admin routes
router.post('/',   protect, adminOnly, handleVoiceUpload, mediaCtrl.uploadVoice);
router.delete('/:id', protect, adminOnly, mediaCtrl.deleteVoice);

module.exports = router;
