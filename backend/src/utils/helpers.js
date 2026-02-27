/**
 * Format a number as Kenyan Shillings (KES)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted string e.g., "KES 1,500"
 */
const formatCurrency = (amount) => {
  return `KES ${amount?.toLocaleString() ?? '0'}`;
};

/**
 * Generate a unique order number (e.g., ORD-20250315-ABC123)
 * @returns {string}
 */
const generateOrderNumber = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${yyyy}${mm}${dd}-${random}`;
};

/**
 * Paginate results – utility to build pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} - { page, limit, total, totalPages }
 */
const paginate = (page, limit, total) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const totalPages = Math.ceil(total / limitNum);
  return {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
  };
};

module.exports = {
  formatCurrency,
  generateOrderNumber,
  paginate,
};