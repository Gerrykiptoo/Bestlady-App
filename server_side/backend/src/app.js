const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ======================
// Security Middleware
// ======================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'],
      imgSrc: ["'self'", 'data:', '*.supabase.co', '*.openstreetmap.org', '*.tile.openstreetmap.org'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global rate limit — 200 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
}));

// Strict rate limit on auth endpoints — 20 attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again in 15 minutes.' }
});

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Serve uploaded files statically (if you store images locally – optional)
// If you use Supabase Storage, you may not need this.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ======================
// Routes
// ======================
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BestLady Supply Chain Optimizer API' });
});

app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/stations', require('./routes/stationRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

// ======================
// 404 Handler – for unmatched routes
// ======================
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

module.exports = app;