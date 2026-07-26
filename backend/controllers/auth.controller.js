/* ============================================
   controllers/auth.controller.js
============================================ */
'use strict';

const User                          = require('../models/User.model');
const { sendTokenResponse }         = require('../utils/jwt.utils');
const { success, error }            = require('../utils/apiResponse');
const logger                        = require('../utils/logger');

// ── POST /api/auth/register ─────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Only allow one admin in this app (optional guard)
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return error(res, 'An admin account already exists.', 409);
    }

    const user = await User.create({ name, email, password, role: 'admin' });
    logger.info(`New admin registered: ${email}`);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user WITH password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return error(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return error(res, 'Account is deactivated. Contact support.', 403);
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`Admin logged in: ${email}`);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ───────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie('token');
  return success(res, {}, 'Logged out successfully');
};

// ── GET /api/auth/profile ───────────────────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return error(res, 'User not found.', 404);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/profile ───────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    return success(res, { user }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/change-password ──────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return error(res, 'Current password is incorrect.', 401);
    }

    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
