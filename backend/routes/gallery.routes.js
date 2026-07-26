/* ============================================
   routes/gallery.routes.js
============================================ */
'use strict';

const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const galleryCtrl            = require('../controllers/gallery.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate }           = require('../middleware/validate.middleware');
const { uploadGallery }      = require('../config/cloudinary');

// Wrap multer in middleware to catch errors
const handleUpload = (req, res, next) => {
  uploadGallery(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

// Public: get all gallery photos (frontend display)
router.get('/', galleryCtrl.getAllPhotos);
router.get('/:id', galleryCtrl.getPhoto);

// Protected: admin operations
router.post('/',    protect, adminOnly, handleUpload, galleryCtrl.uploadPhotos);
router.patch('/:id', protect, adminOnly,
  [body('caption').optional().trim().isLength({ max: 200 })],
  validate,
  galleryCtrl.updateCaption
);
router.delete('/bulk', protect, adminOnly, galleryCtrl.bulkDelete);
router.delete('/:id',  protect, adminOnly, galleryCtrl.deletePhoto);

module.exports = router;
