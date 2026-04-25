const { User } = require('../models');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'phone', 'business_name', 'tier', 'role', 'nickname', 'avatar_url', 'wallet_balance', 'credit_limit']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nickname } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (nickname !== undefined) user.nickname = nickname;
    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: { id: user.id, nickname: user.nickname, avatar_url: user.avatar_url }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const avatarUrl = req.file.location || req.file.path;
    user.avatar_url = avatarUrl;
    await user.save();
    res.json({ message: 'Avatar uploaded successfully', avatar_url: avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar };