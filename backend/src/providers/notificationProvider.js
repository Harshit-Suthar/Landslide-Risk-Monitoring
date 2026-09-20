/**
 * ============================================================================
 * DATA PROVIDER MODULE: Notifications (Push & Email)
 * ============================================================================
 * REPLACE THIS FUNCTION BODY ONLY — return shape must stay identical.
 * 
 * When swapping in real notification providers (e.g., Firebase Cloud Messaging,
 * AWS SNS, SendGrid, Gov-SMTP), do not alter function signatures or returned keys.
 * 
 * Required Return Shapes:
 *   sendPushNotification(userId, payload) ->
 *     { success: boolean, notificationId: string }
 * 
 *   sendEmail(email, subject, body) ->
 *     { success: boolean, messageId: string }
 * ============================================================================
 */

/**
 * Sends a push notification to a registered user or device group.
 * @param {string} userId - UUID or identifier of the user
 * @param {object} payload - Notification payload { title, body, data }
 * @returns {Promise<{ success: boolean, notificationId: string }>}
 */
async function sendPushNotification(userId, payload) {
  const timestamp = Date.now();
  const fakeId = `push_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;

  console.log(`[Notification Provider] Push to User ${userId}:`, payload, `(ID: ${fakeId})`);

  return {
    success: true,
    notificationId: fakeId
  };
}

/**
 * Sends an email notification to designated email address.
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} body - HTML or plain-text email body
 * @returns {Promise<{ success: boolean, messageId: string }>}
 */
async function sendEmail(email, subject, body) {
  const timestamp = Date.now();
  const fakeId = `email_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;

  console.log(`[Notification Provider] Email to ${email} | Subject: "${subject}" (ID: ${fakeId})`);

  return {
    success: true,
    messageId: fakeId
  };
}

module.exports = {
  sendPushNotification,
  sendEmail
};
