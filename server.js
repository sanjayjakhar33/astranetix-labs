const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // To load MONGODB_URI from .env

const contactRoutes = require('./routes/contact'); // Route handler

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend (main site)
app.use(express.static(path.join(__dirname, 'public')));

// Serve admin dashboard (to view submissions)
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// API route for contact form submissions
app.use('/api/contact', contactRoutes);

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
