const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Save new invoice
router.post('/generate', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json({ message: 'Invoice saved' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving invoice' });
  }
});

// Fetch all invoices
router.get('/history', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

module.exports = router;
