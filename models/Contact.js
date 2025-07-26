// models/Contact.js
const db = require('../db');  // MySQL connection from db.js

// Function to create a new contact message
async function createContact(name, email, message) {
  try {
    const [result] = await db.execute(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', 
      [name, email, message]
    );
    return result;
  } catch (err) {
    throw new Error('Error creating contact');
  }
}

// Function to fetch all contact messages (for admin)
async function getAllContacts() {
  try {
    const [rows] = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  } catch (err) {
    throw new Error('Error fetching contacts');
  }
}

module.exports = { createContact, getAllContacts };
