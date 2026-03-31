// Add these new functions to existing adminController.js

// @desc    Create new user (admin only)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { username, email, password, phone, business_name, business_type, role, tier, kyc_status } = req.body;

    // Validate admin-only roles
    const adminRoles = ['user', 'staff', 'agent'];
    if (!adminRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role for user creation' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      phone,
      business_name,
      business_type,
      role,
      tier: tier || (['mall', 'large_supermarket', 'chain_store', 'distributor', 'exporter', 'institution'].includes(business_type) ? 'wholesale' : 'retail'),
      kyc_status: kyc_status || 'pending',
      wallet_balance: 0,
      credit_limit: 0
    });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user (role, tier, KYC, etc)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { role, tier, kyc_status, credit_limit, active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};
    if (role && ['user', 'staff', 'agent'].includes(role)) updateData.role = role;
    if (tier && ['retail', 'wholesale'].includes(tier)) updateData.tier = tier;
    if (kyc_status && ['pending', 'verified', 'rejected'].includes(kyc_status)) updateData.kyc_status = kyc_status;
    if (credit_limit !== undefined) updateData.credit_limit = parseFloat(credit_limit) || 0;
    if (active !== undefined) updateData.active = active;

    await user.update(updateData);
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  updateKYC,
  getSalesAnalytics,
  getInventoryHealth,
  createUser,
  updateUser,
  deleteUser  // Append to existing exports
};

