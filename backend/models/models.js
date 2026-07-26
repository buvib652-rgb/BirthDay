/* ============================================
   models/models.js – All non-User, non-Partner models
============================================ */
'use strict';
const mongoose = require('mongoose');

/* ============================================
   models/Gallery.model.js
============================================ */
const gallerySchema = new mongoose.Schema(
  {
    imageUrl:  { type: String, required: true },   // Cloudinary URL
    publicId:  { type: String, required: true },   // Cloudinary public_id
    caption:   { type: String, default: '', maxlength: 200 },
    order:     { type: Number, default: 0 },
    uploadedAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

/* ============================================
   models/Timeline.model.js
============================================ */
const timelineSchema = new mongoose.Schema(
  {
    emoji:       { type: String, default: '❤️' },
    title:       { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    date:        { type: String, default: '' }, // Display date string
    imageUrl:    { type: String, default: '' },
    publicId:    { type: String, default: '' },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

timelineSchema.index({ order: 1 });
const Timeline = mongoose.model('Timeline', timelineSchema);

/* ============================================
   models/LoveLetter.model.js
============================================ */
const loveLetterSchema = new mongoose.Schema(
  {
    title:   { type: String, default: 'A Letter From My Heart', maxlength: 100 },
    message: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true }
);

const LoveLetter = mongoose.model('LoveLetter', loveLetterSchema);

/* ============================================
   models/VoiceMessage.model.js
============================================ */
const voiceMessageSchema = new mongoose.Schema(
  {
    audioUrl:   { type: String, required: true },
    publicId:   { type: String, required: true },
    duration:   { type: Number, default: 0 }, // seconds
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VoiceMessage = mongoose.model('VoiceMessage', voiceMessageSchema);

/* ============================================
   models/BackgroundMusic.model.js
============================================ */
const backgroundMusicSchema = new mongoose.Schema(
  {
    musicUrl:   { type: String, required: true },
    publicId:   { type: String, required: true },
    title:      { type: String, default: 'Our Song' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BackgroundMusic = mongoose.model('BackgroundMusic', backgroundMusicSchema);

/* ============================================
   models/VideoMemory.model.js
============================================ */
const videoMemorySchema = new mongoose.Schema(
  {
    videoUrl:  { type: String, required: true },
    publicId:  { type: String, required: true },
    title:     { type: String, default: 'Our Memory', maxlength: 100 },
    thumbnail: { type: String, default: '' },
    uploadedAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VideoMemory = mongoose.model('VideoMemory', videoMemorySchema);

/* ============================================
   models/WebsiteSettings.model.js
============================================ */
const websiteSettingsSchema = new mongoose.Schema(
  {
    theme:             { type: String, default: 'dark' },
    primaryColor:      { type: String, default: '#c41e5a' },
    secondaryColor:    { type: String, default: '#ffd700' },
    countdownEnabled:  { type: Boolean, default: true },
    birthdayDate:      { type: String, default: '' },  // 'YYYY-MM-DD'
    birthdayTime:      { type: String, default: '00:00' },
    musicEnabled:      { type: Boolean, default: true },
    animationsEnabled: { type: Boolean, default: true },
    petalsEnabled:     { type: Boolean, default: true },
    fireworksEnabled:  { type: Boolean, default: true },
    hername:           { type: String, default: 'My Love' },
    loveStartDate:     { type: String, default: '' },
  },
  { timestamps: true }
);

const WebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);

/* ============================================
   models/Visitor.model.js
============================================ */
const visitorSchema = new mongoose.Schema(
  {
    ip:           { type: String, default: 'unknown' },
    country:      { type: String, default: 'unknown' },
    city:         { type: String, default: 'unknown' },
    device:       { type: String, default: 'unknown' }, // desktop | mobile | tablet
    browser:      { type: String, default: 'unknown' },
    os:           { type: String, default: 'unknown' },
    screenWidth:  { type: Number, default: 0 },
    screenHeight: { type: Number, default: 0 },
    referrer:     { type: String, default: '' },
    isReturn:     { type: Boolean, default: false },
    sessionId:    { type: String, default: '' },
    visitedAt:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

visitorSchema.index({ ip: 1, visitedAt: -1 });
visitorSchema.index({ visitedAt: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

// ── EXPORT ALL ────────────────────────────────────────────────────────────
module.exports = {
  Gallery,
  Timeline,
  LoveLetter,
  VoiceMessage,
  BackgroundMusic,
  VideoMemory,
  WebsiteSettings,
  Visitor,
};
