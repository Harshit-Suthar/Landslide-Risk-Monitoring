const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateBody } = require('../middleware/validateRequest');

// All admin routes require Supabase authentication and 'Admin' role
router.use(authenticate);
router.use(requireRole(['Admin']));

// Aggregate real statistics from Supabase tables
router.get('/dashboard/stats', adminController.getDashboardStats);

// Trigger AI risk prediction for a location
router.post(
  '/ai-model/predict',
  validateBody({
    location_id: { type: 'string', required: true }
  }),
  adminController.predictRisk
);

// Verify or reject an incident report
router.patch(
  '/reports/:id/verify',
  validateBody({
    status: { type: 'string', required: true, enum: ['Verified', 'Rejected'] }
  }),
  adminController.verifyReport
);

module.exports = router;
