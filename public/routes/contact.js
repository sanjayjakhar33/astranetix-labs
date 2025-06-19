
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newEntry = new Contact({ name, email, message });
    await newEntry.save();
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit form.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const entries = await Contact.find().sort({ submittedAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

module.exports = router;
