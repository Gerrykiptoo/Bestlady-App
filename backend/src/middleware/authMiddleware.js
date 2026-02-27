const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Protect routes – verifies JWT and attaches user to request
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      // Fetch user from database (exclude password)
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      return next(); // ✅ ensure we return after next()
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Admin middleware – checks if the authenticated user is an admin
 * Note: Assumes the User model has an `is_admin` boolean field.
 *       If you haven't added it yet, add it to the model (default false).
 */
const admin = (req, res, next) => {
  if (req.user && req.user.is_admin === true) {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin' });
};

module.exports = { protect, admin };