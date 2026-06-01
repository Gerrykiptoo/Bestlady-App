// Force IPv4 DNS resolution first — Render containers can't reach IPv6, which
// otherwise breaks Gmail SMTP (ENETUNREACH on an IPv6 address) and other hosts.
require('dns').setDefaultResultOrder('ipv4first');

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io in app for access in controllers
app.set('io', io);

// Track online users: socketId -> userId
const onlineUsers = new Map();
app.set('onlineUsers', onlineUsers);

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    socket.join('admins'); // all sockets join admin broadcast room
    onlineUsers.set(socket.id, userId);
    console.log(`👤 User ${userId} joined their room | online: ${onlineUsers.size}`);
    io.emit('onlineCount', { count: new Set(onlineUsers.values()).size });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    console.log(`🔌 Client disconnected | online: ${onlineUsers.size}`);
    io.emit('onlineCount', { count: new Set(onlineUsers.values()).size });
  });
});

// Connect to database with retry logic, then start server
const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');

      server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });

      const gracefulShutdown = () => {
        console.log('🛑 Received shutdown signal, closing server...');
        server.close(() => {
          console.log('👋 Server closed');
          sequelize.close().then(() => {
            console.log('🗄️ Database connection closed');
            process.exit(0);
          });
        });
      };
      process.on('SIGTERM', gracefulShutdown);
      process.on('SIGINT', gracefulShutdown);
      return; // success
    } catch (err) {
      console.error(`❌ Database connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        console.log(`   Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.error('   All retries exhausted. Check DB_HOST / internet connection and restart.');
        process.exit(1);
      }
    }
  }
};

connectWithRetry();