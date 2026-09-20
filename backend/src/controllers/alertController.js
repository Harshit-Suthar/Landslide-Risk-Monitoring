const smsProvider = require('../providers/smsProvider');
const notificationProvider = require('../providers/notificationProvider');

/**
 * Alert Controller
 * Shared / Broadcast route for dispatching regional emergency warnings
 */

/**
 * POST /api/alerts/send
 * Body: { district, message, severity, phoneNumber? }
 */
async function sendAlert(req, res, next) {
  try {
    const { district, message, severity = 'High', phoneNumber } = req.body;

    const targetPhone = phoneNumber || `+91-DISASTER-EMERGENCY-${district.toUpperCase()}`;

    // 1. Dispatch SMS
    const smsResult = await smsProvider.sendSms(
      targetPhone,
      `[NER EARLY WARNING - ${severity.toUpperCase()}] ${district}: ${message}`
    );

    // 2. Dispatch push notification to subscribers in that district
    const notificationResult = await notificationProvider.sendPushNotification(
      `district_${district}`,
      {
        title: `Landslide Alert: ${district} [${severity}]`,
        body: message,
        severity
      }
    );

    res.json({
      success: true,
      message: `Emergency alert dispatched for district ${district}`,
      data: {
        smsResult,
        notificationResult
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendAlert
};
