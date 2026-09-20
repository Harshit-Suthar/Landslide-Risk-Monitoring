const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Shared weather endpoint
router.get('/:district', weatherController.getDistrictWeather);

module.exports = router;
