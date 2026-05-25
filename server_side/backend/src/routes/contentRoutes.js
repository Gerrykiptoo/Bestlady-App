const express = require('express');
const router = express.Router();
const c = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const staffOrAdmin = [protect, authorize('staff', 'admin')];

// Staff / Admin management (specific routes must come before wildcard :type)
router.get('/staff/:type', ...staffOrAdmin, c.listAllByType);
router.post('/', ...staffOrAdmin, c.create);
router.put('/:id', ...staffOrAdmin, c.update);
router.delete('/:id', ...staffOrAdmin, c.remove);

// Public
router.get('/blog/:slug', c.getBySlug);
router.get('/:type', c.listByType);

module.exports = router;
