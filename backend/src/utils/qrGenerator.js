const QRCode = require('qrcode');

/**
 * Generate a QR code as a Data URL (base64 image)
 * @param {string} data - The data to encode (e.g., order ID, verification string)
 * @returns {Promise<string>} - Data URL of the QR code
 */
const generateQR = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate a QR code as a buffer (for PDFs or file storage)
 * @param {string} data - The data to encode
 * @returns {Promise<Buffer>} - PNG image buffer
 */
const generateQRBuffer = async (data) => {
  try {
    return await QRCode.toBuffer(data);
  } catch (error) {
    console.error('QR buffer error:', error);
    throw new Error('Failed to generate QR buffer');
  }
};

module.exports = { generateQR, generateQRBuffer };