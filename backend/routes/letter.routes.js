/* routes/letter.routes.js */
'use strict';
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const contentCtrl            = require('../controllers/content.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate }           = require('../middleware/validate.middleware');

const letterValidation = [
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  body('title').optional().isLength({ max: 100 }),
];

router.get('/',       contentCtrl.getLetter);
router.post('/',    protect, adminOnly, letterValidation, validate, contentCtrl.createLetter);
router.put('/:id',  protect, adminOnly, letterValidation, validate, contentCtrl.updateLetter);
router.delete('/:id', protect, adminOnly, contentCtrl.deleteLetter);

module.exports = router;
