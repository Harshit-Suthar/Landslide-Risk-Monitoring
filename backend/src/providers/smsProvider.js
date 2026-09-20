/**
 * ============================================================================
 * DATA PROVIDER MODULE: SMS Gateway
 * ============================================================================
 * REPLACE THIS FUNCTION BODY ONLY — return shape must stay identical.
 * 
 * When swapping in a real SMS provider (e.g., Twilio, CDAC Gov SMS Gateway, Gupshup),
 * do not alter the exported function signature or returned property keys.
 * 
 * Required Return Shape:
 * {
 *   success: boolean,
 *   messageId: string
 * }
 * ============================================================================
 */

/**
 * Dispatches an SMS alert to a designated recipient or broadcast list.
 * @param {string} phoneNumber - E.164 or national phone number string
 * @param {string} message - Text alert content
 * @returns {Promise<{ success: boolean, messageId: string }>}
 */
async function sendSms(phoneNumber, message) {
  // STUB: Log SMS dispatch and return a deterministic/traceable messageId
  const timestamp = Date.now();
  const fakeId = `sms_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;

  console.log(`[SMS Provider] Sending SMS to ${phoneNumber}: "${message}" (ID: ${fakeId})`);

  return {
    success: true,
    messageId: fakeId
  };
}

module.exports = {
  sendSms
};
