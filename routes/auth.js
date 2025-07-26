// routes/auth.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Zoho Mail transporter
const transporter = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ msg: 'Invalid credentials' });

    // Compare the password with the hashed password in the database
    const validPass = await bcrypt.compare(password, rows[0].password);
    if (!validPass) return res.status(401).json({ msg: 'Invalid credentials' });

    // Create a JWT token with a 1-day expiration
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
});

// ✅ FORGOT PASSWORD (Send OTP)
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

  try {
    // Check if the email exists in the database
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ msg: 'Email not found' });

    // Save the OTP and its expiration time (10 minutes)
    await db.query('UPDATE admins SET otp = ?, otp_expire = NOW() + INTERVAL 10 MINUTE WHERE email = ?', [otp, email]);

    // Send the OTP via email using Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for password reset',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ msg: 'Error sending OTP', error: err });
  }
});

// ✅ RESET PASSWORD
router.post('/reset', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check if the OTP is valid and not expired
    const [rows] = await db.query(
      'SELECT * FROM admins WHERE email = ? AND otp = ? AND otp_expire > NOW()',
      [email, otp]
    );

    if (!rows.length) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    // Hash the new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the OTP fields
    await db.query(
      'UPDATE admins SET password = ?, otp = NULL, otp_expire = NULL WHERE email = ?',
      [hashed, email]
    );

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
});

// ✅ ADD ADMIN
router.post('/add-admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin already exists
    const [existingAdmin] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (existingAdmin.length) return res.status(400).json({ msg: 'Admin already exists' });

    // Hash the password before storing it
    const hashed = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    await db.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashed]);

    res.json({ msg: 'Admin added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
});

module.exports = router;
