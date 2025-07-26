// routes/contact.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Submit Contact Form
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Insert the message into the MySQL contacts table
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
router.get('/all', async (req, res) => {
  try {
    // Fetch all contact messages from the database
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows); // Return the contact messages as a JSON response
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching messages', error: err });
  }
});

module.exports = router;
