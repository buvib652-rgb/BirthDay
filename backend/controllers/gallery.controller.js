/* ============================================
   controllers/gallery.controller.js
============================================ */
'use strict';

const { Gallery }                         = require('../models/models');
const { deleteFromCloudinary, extractPublicId } = require('../config/cloudinary');
const { success, error, paginated }       = require('../utils/apiResponse');

// ── POST /api/gallery (upload one or many) ──────────────────────────────────
exports.uploadPhotos = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return error(res, 'No images provided.', 400);
    }

    const captions = Array.isArray(req.body.caption)
      ? req.body.caption
      : [req.body.caption || ''];

    const galleryItems = files.map((file, i) => ({
      imageUrl: file.path,
      publicId: file.filename,
      caption:  captions[i] || captions[0] || '',
    }));

    const saved = await Gallery.insertMany(galleryItems);
    return success(res, { photos: saved }, `${saved.length} photo(s) uploaded successfully`, 201);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/gallery ────────────────────────────────────────────────────────
exports.getAllPhotos = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      Gallery.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Gallery.countDocuments(),
    ]);

    return paginated(res, photos, total, page, limit, 'Gallery fetched');
  } catch (err) {
    next(err);
  }
};

// ── GET /api/gallery/:id ────────────────────────────────────────────────────
exports.getPhoto = async (req, res, next) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return error(res, 'Photo not found.', 404);
    return success(res, { photo });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/gallery/:id ──────────────────────────────────────────────────
exports.updateCaption = async (req, res, next) => {
  try {
    const { caption, order } = req.body;
    const photo = await Gallery.findByIdAndUpdate(
      req.params.id,
      { ...(caption !== undefined && { caption }), ...(order !== undefined && { order }) },
      { new: true, runValidators: true }
    );
    if (!photo) return error(res, 'Photo not found.', 404);
    return success(res, { photo }, 'Photo updated');
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/gallery/:id ─────────────────────────────────────────────────
exports.deletePhoto = async (req, res, next) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return error(res, 'Photo not found.', 404);

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.publicId, 'image');

    await photo.deleteOne();
    return success(res, {}, 'Photo deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/gallery (bulk delete) ──────────────────────────────────────
exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return error(res, 'Provide an array of photo IDs.', 400);
    }

    const photos = await Gallery.find({ _id: { $in: ids } });
    // Delete from Cloudinary in parallel
    await Promise.all(photos.map(p => deleteFromCloudinary(p.publicId, 'image')));
    await Gallery.deleteMany({ _id: { $in: ids } });

    return success(res, {}, `${photos.length} photo(s) deleted`);
  } catch (err) {
    next(err);
  }
};
