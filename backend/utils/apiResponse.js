/* ============================================
   utils/apiResponse.js – Standardized Responses
============================================ */
'use strict';

/**
 * Send a successful API response.
 */
const success = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Send an error API response.
 */
const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

/**
 * Send paginated response.
 */
const paginated = (res, data, total, page, limit, message = 'Success') => {
  return res.status(200).json({
    success:    true,
    message,
    total,
    page:       parseInt(page),
    limit:      parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data,
  });
};

module.exports = { success, error, paginated };
