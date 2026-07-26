/* ============================================
   config/cloudinary.js – Cloudinary Setup
============================================ */

'use strict';

const cloudinary        = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer            = require('multer');

// ── CONFIGURE CLOUDINARY ───────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// ── HELPER: Create typed Cloudinary storage ────────────────────────────────

/**
 * Create a multer-cloudinary storage for a given folder + resource type.
 * @param {string} folder   – Cloudinary folder name (e.g. 'gallery', 'voice')
 * @param {string} resourceType – 'image' | 'video' | 'raw' | 'auto'
 * @param {string[]} allowedFormats – e.g. ['jpg', 'png', 'webp']
 */
function createCloudinaryStorage(folder, resourceType = 'auto', allowedFormats = []) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder:        `birthday_surprise/${folder}`,
      resource_type: resourceType,
      allowed_formats: allowedFormats.length ? allowedFormats : undefined,
      // Add a timestamp to keep filenames unique
      public_id: (req, file) => {
        const timestamp = Date.now();
        const name = file.originalname.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
        return `${name}_${timestamp}`;
      },
    },
  });
}

// ── PRE-BUILT UPLOADERS ────────────────────────────────────────────────────

/** Gallery image uploader – max 10 MB per image, up to 10 at once */
const uploadGallery = multer({
  storage:  createCloudinaryStorage('gallery', 'image', ['jpg', 'jpeg', 'png', 'webp', 'gif']),
  limits:   { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: imageFileFilter,
}).array('images', 10);

/** Single gallery image */
const uploadGallerySingle = multer({
  storage:  createCloudinaryStorage('gallery', 'image', ['jpg', 'jpeg', 'png', 'webp']),
  limits:   { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter,
}).single('image');

/** Video uploader – max 200 MB */
const uploadVideo = multer({
  storage:  createCloudinaryStorage('videos', 'video', ['mp4', 'mov', 'avi', 'webm']),
  limits:   { fileSize: 200 * 1024 * 1024 },
  fileFilter: videoFileFilter,
}).single('video');

/** Voice message uploader – max 20 MB */
const uploadVoice = multer({
  storage:  createCloudinaryStorage('voice', 'video', ['mp3', 'wav', 'ogg', 'm4a', 'webm']),
  limits:   { fileSize: 20 * 1024 * 1024 },
  fileFilter: audioFileFilter,
}).single('audio');

/** Background music uploader – max 30 MB */
const uploadMusic = multer({
  storage:  createCloudinaryStorage('music', 'video', ['mp3', 'wav', 'ogg', 'm4a']),
  limits:   { fileSize: 30 * 1024 * 1024 },
  fileFilter: audioFileFilter,
}).single('music');

/** Profile photo uploader – max 5 MB */
const uploadProfilePhoto = multer({
  storage:  createCloudinaryStorage('profiles', 'image', ['jpg', 'jpeg', 'png', 'webp']),
  limits:   { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter,
}).single('profilePhoto');

/** Timeline event image – max 10 MB */
const uploadTimelineImage = multer({
  storage:  createCloudinaryStorage('timeline', 'image', ['jpg', 'jpeg', 'png', 'webp']),
  limits:   { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter,
}).single('image');

// ── FILE FILTERS ──────────────────────────────────────────────────────────
function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
}

function videoFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('video/')) {
    return cb(new Error('Only video files are allowed'), false);
  }
  cb(null, true);
}

function audioFileFilter(req, file, cb) {
  const allowed = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
                   'audio/x-m4a', 'video/webm', 'audio/webm'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only audio files are allowed'), false);
  }
  cb(null, true);
}

// ── CLOUDINARY HELPERS ────────────────────────────────────────────────────

/**
 * Delete a resource from Cloudinary by public_id.
 * @param {string} publicId
 * @param {string} resourceType – 'image' | 'video' | 'raw'
 */
async function deleteFromCloudinary(publicId, resourceType = 'image') {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (err) {
    // Non-fatal – log and continue
    require('../utils/logger').error('Cloudinary delete error:', err.message);
  }
}

/**
 * Extract the public_id from a Cloudinary URL.
 * Example: https://res.cloudinary.com/demo/image/upload/v1234/birthday_surprise/gallery/photo_123.jpg
 *   → birthday_surprise/gallery/photo_123
 */
function extractPublicId(url) {
  if (!url) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    // Remove version segment if present (v1234567/)
    const pathPart = parts[1].replace(/^v\d+\//, '');
    // Remove file extension
    return pathPart.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

module.exports = {
  cloudinary,
  uploadGallery,
  uploadGallerySingle,
  uploadVideo,
  uploadVoice,
  uploadMusic,
  uploadProfilePhoto,
  uploadTimelineImage,
  deleteFromCloudinary,
  extractPublicId,
};
