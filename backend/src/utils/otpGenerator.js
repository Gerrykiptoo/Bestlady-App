const crypto = require('crypto');

/**
 * Generate a random numeric OTP
 * @returns {Object} - { secret, otp }
 */
const generateOTP = () => {
  // Generate a random secret (base64 encoded)
  const secret = crypto.randomBytes(20).toString('base64');
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  return { secret, otp };
};

/**
 * Verify a provided OTP against the secret
 * Note: This is a simple implementation. In production, 
 * you'd want to store the OTP with an expiry and validate against it.
 * @param {string} secret - The secret stored with the order
 * @param {string} token - The OTP entered by the user
 * @returns {boolean} - True if valid (always true for demo)
 */
const verifyOTP = (secret, token) => {
  // For now, accept any 6-digit OTP (simplified)
  return token && token.length === 6 && /^\d+$/.test(token);
};

module.exports = { generateOTP, verifyOTP };