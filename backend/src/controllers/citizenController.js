const notificationProvider = require('../providers/notificationProvider');

/**
 * Citizen Controller
 * Protected by requireRole(['Citizen', 'Admin'])
 */

/**
 * Triggers an admin-facing notification after a citizen submits a report via Supabase directly.
 * POST /api/citizen/reports/notify
 * Body: { report_id, district, incident_type, severity }
 */
async function notifyReport(req, res, next) {
  try {
    const { report_id, district, incident_type, severity } = req.body;

    const notificationPayload = {
      title: `New Citizen Report: ${incident_type || 'Landslide Alert'}`,
      body: `District: ${district || 'Unassigned'} | Severity: ${severity || 'Moderate'} | Report ID: ${report_id}`,
      data: {
        report_id,
        submittedBy: req.user?.userId,
        timestamp: new Date().toISOString()
      }
    };

    // Notify emergency admin room
    const pushResult = await notificationProvider.sendPushNotification('admin_control_room', notificationPayload);

    // Send email alert to central duty desk
    const emailResult = await notificationProvider.sendEmail(
      'duty-officer@ner-landslide.gov.in',
      `[Citizen Report] New ${severity || 'Moderate'} Incident Submitted in ${district || 'NER'}`,
      `A new incident report (${report_id}) was submitted by citizen ${req.user?.userId || 'anonymous'}. Details: ${incident_type} in ${district}.`
    );

    res.json({
      success: true,
      message: 'Emergency response team notified of submitted report',
      data: {
        pushResult,
        emailResult
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  notifyReport
};
