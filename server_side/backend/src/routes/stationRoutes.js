const express = require('express');
const router = express.Router();
const { getStations } = require('../controllers/stationController');

/**
 * @route   GET /api/stations
 * @desc    Get active pickup stations
 * @access  Public
 */
router.get('/', getStations);

module.exports = router;
