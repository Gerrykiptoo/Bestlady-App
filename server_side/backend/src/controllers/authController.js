const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const emailService = require('../services/emailService');

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

    if (user.is_active === false) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support at info@bestlady.co.ke.' });
    }

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Fire login notification email (non-blocking)
    emailService.sendLoginNotification(user).catch(err => console.error('Login email error:', err));

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        tier: user.tier,
        role: user.role,
        wallet_balance: user.wallet_balance,
        credit_limit: user.credit_limit,
        business_name: user.business_name,
        avatar_url: user.avatar_url,
        nickname: user.nickname,
        agent_id: user.agent_id,
        commission_rate: user.commission_rate,
        is_active: user.is_active
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ where: { email } });
    // Always respond 200 to avoid user enumeration
    if (!user) return res.json({ message: 'If that email is registered, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({ reset_token: token, reset_token_expires: expires });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const BRAND_COLOR = '#8B4513';
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:${BRAND_COLOR};padding:20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">BestLady Beauty</h1>
          <p style="color:#f0d9c8;margin:4px 0 0;font-size:13px;">Password Reset Request</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <h2 style="color:${BRAND_COLOR};margin-top:0;">Reset Your Password</h2>
          <p style="color:#555;">Hi ${user.business_name || user.username},</p>
          <p style="color:#555;">We received a request to reset the password for your BestLady account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Reset Password</a>
          </div>
          <p style="color:#9ca3af;font-size:13px;">If you did not request a password reset, you can safely ignore this email. Your password will not change.</p>
          <p style="color:#9ca3af;font-size:12px;word-break:break-all;">Or copy this link: ${resetUrl}</p>
        </div>
        <div style="background:#f9f4f0;padding:16px;text-align:center;font-size:11px;color:#888;border-top:1px solid #eee;">
          BestLady Beauty &bull; Nairobi, Kenya &bull; info@bestlady.co.ke
        </div>
      </div>`;

    await emailService.sendEmail({ to: user.email, subject: 'Reset Your BestLady Password', html });

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    await user.update({
      password,
      reset_token: null,
      reset_token_expires: null
    });

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
};