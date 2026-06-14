// This loads our secret variables from .env file
require('dotenv').config();

// This brings in the PostgreSQL connection tool
const { Pool } = require('pg');

// This creates a connection pool (a group of reusable connections to our database)
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// We export this pool so other files can use it to talk to the database
module.exports = pool;