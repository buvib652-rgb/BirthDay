/* ============================================
   config/db.js – MongoDB Atlas Connection
============================================ */

'use strict';

const mongoose = require('mongoose');
const logger   = require('../utils/logger');

/**
 * Connect to MongoDB Atlas.
 * Retries once on failure with a 5-second delay.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  const options = {
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    family: 4, // Use IPv4 to avoid issues on some hosts
  };

  try {
    const conn = await mongoose.connect(uri, options);
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected — attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (err) {
    logger.error('MongoDB initial connection failed:', err.message);
    // Retry once after 5 s
    logger.info('Retrying MongoDB connection in 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
    const conn = await mongoose.connect(uri, options);
    logger.info(`✅ MongoDB connected on retry: ${conn.connection.host}`);
  }
}

module.exports = { connectDB };
