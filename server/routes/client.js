const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');
const { authenticateToken, requireClient } = require('../middleware/auth');

// Apply authentication & client role check to all client endpoints
router.use(authenticateToken, requireClient);

// GET /api/client/dashboard
// Returns all data for the authenticated client's dashboard
router.get('/dashboard', (req, res) => {
  try {
    const clientId = req.user.id;
    const db = readDb();

    // User details
    const user = db.users.find(u => u.id === clientId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Client profile not found.' });
    }
    const { password, ...clientProfile } = user;

    // Project details
    const project = db.projects.find(p => p.clientId === clientId) || {
      id: null,
      name: 'No Active Project',
      description: 'Your project is being scoped by our engineering leads.',
      status: 'Pending Assignment',
      progress: 0,
      lastUpdated: new Date().toISOString(),
      milestones: []
    };

    // Scheduled Meetings (Clients can only view)
    const meetings = db.meetings
      .filter(m => m.clientId === clientId)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    // Payment & EMI Details
    const payment = db.payments.find(p => p.clientId === clientId) || {
      id: null,
      totalAmount: 0,
      amountPaid: 0,
      balance: 0,
      emiEnabled: false,
      history: []
    };

    // Milestone EMI schedule
    const installments = db.installments
      .filter(i => i.clientId === clientId)
      .sort((a, b) => a.installmentNumber - b.installmentNumber);

    res.json({
      success: true,
      data: {
        profile: clientProfile,
        project,
        meetings,
        payment,
        installments
      }
    });
  } catch (error) {
    console.error('Error fetching client dashboard:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve client dashboard.' });
  }
});

// PUT /api/client/profile
// Updates client contact info
router.put('/profile', (req, res) => {
  try {
    const clientId = req.user.id;
    const { name, phone, company } = req.body;

    const db = readDb();
    const index = db.users.findIndex(u => u.id === clientId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }

    if (name) db.users[index].name = name.trim();
    if (phone) db.users[index].phone = phone.trim();
    if (company) db.users[index].company = company.trim();

    writeDb(db);

    const { password, ...safeUser } = db.users[index];
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: safeUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

module.exports = router;
