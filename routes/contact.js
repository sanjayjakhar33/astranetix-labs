// routes/contact.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Submit Contact Form
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await db.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(200).json({ msg: 'Message received successfully!' });
  } catch (err) {
    res.status(500).json({ msg: 'Error saving message', error: err });
  }
});

// ✅ Get All Messages (Admin only)
router.get('/messages', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching messages', error: err });
  }
});

module.exports = router;

