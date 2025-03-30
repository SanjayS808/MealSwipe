require('dotenv').config();
const { Pool } = require('pg');

// Determine credentials based on environment
const dbPassword = process.env.NODE_ENV === 'production' 
    ? process.env.DB_PASSWORD_PROD 
    : process.env.DB_PASSWORD_DEV;

    const dbUser = process.env.NODE_ENV === 'production'
    ? process.env.DB_USER_PROD
    : process.env.DB_USER_DEV;

// Database configuration
const pool = new Pool({
    user: dbUser,
    host: process.env.DB_URL_PATH,
    database: 'dev',
    password: dbPassword,
    port: 5432,  // Default PostgreSQL port
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;