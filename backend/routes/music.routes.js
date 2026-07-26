/* routes/music.routes.js */
'use strict';
const express  = require('express');
const router   = express.Router();
const mediaCtrl              = require('../controllers/media.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadMusic }        = require('../config/cloudinary');

const handleMusicUpload = (req, res, next) => {
  uploadMusic(req, res, (err) => { if (err) return next(err); next(); });
};

router.get('/',    mediaCtrl.getMusic);
router.post('/',   protect, adminOnly, handleMusicUpload, mediaCtrl.uploadMusic);
router.delete('/:id', protect, adminOnly, mediaCtrl.deleteMusic);

module.exports = router;
