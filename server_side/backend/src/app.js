const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config(); // ensure env vars are loaded

const app = express();

// ======================
// Middleware
// ======================
app.use(helmet()); // security headers
app.use(compression()); // compress responses
app.use(morgan('dev')); // logging
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// CORS configuration – allow frontend origin from env
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

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes')); // keep as is if your file is paymentRoutes.js
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

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
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

module.exports = app;