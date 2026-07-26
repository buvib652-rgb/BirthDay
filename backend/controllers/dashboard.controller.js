/* ============================================
   controllers/dashboard.controller.js
============================================ */
'use strict';

const { Gallery, Timeline, VoiceMessage, VideoMemory, Visitor } = require('../models/models');
const { success } = require('../utils/apiResponse');

// ── GET /api/dashboard ──────────────────────────────────────────────────────
exports.getDashboard = async (req, res, next) => {
  try {
    // Run all counts in parallel
    const [
      galleryCount,
      timelineCount,
      voiceCount,
      videoCount,
      totalVisitors,
      todayVisitors,
      recentVisitors,
    ] = await Promise.all([
      Gallery.countDocuments(),
      Timeline.countDocuments(),
      VoiceMessage.countDocuments(),
      VideoMemory.countDocuments(),
      Visitor.countDocuments(),
      Visitor.countDocuments({
        visitedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Visitor.find()
        .sort({ visitedAt: -1 })
        .limit(10)
        .select('ip country device browser visitedAt isReturn'),
    ]);

    // Country distribution
    const countryStats = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Device distribution
    const deviceStats = await Visitor.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Visitors per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const visitorsLast7Days = await Visitor.aggregate([
      { $match: { visitedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return success(res, {
      stats: {
        galleryCount,
        timelineCount,
        voiceCount,
        videoCount,
        totalVisitors,
        todayVisitors,
        returnVisitors: await Visitor.countDocuments({ isReturn: true }),
      },
      recentVisitors,
      countryStats,
      deviceStats,
      visitorsLast7Days,
    });
  } catch (err) {
    next(err);
  }
};
