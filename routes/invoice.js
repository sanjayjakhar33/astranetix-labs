const express = require('express');
const router = express.Router();
const db = require('../db');

// Save new invoice
router.post('/generate', async (req, res) => {
  const {
    client_name,
    client_email,
    items,
    total_amount,
    gst,
    invoice_date
  } = req.body;

  try {
    const query = `
      INSERT INTO invoices (client_name, client_email, items, total_amount, gst, invoice_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      client_name,
      client_email,
      JSON.stringify(items),
      total_amount,
      gst,
      invoice_date,
    ]);

    res.status(201).json({ message: 'Invoice saved', invoiceId: result.insertId });
  } catch (err) {
    console.error('Error saving invoice:', err);
    res.status(500).json({ error: 'Error saving invoice' });
  }
});

// Fetch all invoices
router.get('/history', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

module.exports = router;

