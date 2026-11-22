const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const ADMIN_LOGIN_ID = process.env.ADMIN_LOGIN_ID || 'PAVERASAPVTLTD';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Paverasa@@.PVTLTD';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, company, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !phone || !company || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const db = readDb();

    // Check if email already registered
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      password: hashedPassword,
      role: 'client',
      createdAt: new Date().toISOString()
    };

    // Create an initial starter project for the client
    const newProject = {
      id: `proj_${Date.now()}`,
      clientId: newUser.id,
      name: `${newUser.company} Digital Initiative`,
      description: 'Initial consultation and discovery phase for bespoke software development.',
      status: 'Planning',
      progress: 10,
      lastUpdated: new Date().toISOString(),
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Client Onboarding & Requirement Gathering', completed: true, date: new Date().toISOString().split('T')[0] },
        { id: `m_${Date.now()}_2`, title: 'Technical Architecture & Scope Finalization', completed: false, date: '' },
        { id: `m_${Date.now()}_3`, title: 'MVP Development & Core Sprint', completed: false, date: '' }
      ]
    };

    // Create initial payment record (in Indian Rupees)
    const newPayment = {
      id: `pay_${Date.now()}`,
      clientId: newUser.id,
      projectId: newProject.id,
      totalAmount: 90000,
      amountPaid: 0,
      balance: 90000,
      emiEnabled: true,
      createdAt: new Date().toISOString(),
      history: []
    };

    // Split into equal EMI installments
    const installmentAmount = Math.round(90000 / 3);
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(d1.getDate() + 7);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() + 37);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() + 67);

    const newInstallments = [
      {
        id: `inst_${Date.now()}_1`,
        paymentId: newPayment.id,
        clientId: newUser.id,
        installmentNumber: 1,
        amount: installmentAmount,
        dueDate: d1.toISOString().split('T')[0],
        paidDate: null,
        status: 'Pending'
      },
      {
        id: `inst_${Date.now()}_2`,
        paymentId: newPayment.id,
        clientId: newUser.id,
        installmentNumber: 2,
        amount: installmentAmount,
        dueDate: d2.toISOString().split('T')[0],
        paidDate: null,
        status: 'Pending'
      },
      {
        id: `inst_${Date.now()}_3`,
        paymentId: newPayment.id,
        clientId: newUser.id,
        installmentNumber: 3,
        amount: installmentAmount,
        dueDate: d3.toISOString().split('T')[0],
        paidDate: null,
        status: 'Pending'
      }
    ];

    db.users.push(newUser);
    db.projects.push(newProject);
    db.payments.push(newPayment);
    db.installments.push(...newInstallments);

    writeDb(db);

    // Generate token
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        company: newUser.company,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        company: newUser.company,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
// Universal login: checks hidden admin credentials first, then checks client database
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email / ID and password are required.' });
    }

    const trimmedIdentifier = email.trim();

    // 1. Check for Hidden Admin Credentials
    if (trimmedIdentifier === ADMIN_LOGIN_ID && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin_master_1',
        name: 'Paverasa SuperAdmin',
        email: 'admin@paverasatechgrowth.com',
        role: 'admin',
        company: 'Paverasa Private Limited'
      };

      const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        success: true,
        message: 'Admin access verified.',
        token,
        user: adminUser
      });
    }

    // 2. Check for Client Login
    const db = readDb();
    const clientUser = db.users.find(u => u.email.toLowerCase() === trimmedIdentifier.toLowerCase());

    if (!clientUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, clientUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const token = jwt.sign(
      {
        id: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        company: clientUser.company,
        role: clientUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        phone: clientUser.phone,
        company: clientUser.company,
        role: clientUser.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({
      success: true,
      user: req.user
    });
  }

  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { password, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin master password cannot be changed via client portal.' });
    }

    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User record not found.' });
    }

    const user = db.users[userIndex];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match our records.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    db.users[userIndex].password = hashed;
    writeDb(db);

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Error updating password.' });
  }
});

module.exports = router;
