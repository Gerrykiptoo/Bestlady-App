const { SavedItem } = require('../models');

// GET /api/saved — list the logged-in user's saved-for-later items
const getSavedItems = async (req, res) => {
  try {
    const items = await SavedItem.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (error) {
    console.error('Get saved items error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/saved — add (or update) a saved item
const addSavedItem = async (req, res) => {
  try {
    const { product_id, name, price, discountedPrice, discountPercent, image_url, quantity } = req.body;
    if (!product_id) return res.status(400).json({ message: 'product_id is required' });

    const [item, created] = await SavedItem.findOrCreate({
      where: { user_id: req.user.id, product_id },
      defaults: {
        name, price, discountedPrice,
        discountPercent: discountPercent || 0,
        image_url, quantity: quantity || 1
      }
    });

    if (!created) {
      // Already saved → update snapshot fields
      await item.update({ name, price, discountedPrice, discountPercent: discountPercent || 0, image_url, quantity: quantity || item.quantity });
    }

    res.status(created ? 201 : 200).json(item);
  } catch (error) {
    console.error('Add saved item error:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/saved/:productId — remove a saved item
const removeSavedItem = async (req, res) => {
  try {
    await SavedItem.destroy({
      where: { user_id: req.user.id, product_id: req.params.productId }
    });
    res.json({ message: 'Removed' });
  } catch (error) {
    console.error('Remove saved item error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSavedItems, addSavedItem, removeSavedItem };
