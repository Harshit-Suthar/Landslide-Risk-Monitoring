const express = require('express');
const router = express.Router();
const citizenController = require('../controllers/citizenController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateBody } = require('../middleware/validateRequest');

// Citizen routes require authentication and 'Citizen' or 'Admin' role
router.use(authenticate);
router.use(requireRole(['Citizen', 'Admin']));

// Notify emergency responders after submitting a direct report to Supabase
router.post(
  '/reports/notify',
  validateBody({
    report_id: { type: 'string', required: true }
  }),
  citizenController.notifyReport
);

module.exports = router;
