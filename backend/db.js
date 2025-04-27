/**
 * @fileoverview Database pool configuration for PostgreSQL using environment variables.
 * Initializes and exports a connection pool to be used throughout the application.
 */

require('dotenv').config();
const { Pool } = require('pg');

/**
 * Database password for the development environment.
 * Retrieved from environment variables.
 * @type {string}
 */
const dbPassword = process.env.DB_PASSWORD_DEV;

/**
 * Database user.
 * Chooses between production and development users based on the current NODE_ENV.
 * @type {string}
 */
const dbUser = process.env.NODE_ENV === 'production'
  ? process.env.DB_USER_PROD
  : process.env.DB_USER_DEV;

/**
 * PostgreSQL connection pool instance.
 * Configured with environment-specific credentials and SSL settings.
 * @type {Pool}
 */
const pool = new Pool({
  user: dbUser,
  host: process.env.DB_URL_PATH,
  database: 'dev',
  password: dbPassword,
  port: 5432, // Default PostgreSQL port
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Exports the configured PostgreSQL connection pool for use in other modules.
 * @module pool
 */
module.exports = pool;
