const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes');
const citizenRoutes = require('./citizenRoutes');
const weatherRoutes = require('./weatherRoutes');
const alertRoutes = require('./alertRoutes');
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/admin', adminRoutes);
router.use('/citizen', citizenRoutes);
router.use('/weather', weatherRoutes);
router.use('/alerts', alertRoutes);
router.use('/health', healthRoutes);

module.exports = router;
