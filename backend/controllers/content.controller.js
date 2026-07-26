/* ============================================
   controllers/content.controller.js
   Handles: Love Letter, Timeline, Settings, Partner
============================================ */
'use strict';

const {
  LoveLetter,
  Timeline,
  WebsiteSettings,
  Visitor,
}                                              = require('../models/models');
const Partner                                  = require('../models/Partner.model');
const { deleteFromCloudinary }                 = require('../config/cloudinary');
const { success, error, paginated }            = require('../utils/apiResponse');

// ════════════════════════════════════════════
//  LOVE LETTER
// ════════════════════════════════════════════

exports.getLetter = async (req, res, next) => {
  try {
    let letter = await LoveLetter.findOne().sort({ createdAt: -1 });
    return success(res, { letter });
  } catch (err) { next(err); }
};

exports.createLetter = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    // Keep only one love letter at a time
    await LoveLetter.deleteMany();
    const letter = await LoveLetter.create({ title, message });
    return success(res, { letter }, 'Love letter saved', 201);
  } catch (err) { next(err); }
};

exports.updateLetter = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    const letter = await LoveLetter.findByIdAndUpdate(
      req.params.id,
      { title, message },
      { new: true, runValidators: true }
    );
    if (!letter) return error(res, 'Love letter not found.', 404);
    return success(res, { letter }, 'Love letter updated');
  } catch (err) { next(err); }
};

exports.deleteLetter = async (req, res, next) => {
  try {
    const letter = await LoveLetter.findByIdAndDelete(req.params.id);
    if (!letter) return error(res, 'Love letter not found.', 404);
    return success(res, {}, 'Love letter deleted');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════
//  TIMELINE
// ════════════════════════════════════════════

exports.getTimeline = async (req, res, next) => {
  try {
    const events = await Timeline.find().sort({ order: 1, createdAt: 1 });
    return success(res, { events, count: events.length });
  } catch (err) { next(err); }
};

exports.createTimelineEvent = async (req, res, next) => {
  try {
    const { emoji, title, description, date, order } = req.body;
    const eventData = { emoji, title, description, date, order };

    if (req.file) {
      eventData.imageUrl = req.file.path;
      eventData.publicId = req.file.filename;
    }

    const event = await Timeline.create(eventData);
    return success(res, { event }, 'Timeline event created', 201);
  } catch (err) { next(err); }
};

exports.updateTimelineEvent = async (req, res, next) => {
  try {
    const { emoji, title, description, date, order } = req.body;
    const updateData = { emoji, title, description, date, order };

    if (req.file) {
      // Delete old image from Cloudinary
      const old = await Timeline.findById(req.params.id);
      if (old?.publicId) await deleteFromCloudinary(old.publicId, 'image');
      updateData.imageUrl = req.file.path;
      updateData.publicId = req.file.filename;
    }

    const event = await Timeline.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!event) return error(res, 'Timeline event not found.', 404);
    return success(res, { event }, 'Timeline event updated');
  } catch (err) { next(err); }
};

exports.deleteTimelineEvent = async (req, res, next) => {
  try {
    const event = await Timeline.findById(req.params.id);
    if (!event) return error(res, 'Timeline event not found.', 404);
    if (event.publicId) await deleteFromCloudinary(event.publicId, 'image');
    await event.deleteOne();
    return success(res, {}, 'Timeline event deleted');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════
//  WEBSITE SETTINGS
// ════════════════════════════════════════════

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) settings = await WebsiteSettings.create({});
    return success(res, { settings });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const allowed = [
      'theme', 'primaryColor', 'secondaryColor',
      'countdownEnabled', 'birthdayDate', 'birthdayTime',
      'musicEnabled', 'animationsEnabled', 'petalsEnabled',
      'fireworksEnabled', 'hername', 'loveStartDate',
    ];

    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    let settings = await WebsiteSettings.findOneAndUpdate(
      {},
      updates,
      { new: true, upsert: true, runValidators: true }
    );

    return success(res, { settings }, 'Settings updated');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════
//  PARTNER
// ════════════════════════════════════════════

exports.getPartner = async (req, res, next) => {
  try {
    let partner = await Partner.findOne();
    return success(res, { partner });
  } catch (err) { next(err); }
};

exports.upsertPartner = async (req, res, next) => {
  try {
    const { name, birthday, favouriteColor, bio } = req.body;
    const updateData = { name, birthday, favouriteColor, bio };

    if (req.file) {
      // Delete old profile photo
      const old = await Partner.findOne();
      if (old?.profilePhotoId) await deleteFromCloudinary(old.profilePhotoId, 'image');
      updateData.profilePhoto   = req.file.path;
      updateData.profilePhotoId = req.file.filename;
    }

    const partner = await Partner.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    return success(res, { partner }, 'Partner profile saved');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════
//  VISITOR TRACKING
// ════════════════════════════════════════════

exports.trackVisitor = async (req, res, next) => {
  try {
    const {
      country, city, device, browser, os,
      screenWidth, screenHeight, referrer, sessionId,
    } = req.body;

    const ip = (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      'unknown'
    ).trim();

    // Check if this is a return visitor (same IP, visited before)
    const existingVisit = await Visitor.findOne({ ip });
    const isReturn = !!existingVisit;

    const visitor = await Visitor.create({
      ip, country, city, device, browser, os,
      screenWidth, screenHeight, referrer, sessionId, isReturn,
    });

    return success(res, { visitor }, 'Visit recorded', 201);
  } catch (err) { next(err); }
};

exports.getVisitors = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip  = (page - 1) * limit;

    const [visitors, total] = await Promise.all([
      Visitor.find().sort({ visitedAt: -1 }).skip(skip).limit(limit),
      Visitor.countDocuments(),
    ]);

    return paginated(res, visitors, total, page, limit, 'Visitors fetched');
  } catch (err) { next(err); }
};
