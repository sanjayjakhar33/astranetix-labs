// models/AdminUser.js
const db = require('../db');  // MySQL connection from db.js

// Function to create a new AdminUser
async function createAdminUser(email, password) {
  try {
    const [result] = await db.execute(
      'INSERT INTO admins (email, password) VALUES (?, ?)', 
      [email, password]
    );
    return result;
  } catch (err) {
    throw new Error('Error creating admin user');
  }
}

// Function to fetch an AdminUser by email
async function getAdminUserByEmail(email) {
  try {
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    return rows;
  } catch (err) {
    throw new Error('Error fetching admin user');
  }
}

module.exports = { createAdminUser, getAdminUserByEmail };
