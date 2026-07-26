/* ============================================
   models/Partner.model.js (standalone export)
============================================ */
'use strict';
const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true, maxlength: 60 },
    birthday:       { type: Date },
    profilePhoto:   { type: String, default: '' },
    profilePhotoId: { type: String, default: '' },
    favouriteColor: { type: String, default: '#c41e5a' },
    bio:            { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', partnerSchema);
