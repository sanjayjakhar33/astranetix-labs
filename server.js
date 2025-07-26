// server.js

const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');
const db = require('./db');  // mysql2/promise connection

const app = express();
const PORT = process.env.PORT || 3000;

// --- 🔐 Session setup ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'astranetix_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  }
}));

// --- 🌐 Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 🌍 Static files ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// --- 📡 API Routes ---
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);

// --- ✅ MySQL Connection check ---
(async () => {
  try {
    const connection = await db.getConnection();  // Using mysql2/promise connection
    console.log('✅ Connected to MySQL Database');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
  }
})();

// --- 🚀 Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
