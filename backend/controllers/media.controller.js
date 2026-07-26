/* ============================================
   controllers/media.controller.js
   Handles: Video, Voice, Music (all media)
============================================ */
'use strict';

const { VideoMemory, VoiceMessage, BackgroundMusic } = require('../models/models');
const { deleteFromCloudinary }                       = require('../config/cloudinary');
const { success, error }                             = require('../utils/apiResponse');

// ════════════════════════════════════════════
//  VIDEO MEMORY
// ════════════════════════════════════════════

exports.uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No video file provided.', 400);

    const video = await VideoMemory.create({
      videoUrl:  req.file.path,
      publicId:  req.file.filename,
      title:     req.body.title || 'Our Memory',
      thumbnail: req.file.path.replace('/upload/', '/upload/w_400,h_225,c_fill/'),
    });

    return success(res, { video }, 'Video uploaded successfully', 201);
  } catch (err) { next(err); }
};

exports.getVideos = async (req, res, next) => {
  try {
    const videos = await VideoMemory.find().sort({ createdAt: -1 });
    return success(res, { videos, count: videos.length });
  } catch (err) { next(err); }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await VideoMemory.findById(req.params.id);
    if (!video) return error(res, 'Video not found.', 404);
    await deleteFromCloudinary(video.publicId, 'video');
    await video.deleteOne();
    return success(res, {}, 'Video deleted');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════
//  VOICE MESSAGE
// ════════════════════════════════════════════

exports.uploadVoice = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No audio file provided.', 400);

    // Delete old voice messages before saving new (keep only one active)
    const old = await VoiceMessage.find();
    await Promise.all(old.map(v => deleteFromCloudinary(v.publicId, 'video')));
    await VoiceMessage.deleteMany();

    const voice = await VoiceMessage.create({
      audioUrl:  req.file.path,
      publicId:  req.file.filename,
      duration:  req.body.duration || 0,
    });

    return success(res, { voice }, 'Voice message uploaded', 201);
  } catch (err) { next(err); }
};

exports.getVoice = async (req, res, next) => {
  try {
    const voice = await VoiceMessage.findOne().sort({ createdAt: -1 });
    return success(res, { voice });
  } catch (err) { next(err); }
};

exports.deleteVoice = async (req, res, next) => {
  try {
    const voice = await VoiceMessage.findById(req.params.id);
    if (!voice) return error(res, 'Voice message not found.', 404);
    await deleteFromCloudinary(voice.publicId, 'video');
    await voice.deleteOne();
    return success(res, {}, 'Voice message deleted');
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════
//  BACKGROUND MUSIC
// ════════════════════════════════════════════

exports.uploadMusic = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No music file provided.', 400);

    // Replace existing music
    const old = await BackgroundMusic.find();
    await Promise.all(old.map(m => deleteFromCloudinary(m.publicId, 'video')));
    await BackgroundMusic.deleteMany();

    const music = await BackgroundMusic.create({
      musicUrl: req.file.path,
      publicId: req.file.filename,
      title:    req.body.title || 'Our Song',
    });

    return success(res, { music }, 'Background music uploaded', 201);
  } catch (err) { next(err); }
};

exports.getMusic = async (req, res, next) => {
  try {
    const music = await BackgroundMusic.findOne().sort({ createdAt: -1 });
    return success(res, { music });
  } catch (err) { next(err); }
};

exports.deleteMusic = async (req, res, next) => {
  try {
    const music = await BackgroundMusic.findById(req.params.id);
    if (!music) return error(res, 'Music not found.', 404);
    await deleteFromCloudinary(music.publicId, 'video');
    await music.deleteOne();
    return success(res, {}, 'Music deleted');
  } catch (err) { next(err); }
};
