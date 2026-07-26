/* routes/timeline.routes.js */
'use strict';
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const contentCtrl              = require('../controllers/content.controller');
const { protect, adminOnly }   = require('../middleware/auth.middleware');
const { validate }             = require('../middleware/validate.middleware');
const { uploadTimelineImage }  = require('../config/cloudinary');

const handleTimelineImage = (req, res, next) => {
  uploadTimelineImage(req, res, (err) => { if (err) return next(err); next(); });
};

const eventValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
];

router.get('/', contentCtrl.getTimeline);

router.post('/',    protect, adminOnly, handleTimelineImage, eventValidation, validate, contentCtrl.createTimelineEvent);
router.put('/:id',  protect, adminOnly, handleTimelineImage, eventValidation, validate, contentCtrl.updateTimelineEvent);
router.delete('/:id', protect, adminOnly, contentCtrl.deleteTimelineEvent);

module.exports = router;
