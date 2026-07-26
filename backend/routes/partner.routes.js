/* routes/partner.routes.js */
'use strict';
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const contentCtrl             = require('../controllers/content.controller');
const { protect, adminOnly }  = require('../middleware/auth.middleware');
const { validate }            = require('../middleware/validate.middleware');
const { uploadProfilePhoto }  = require('../config/cloudinary');

const handleProfileUpload = (req, res, next) => {
  uploadProfilePhoto(req, res, (err) => { if (err) return next(err); next(); });
};

// Public: frontend reads partner info
router.get('/', contentCtrl.getPartner);

// Admin: create/update partner
router.put('/', protect, adminOnly, handleProfileUpload,
  [
    body('name').optional().trim().isLength({ max: 60 }),
    body('bio').optional().isLength({ max: 500 }),
  ],
  validate,
  contentCtrl.upsertPartner
);

module.exports = router;
