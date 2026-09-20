const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { validateBody } = require('../middleware/validateRequest');

// Shared emergency alert dispatch endpoint
router.post(
  '/send',
  validateBody({
    district: { type: 'string', required: true },
    message: { type: 'string', required: true }
  }),
  alertController.sendAlert
);

module.exports = router;
