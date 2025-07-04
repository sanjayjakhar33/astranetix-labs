const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const AdminUser = require('../models/AdminUser');

// ✅ Register Admin (Only once)
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });

    const count = await AdminUser.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'Admin creation locked' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AdminUser({ username, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Admin registered' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while registering admin' });
  }
});

// ✅ Login and Start Session
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  // 🔐 Create session
  req.session.isAdminAuthenticated = true;
  req.session.adminEmail = email;

  res.json({ message: 'Login successful' });
});

// ✅ Logout and Destroy Session
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// 🔁 Forgot Password via OTP
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await AdminUser.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your OTP for password reset',
    text: `Your OTP is: ${otp}`
  });

  res.json({ message: 'OTP sent to email' });
});

// 🔁 Reset Password via OTP
router.post('/reset', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await AdminUser.findOne({ email, otp });
  if (!user || user.otpExpires < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

module.exports = router;
