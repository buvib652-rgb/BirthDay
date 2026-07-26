/* ============================================
   routes/video.routes.js
============================================ */
'use strict';
const express  = require('express');
const router   = express.Router();
const mediaCtrl              = require('../controllers/media.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadVideo }        = require('../config/cloudinary');

const handleVideoUpload = (req, res, next) => {
  uploadVideo(req, res, (err) => { if (err) return next(err); next(); });
};

router.get('/',    mediaCtrl.getVideos);
router.post('/',   protect, adminOnly, handleVideoUpload, mediaCtrl.uploadVideo);
router.delete('/:id', protect, adminOnly, mediaCtrl.deleteVideo);

module.exports = router;
