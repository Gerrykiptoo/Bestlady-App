const { PickupStation } = require('../models');

/**
 * Get active pickup stations
 * @route GET /api/stations
 * @access Public
 */
const getStations = async (req, res) => {
  try {
    const stations = await PickupStation.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.json(stations);
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({ message: 'Failed to fetch stations' });
  }
};

module.exports = {
  getStations
};
