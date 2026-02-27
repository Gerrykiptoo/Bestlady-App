// Order statuses (matches Order model ENUM)
const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  READY: 'ready',
  DISPATCHED: 'dispatched',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment methods
const PAYMENT_METHOD = {
  MPESA: 'mpesa',
  WALLET: 'wallet',
  CREDIT: 'credit',
};

// Delivery channels
const DELIVERY_CHANNEL = {
  PRIVATE_RIDER: 'private_rider',
  COMPANY_FLEET: 'company_fleet',
  PICKUP: 'pickup',
};

// Business types (matches User model ENUM)
const BUSINESS_TYPE = {
  SALON: 'salon',
  MINI_SUPERMARKET: 'mini_supermarket',
  BEAUTY_SHOP: 'beauty_shop',
  FREELANCE: 'freelance',
  MALL: 'mall',
  LARGE_SUPERMARKET: 'large_supermarket',
  CHAIN_STORE: 'chain_store',
  DISTRIBUTOR: 'distributor',
  EXPORTER: 'exporter',
  INSTITUTION: 'institution',
};

// User tiers
const USER_TIER = {
  RETAIL: 'retail',
  WHOLESALE: 'wholesale',
};

// KYC statuses
const KYC_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// Transaction types for wallet
const WALLET_TX_TYPE = {
  DEPOSIT: 'deposit',
  PAYMENT: 'payment',
  REFUND: 'refund',
  WITHDRAWAL: 'withdrawal',
};

// AI prediction types
const AI_PREDICTION_TYPE = {
  RESTOCK: 'restock',
  DEMAND: 'demand',
};

// Inventory alert types
const INVENTORY_ALERT_TYPE = {
  LOW_STOCK: 'low_stock',
  REORDER: 'reorder',
};

module.exports = {
  ORDER_STATUS,
  PAYMENT_METHOD,
  DELIVERY_CHANNEL,
  BUSINESS_TYPE,
  USER_TIER,
  KYC_STATUS,
  WALLET_TX_TYPE,
  AI_PREDICTION_TYPE,
  INVENTORY_ALERT_TYPE,
};