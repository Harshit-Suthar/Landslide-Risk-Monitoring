const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes');
const citizenRoutes = require('./citizenRoutes');
const weatherRoutes = require('./weatherRoutes');
const alertRoutes = require('./alertRoutes');
const healthRoutes = require('./healthRoutes');
const geotechRoutes = require('./geotechRoutes');

// Mount routes
router.use('/admin', adminRoutes);
router.use('/citizen', citizenRoutes);
router.use('/weather', weatherRoutes);
router.use('/alerts', alertRoutes);
router.use('/health', healthRoutes);
router.use('/geotech', geotechRoutes);

// Public AI risk prediction endpoint for interactive simulators & citizen checks
const mlProxyService = require('../services/mlProxyService');
router.post('/predict', async (req, res, next) => {
  try {
    const {
      location_id = 'public-sim-1',
      lat = 25.5788,
      lon = 91.8933,
      rainfall_mm = 85.0
    } = req.body;
    const prediction = await mlProxyService.predict({
      location_id,
      lat,
      lon,
      rainfall_mm
    });
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

