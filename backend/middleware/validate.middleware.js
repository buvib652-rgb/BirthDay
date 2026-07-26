/* ============================================
   middleware/validate.middleware.js – express-validator helper
============================================ */
'use strict';

const { validationResult } = require('express-validator');

/**
 * Run after express-validator chains.
 * Returns 422 if there are validation errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validate };
