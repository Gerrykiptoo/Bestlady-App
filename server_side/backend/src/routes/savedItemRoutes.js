const express = require('express');
const router = express.Router();
const { getSavedItems, addSavedItem, removeSavedItem } = require('../controllers/savedItemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSavedItems);
router.post('/', protect, addSavedItem);
router.delete('/:productId', protect, removeSavedItem);

module.exports = router;
