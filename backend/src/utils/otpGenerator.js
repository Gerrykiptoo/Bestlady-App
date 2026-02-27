const { authenticator } = require('otplib');

/**
 * Generate a time‑based OTP secret and current OTP
 * @returns {Object} - { secret, otp }
 */
const generateOTP = () => {
  const secret = authenticator.generateSecret();
  const otp = authenticator.generate(secret);
  return { secret, otp };
};

/**
 * Verify a provided OTP against the secret
 * @param {string} secret - The secret stored with the order
 * @param {string} token - The OTP entered by the user
 * @returns {boolean} - True if valid
 */
const verifyOTP = (secret, token) => {
  return authenticator.verify({ token, secret });
};

module.exports = { generateOTP, verifyOTP };