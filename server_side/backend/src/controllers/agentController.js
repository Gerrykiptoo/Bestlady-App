const { User, Order, OrderItem, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all clients assigned to the authenticated agent
 */
const getAgentClients = async (req, res) => {
  try {
    const clients = await User.findAll({
      where: {
        agent_id: req.user.id
      },
      attributes: { exclude: ['password'] }
    });
    res.json(clients);
  } catch (error) {
    console.error('Get agent clients error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new client for the agent
 */
const addClient = async (req, res) => {
  try {
    const { username, email, password, phone, business_name, business_type, tier } = req.body;
    
    const client = await User.create({
      username,
      email,
      password,
      phone,
      business_name,
      business_type,
      tier,
      agent_id: req.user.id,
      role: 'user'
    });

    const clientResponse = client.toJSON();
    delete clientResponse.password;
    
    res.status(201).json(clientResponse);
  } catch (error) {
    console.error('Add client error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get commission earned by the agent
 */
const getAgentStats = async (req, res) => {
  try {
    const totalCommission = await Order.sum('commission_earned', {
      where: {
        agent_id: req.user.id,
        status: ['paid', 'processing', 'ready', 'dispatched', 'delivered', 'completed']
      }
    }) || 0;

    const activeClients = await User.count({
      where: { agent_id: req.user.id }
    });

    res.json({
      total_commission: parseFloat(totalCommission).toFixed(2),
      active_clients: activeClients
    });
  } catch (error) {
    console.error('Get agent stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAgentClients,
  addClient,
  getAgentStats
};
