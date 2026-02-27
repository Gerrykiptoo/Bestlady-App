const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Optional: import validation middleware if you use express-validator
// const { validateRegister, validateLogin } = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (retail/wholesale)
 * @access  Public
 */
router.post('/register', 
  // validateRegister,  // uncomment if validation middleware exists
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
router.post('/login', 
  // validateLogin,     // uncomment if validation middleware exists
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;