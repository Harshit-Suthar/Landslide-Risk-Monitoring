const express = require('express');
const router = express.Router();
const geotechController = require('../controllers/geotechController');

/**
 * Geotechnical Engineering Telemetry Routes
 * GET  /api/geotech/:location_id   - Fetch real-time sensor parameters, pore pressure, FoS
 * POST /api/geotech/analyze        - Analyze custom slope parameters
 */
router.get('/:location_id', geotechController.getLocationGeotech);
router.post('/analyze', geotechController.analyzeSlope);

module.exports = router;
