// models/Invoice.js
const db = require('../db');  // MySQL connection from db.js

// Function to create a new invoice
async function createInvoice(clientName, clientCompany, items, total, gst, grandTotal) {
  try {
    const [result] = await db.execute(
      'INSERT INTO invoices (clientName, clientCompany, items, total, gst, grandTotal) VALUES (?, ?, ?, ?, ?, ?)', 
      [clientName, clientCompany, JSON.stringify(items), total, gst, grandTotal]
    );
    return result;
  } catch (err) {
    throw new Error('Error creating invoice');
  }
}

// Function to fetch all invoices (for admin)
async function getAllInvoices() {
  try {
    const [rows] = await db.execute('SELECT * FROM invoices ORDER BY created_at DESC');
    return rows;
  } catch (err) {
    throw new Error('Error fetching invoices');
  }
}

module.exports = { createInvoice, getAllInvoices };
