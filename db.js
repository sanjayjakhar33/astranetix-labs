// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   // ✅ matches .env
  database: process.env.DB_NAME,       // ✅ matches .env
});

module.exports = db;
