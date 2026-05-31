module.exports = {
  apps: [
    {
      name: 'bestlady-api',
      script: 'server_side/backend/src/server.js',
      cwd: '/home/hp/Bestlady',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Restart on crash, memory limit, or daily
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 10,
      watch: false,
      // Logging
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    }
  ]
};
