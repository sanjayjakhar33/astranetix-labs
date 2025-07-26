const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Importing routes
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoice');

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

// --- 🔐 Auth Middleware for /dashboard/*.html ---
app.use('/dashboard', (req, res, next) => {
  const allowedPublicFiles = ['/login.html', '/forgot.html', '/reset.html'];
  const isPublic = allowedPublicFiles.some(file => req.path.endsWith(file));

  if (req.session && req.session.isAdminAuthenticated) {
    return next(); // ✅ Logged in
  }

  if (isPublic) {
    return next(); // ✅ Allow login, forgot, reset pages
  }

  // ❌ Block access to protected dashboard files
  return res.redirect('/dashboard/login.html');
});

// --- 🌍 Static files ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// --- 📡 API Routes ---
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invoice', invoiceRoutes);

// --- 🌐 Sequelize - MySQL Connection Setup ---
const sequelize = require('./db'); // Sequelize instance

(async () => {
  try {
    await sequelize.authenticate(); // Sequelize check connection
    console.log('✅ Connected to MySQL Database');
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
  }
})();

// --- 🚀 Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
