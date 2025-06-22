const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load environment variables

const contactRoutes = require('./routes/contact'); // 📩 Contact form route
const authRoutes = require('./routes/auth');       // 🔐 Admin auth route
const invoiceRoutes = require('./routes/invoice'); // 💰 Invoice routes ← ✅ NEW

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Serve admin dashboard (login, view, etc.)
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// API routes
app.use('/api/contact', contactRoutes);     // 📩 Contact form submission
app.use('/api/auth', authRoutes);           // 🔐 Admin login/register/forgot
app.use('/api/invoice', invoiceRoutes);     // 💰 Invoice generation/history ← ✅ NEW

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
