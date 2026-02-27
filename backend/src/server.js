const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

// Optional: import and start background jobs (if you have inventoryJobs.js)
// require('./jobs/inventoryJobs');

// Connect to database and start server
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
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
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server and exit
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Close server and exit
  process.exit(1);
});