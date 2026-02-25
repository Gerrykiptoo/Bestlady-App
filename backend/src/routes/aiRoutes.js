const express = require('express');
const router = express.Router();
const { getRestockPrediction, getDemandForecast } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/inventory/:productId/predict', protect, getRestockPrediction);
router.get('/demand/forecast', protect, admin, getDemandForecast);

module.exports = router;
