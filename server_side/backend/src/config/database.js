const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

// Ensure pg uses IPv4 first (avoids IPv6 resolution delays)
pg.defaults.dns = { family: 4 };

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 6543,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      connectTimeout: 10000,      // 10s connection timeout
      keepAlive: true,            // keep TCP alive to prevent pooler drops
      keepAliveInitialDelayMillis: 10000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,             // wait up to 30s to get a connection
      idle: 10000,                // release idle connections after 10s
      evict: 10000                // run eviction every 10s
    },
    retry: {
      max: 3                      // retry failed queries up to 3 times
    },
    logging: process.env.NODE_ENV === 'development' ? false : false
  }
);

module.exports = sequelize;