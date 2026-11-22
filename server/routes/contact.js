const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');

// POST /api/contact - Submit contact form
router.post('/', (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const db = readDb();
    if (!Array.isArray(db.contacts)) {
      db.contacts = [];
    }

    const newContact = {
      id: `cnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    db.contacts.push(newContact);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our team will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit contact message.' });
  }
});

// GET /api/contact - (admin or internal view)
router.get('/', (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, contacts: db.contacts || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load inquiries.' });
  }
});

module.exports = router;
