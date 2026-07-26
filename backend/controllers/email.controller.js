/* ============================================
   controllers/email.controller.js
============================================ */
'use strict';

const { sendEmail }   = require('../services/email.service');
const { success, error } = require('../utils/apiResponse');
const logger          = require('../utils/logger');

// ── POST /api/email/send-message ─────────────────────────────────────────────
/**
 * Send a sweet thank-you / message email after the birthday surprise.
 * Body: { to, subject, message, fromName }
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { to, subject, message, fromName } = req.body;
    const recipient = to || process.env.SMTP_USER;

    if (!recipient || !message) {
      return error(res, 'Recipient email or message content is missing.', 400);
    }

    await sendEmail({
      to: recipient,
      subject: subject || '💌 A Special Message For You',
      html: buildEmailTemplate(fromName || 'Someone Special', message),
    });

    logger.info(`Message email sent to ${recipient}`);
    return success(res, {}, 'Message sent successfully ❤️');
  } catch (err) {
    next(err);
  }
};

// ── POST /api/email/test ──────────────────────────────────────────────────────
exports.testEmail = async (req, res, next) => {
  try {
    await sendEmail({
      to:      process.env.SMTP_USER,
      subject: '🎂 Birthday Surprise — Email Test',
      html:    '<h1>Email is working! ❤️</h1><p>Your SMTP configuration is correct.</p>',
    });
    return success(res, {}, 'Test email sent to your inbox');
  } catch (err) {
    next(err);
  }
};

// ── EMAIL TEMPLATE ────────────────────────────────────────────────────────────
function buildEmailTemplate(fromName, message) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>A Special Message For You</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Georgia',serif;">
  <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a0025,#0a0018);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#c41e5a,#6a0dad);padding:40px 30px;text-align:center;">
      <div style="font-size:60px;margin-bottom:15px;">💝</div>
      <h1 style="color:#ffd700;font-family:'Georgia',serif;font-size:28px;margin:0;text-shadow:0 0 20px rgba(255,215,0,0.5);">
        A Special Message For You
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:40px 30px;">
      <p style="color:rgba(255,255,255,0.6);font-style:italic;font-size:14px;letter-spacing:2px;text-align:center;margin-bottom:30px;">
        From ${fromName}, with love ❤️
      </p>

      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:30px;border-left:4px solid #c41e5a;">
        <p style="color:rgba(255,255,255,0.9);font-size:16px;line-height:1.8;margin:0;font-style:italic;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </div>

      <div style="text-align:center;margin-top:40px;">
        <p style="color:rgba(255,255,255,0.4);font-size:12px;letter-spacing:3px;">
          ❤️ &nbsp; ALWAYS AND FOREVER &nbsp; ❤️
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:rgba(0,0,0,0.4);padding:20px 30px;text-align:center;">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">
        This message was sent with love from the Birthday Surprise website 🎂
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
