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
// Allowed origins — update FRONTEND_URL in .env for production
// ======================
const buildAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:5173',
    'http://localhost:4173', // vite preview
    'http://127.0.0.1:5173',
  ]);
  // Add configured frontend URL(s) — comma-separated for multiple
  const envUrls = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim()).filter(Boolean);
  envUrls.forEach(u => origins.add(u));
  return [...origins];
};
const ALLOWED_ORIGINS = buildAllowedOrigins();

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
      connectSrc: ["'self'", ...ALLOWED_ORIGINS, '*.ngrok-free.app', '*.ngrok-free.dev'],
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Trust proxy headers (needed when behind ngrok / Vercel / reverse proxies)
app.set('trust proxy', 1);

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

// CORS — allow all configured origins + wildcard ngrok subdomains
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any ngrok tunnel (both paid fixed and free rotating)
    if (origin.match(/https?:\/\/.*\.ngrok(-free)?\.(app|dev|io)$/)) return callback(null, true);
    // Allow any Vercel deployment of this project
    if (origin.match(/https?:\/\/.*\.vercel\.app$/)) return callback(null, true);
    // Allow explicitly listed origins
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.warn('CORS blocked:', origin);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

// Serve uploaded files statically (if you store images locally – optional)
// If you use Supabase Storage, you may not need this.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ======================
// Routes
// ======================

// Health check — used by ngrok, Vercel, and uptime monitors
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV || 'development' });
});

app.get('/', (req, res) => {
  res.json({ message: 'BestLady API is running', health: '/health' });
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
// Dev notification test route — POST /api/test/notify
// ======================
if (process.env.NODE_ENV !== 'production') {
  const testRouter = require('express').Router();
  const emailService = require('./services/emailService');
  const whatsappService = require('./services/whatsappService');

  testRouter.post('/notify', async (req, res) => {
    const { email, phone } = req.body;
    const results = { email: null, whatsapp: null };

    if (email) {
      results.email = await emailService.sendEmail({
        to: email,
        subject: 'BestLady — Test Notification',
        html: '<h2 style="color:#7e22ce;">BestLady Email Works!</h2><p>This is a test notification from your BestLady server.</p>'
      });
    }
    if (phone) {
      results.whatsapp = await whatsappService.sendWhatsApp({
        to: phone,
        body: 'BestLady WhatsApp Works!\n\nThis is a test notification from your BestLady server.'
      });
    }
    res.json({ success: true, results });
  });

  app.use('/api/test', testRouter);
}

// ======================
// Serve built Vue frontend in production (single process — no separate frontend server)
// ======================
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  // The frontend dist lives at different relative depths depending on layout
  // (local monorepo vs Docker image), so probe known candidates and use the
  // first one that actually contains index.html.
  const candidates = [
    path.join(__dirname, '../../../client_side/frontend/dist'), // local: src→backend→server_side→root
    path.join(__dirname, '../../client_side/frontend/dist'),    // alt nesting
    path.join(__dirname, '../client_side/frontend/dist'),       // docker: /app/src→/app
    path.join(process.cwd(), 'client_side/frontend/dist'),      // cwd fallback
  ];
  const frontendDist = candidates.find(p => fs.existsSync(path.join(p, 'index.html')));

  if (frontendDist) {
    console.log('🖥️  Serving frontend from:', frontendDist);
    app.use(express.static(frontendDist, { maxAge: '1d' }));
    // SPA fallback — any non-API route serves index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/health')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  } else {
    console.warn('⚠️  Frontend dist not found — running API-only. Checked:', candidates);
  }
}

// ======================
// 404 Handler – for unmatched API routes
// ======================
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  }
  // In dev, non-API 404s are normal (frontend handles routing via Vite)
  next();
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