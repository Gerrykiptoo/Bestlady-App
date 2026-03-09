const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { username, email, password, phone, business_name, business_type, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine tier based on business type
    const wholesaleTypes = ['mall', 'large_supermarket', 'chain_store', 'distributor', 'exporter', 'institution'];
    const tier = wholesaleTypes.includes(business_type) ? 'wholesale' : 'retail';

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      phone,
      business_name,
      business_type,
      tier,
      role: role || 'user',
      kyc_status: 'pending',
      wallet_balance: 0,
      credit_limit: 0
    });

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('❌ Registration error:', error);  // <-- this prints the full error in your terminal
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    console.error('❌ GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};