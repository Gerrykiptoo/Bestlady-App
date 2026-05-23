const express = require('express');
const router = express.Router();
const {
  getAgentClients,
  addClient,
  getAgentStats
} = require('../controllers/agentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All agent routes require agent role
router.use(protect, authorize('agent'));

router.get('/clients', getAgentClients);
router.post('/clients', addClient);
router.get('/stats', getAgentStats);

module.exports = router;
