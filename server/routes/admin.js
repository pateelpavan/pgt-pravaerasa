const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendPaymentDueReminder } = require('../services/mailer');

// All admin routes require admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/overview
router.get('/overview', (req, res) => {
  try {
    const db = readDb();

    const totalClients = db.users.filter(u => u.role === 'client').length;
    const activeProjects = db.projects.filter(p => p.status !== 'Completed').length;

    let totalRevenue = 0;
    let pendingPayments = 0;

    db.payments.forEach(p => {
      totalRevenue += Number(p.amountPaid) || 0;
      pendingPayments += Number(p.balance) || 0;
    });

    // Recent meetings
    const upcomingMeetings = db.meetings
      .map(m => {
        const client = db.users.find(u => u.id === m.clientId);
        return {
          ...m,
          clientName: client ? client.name : 'Unknown Client',
          company: client ? client.company : 'Unknown Co'
        };
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalClients,
        activeProjects,
        totalRevenue,
        pendingPayments,
        upcomingMeetings,
        totalMeetings: db.meetings.length
      }
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve overview statistics.' });
  }
});

// GET /api/admin/clients
// Returns list of all clients with their assigned project and payment overview
router.get('/clients', (req, res) => {
  try {
    const db = readDb();
    const clients = db.users
      .filter(u => u.role === 'client')
      .map(client => {
        const { password, ...safeClient } = client;
        const project = db.projects.find(p => p.clientId === client.id);
        const payment = db.payments.find(p => p.clientId === client.id);
        const meetingsCount = db.meetings.filter(m => m.clientId === client.id).length;
        const installments = db.installments.filter(i => i.clientId === client.id);

        return {
          ...safeClient,
          project: project || null,
          payment: payment || null,
          meetingsCount,
          installmentsCount: installments.length
        };
      });

    res.json({ success: true, clients });
  } catch (error) {
    console.error('Admin get clients error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve client records.' });
  }
});

// GET /api/admin/client/:id
router.get('/client/:id', (req, res) => {
  try {
    const db = readDb();
    const client = db.users.find(u => u.id === req.params.id && u.role === 'client');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }

    const { password, ...safeClient } = client;
    const project = db.projects.find(p => p.clientId === client.id) || null;
    const payment = db.payments.find(p => p.clientId === client.id) || null;
    const meetings = db.meetings.filter(m => m.clientId === client.id);
    const installments = db.installments.filter(i => i.clientId === client.id);

    res.json({
      success: true,
      client: safeClient,
      project,
      payment,
      meetings,
      installments
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve client details.' });
  }
});

// POST /api/admin/projects - Assign or create project for a client
router.post('/projects', (req, res) => {
  try {
    const { clientId, name, description, status, progress } = req.body;
    if (!clientId || !name) {
      return res.status(400).json({ success: false, message: 'Client ID and Project Name are required.' });
    }

    const db = readDb();
    const client = db.users.find(u => u.id === clientId && u.role === 'client');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }

    let existingProj = db.projects.find(p => p.clientId === clientId);
    if (existingProj) {
      existingProj.name = name;
      existingProj.description = description || existingProj.description;
      existingProj.status = status || existingProj.status;
      existingProj.progress = progress !== undefined ? Math.min(100, Math.max(0, Number(progress))) : existingProj.progress;
      existingProj.lastUpdated = new Date().toISOString();
    } else {
      existingProj = {
        id: `proj_${Date.now()}`,
        clientId,
        name,
        description: description || '',
        status: status || 'In Progress',
        progress: progress !== undefined ? Math.min(100, Math.max(0, Number(progress))) : 0,
        lastUpdated: new Date().toISOString(),
        milestones: []
      };
      db.projects.push(existingProj);
    }

    writeDb(db);
    res.json({ success: true, message: 'Project saved successfully.', project: existingProj });
  } catch (error) {
    console.error('Project save error:', error);
    res.status(500).json({ success: false, message: 'Failed to save project.' });
  }
});

// PUT /api/admin/projects/:id - Update project progress percentage and status
router.put('/projects/:id', (req, res) => {
  try {
    const { name, description, status, progress } = req.body;
    const db = readDb();
    const projIndex = db.projects.findIndex(p => p.id === req.params.id);

    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (name !== undefined) db.projects[projIndex].name = name;
    if (description !== undefined) db.projects[projIndex].description = description;
    if (status !== undefined) db.projects[projIndex].status = status;
    if (progress !== undefined) {
      db.projects[projIndex].progress = Math.min(100, Math.max(0, Number(progress)));
    }
    db.projects[projIndex].lastUpdated = new Date().toISOString();

    writeDb(db);
    res.json({ success: true, message: 'Project updated successfully.', project: db.projects[projIndex] });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
});

// POST /api/admin/projects/:id/milestones - Add milestone
router.post('/projects/:id/milestones', (req, res) => {
  try {
    const { title, date, completed } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Milestone title is required.' });
    }

    const db = readDb();
    const projIndex = db.projects.findIndex(p => p.id === req.params.id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const newMilestone = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      date: date || new Date().toISOString().split('T')[0],
      completed: Boolean(completed)
    };

    if (!Array.isArray(db.projects[projIndex].milestones)) {
      db.projects[projIndex].milestones = [];
    }

    db.projects[projIndex].milestones.push(newMilestone);
    db.projects[projIndex].lastUpdated = new Date().toISOString();

    writeDb(db);
    res.json({ success: true, message: 'Milestone added.', milestone: newMilestone, project: db.projects[projIndex] });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ success: false, message: 'Failed to add milestone.' });
  }
});

// PUT /api/admin/projects/:id/milestones/:mId - Edit or toggle milestone
router.put('/projects/:id/milestones/:mId', (req, res) => {
  try {
    const { title, date, completed } = req.body;
    const db = readDb();
    const projIndex = db.projects.findIndex(p => p.id === req.params.id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const milestoneIndex = db.projects[projIndex].milestones.findIndex(m => m.id === req.params.mId);
    if (milestoneIndex === -1) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }

    if (title !== undefined) db.projects[projIndex].milestones[milestoneIndex].title = title;
    if (date !== undefined) db.projects[projIndex].milestones[milestoneIndex].date = date;
    if (completed !== undefined) db.projects[projIndex].milestones[milestoneIndex].completed = Boolean(completed);

    db.projects[projIndex].lastUpdated = new Date().toISOString();

    writeDb(db);
    res.json({ success: true, message: 'Milestone updated.', project: db.projects[projIndex] });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ success: false, message: 'Failed to update milestone.' });
  }
});

// DELETE /api/admin/projects/:id/milestones/:mId - Delete milestone
router.delete('/projects/:id/milestones/:mId', (req, res) => {
  try {
    const db = readDb();
    const projIndex = db.projects.findIndex(p => p.id === req.params.id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    db.projects[projIndex].milestones = db.projects[projIndex].milestones.filter(m => m.id !== req.params.mId);
    db.projects[projIndex].lastUpdated = new Date().toISOString();

    writeDb(db);
    res.json({ success: true, message: 'Milestone deleted.', project: db.projects[projIndex] });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete milestone.' });
  }
});

// GET /api/admin/meetings - List meetings
router.get('/meetings', (req, res) => {
  try {
    const db = readDb();
    const clientId = req.query.clientId;

    let meetings = db.meetings;
    if (clientId) {
      meetings = meetings.filter(m => m.clientId === clientId);
    }

    const enriched = meetings.map(m => {
      const client = db.users.find(u => u.id === m.clientId);
      return {
        ...m,
        clientName: client ? client.name : 'Unknown',
        company: client ? client.company : 'Unknown'
      };
    });

    enriched.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    res.json({ success: true, meetings: enriched });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve meetings.' });
  }
});

// POST /api/admin/meetings - Upload and schedule meeting for a client
router.post('/meetings', (req, res) => {
  try {
    const { clientId, title, date, time, meetingLink, notes } = req.body;

    if (!clientId || !title || !date || !time) {
      return res.status(400).json({ success: false, message: 'Client, Title, Date, and Time are required.' });
    }

    const db = readDb();
    const client = db.users.find(u => u.id === clientId && u.role === 'client');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }

    const newMeeting = {
      id: `meet_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      clientId,
      title: title.trim(),
      date,
      time,
      meetingLink: meetingLink ? meetingLink.trim() : 'https://meet.google.com/ptg-consultation',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString()
    };

    db.meetings.push(newMeeting);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully.',
      meeting: {
        ...newMeeting,
        clientName: client.name,
        company: client.company
      }
    });
  } catch (error) {
    console.error('Schedule meeting error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule meeting.' });
  }
});

// PUT /api/admin/meetings/:id - Edit meeting
router.put('/meetings/:id', (req, res) => {
  try {
    const { title, date, time, meetingLink, notes, clientId } = req.body;
    const db = readDb();
    const index = db.meetings.findIndex(m => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }

    if (clientId) db.meetings[index].clientId = clientId;
    if (title) db.meetings[index].title = title.trim();
    if (date) db.meetings[index].date = date;
    if (time) db.meetings[index].time = time;
    if (meetingLink !== undefined) db.meetings[index].meetingLink = meetingLink.trim();
    if (notes !== undefined) db.meetings[index].notes = notes.trim();

    writeDb(db);
    res.json({ success: true, message: 'Meeting updated successfully.', meeting: db.meetings[index] });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ success: false, message: 'Failed to update meeting.' });
  }
});

// DELETE /api/admin/meetings/:id - Delete meeting
router.delete('/meetings/:id', (req, res) => {
  try {
    const db = readDb();
    const initialCount = db.meetings.length;
    db.meetings = db.meetings.filter(m => m.id !== req.params.id);

    if (db.meetings.length === initialCount) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }

    writeDb(db);
    res.json({ success: true, message: 'Meeting deleted successfully.' });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete meeting.' });
  }
});

// POST /api/admin/payments/setup
// Set total amount, enable EMI plan, set due dates
router.post('/payments/setup', (req, res) => {
  try {
    const { clientId, totalAmount, dueDates } = req.body;

    if (!clientId || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Client ID and total amount are required.' });
    }

    const total = Number(totalAmount);
    if (isNaN(total) || total <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid total amount.' });
    }

    const db = readDb();
    let payment = db.payments.find(p => p.clientId === clientId);
    const project = db.projects.find(p => p.clientId === clientId);

    // Calculate installment amount (split equally into 3)
    const installmentAmount = Math.round(total / 3);
    const remainder = total - (installmentAmount * 2);

    // Default dates if not provided
    const today = new Date();
    const d1 = dueDates && dueDates[0] ? dueDates[0] : new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0];
    const d2 = dueDates && dueDates[1] ? dueDates[1] : new Date(today.getTime() + 37 * 86400000).toISOString().split('T')[0];
    const d3 = dueDates && dueDates[2] ? dueDates[2] : new Date(today.getTime() + 67 * 86400000).toISOString().split('T')[0];

    // Remove existing installments for this client
    db.installments = db.installments.filter(i => i.clientId !== clientId);

    const paymentId = payment ? payment.id : `pay_${Date.now()}`;

    const newInstallments = [
      {
        id: `inst_${Date.now()}_1`,
        paymentId,
        clientId,
        installmentNumber: 1,
        amount: installmentAmount,
        dueDate: d1,
        paidDate: null,
        status: 'Pending'
      },
      {
        id: `inst_${Date.now()}_2`,
        paymentId,
        clientId,
        installmentNumber: 2,
        amount: installmentAmount,
        dueDate: d2,
        paidDate: null,
        status: 'Pending'
      },
      {
        id: `inst_${Date.now()}_3`,
        paymentId,
        clientId,
        installmentNumber: 3,
        amount: remainder, // Ensures total matches exactly
        dueDate: d3,
        paidDate: null,
        status: 'Pending'
      }
    ];

    if (payment) {
      payment.totalAmount = total;
      payment.amountPaid = 0;
      payment.balance = total;
      payment.emiEnabled = true;
      payment.history = [];
    } else {
      payment = {
        id: paymentId,
        clientId,
        projectId: project ? project.id : null,
        totalAmount: total,
        amountPaid: 0,
        balance: total,
        emiEnabled: true,
        createdAt: new Date().toISOString(),
        history: []
      };
      db.payments.push(payment);
    }

    db.installments.push(...newInstallments);
    writeDb(db);

    res.json({
      success: true,
      message: 'EMI milestone plan configured successfully.',
      payment,
      installments: newInstallments
    });
  } catch (error) {
    console.error('Setup payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to configure payment plan.' });
  }
});

// PUT /api/admin/installments/:id/status
// Mark installment as Paid / Pending / Overdue & update payment totals and history
router.put('/installments/:id/status', (req, res) => {
  try {
    const { status, paidDate } = req.body;
    if (!['Paid', 'Pending', 'Overdue'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Paid, Pending, or Overdue.' });
    }

    const db = readDb();
    const instIndex = db.installments.findIndex(i => i.id === req.params.id);
    if (instIndex === -1) {
      return res.status(404).json({ success: false, message: 'Installment not found.' });
    }

    const inst = db.installments[instIndex];
    const prevStatus = inst.status;
    inst.status = status;

    if (status === 'Paid') {
      inst.paidDate = paidDate || new Date().toISOString().split('T')[0];
    } else {
      inst.paidDate = null;
    }

    // Recalculate payment totals for the client
    const clientInstallments = db.installments.filter(i => i.clientId === inst.clientId);
    const paidSum = clientInstallments
      .filter(i => i.status === 'Paid')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const paymentIndex = db.payments.findIndex(p => p.clientId === inst.clientId);
    if (paymentIndex !== -1) {
      db.payments[paymentIndex].amountPaid = paidSum;
      db.payments[paymentIndex].balance = Math.max(0, db.payments[paymentIndex].totalAmount - paidSum);

      // If newly marked paid, append to history
      if (status === 'Paid' && prevStatus !== 'Paid') {
        db.payments[paymentIndex].history.push({
          id: `tx_${Date.now()}`,
          date: inst.paidDate,
          amount: inst.amount,
          method: 'Admin Verification / Portal Receipt',
          status: 'Completed',
          receiptNo: `PTG-EMI-${inst.installmentNumber}-${Date.now().toString().slice(-4)}`
        });
      }
    }

    writeDb(db);
    res.json({
      success: true,
      message: `Installment #${inst.installmentNumber} marked as ${status}.`,
      installment: inst,
      payment: paymentIndex !== -1 ? db.payments[paymentIndex] : null
    });
  } catch (error) {
    console.error('Update installment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update installment.' });
  }
});

// POST /api/admin/send-payment-due-email - Dispatch branded payment due reminder with dynamic anti-spam subject
router.post('/send-payment-due-email', async (req, res) => {
  try {
    const { clientId, installmentId, customNote } = req.body;
    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required.' });
    }

    const db = readDb();
    const client = db.users.find(u => u.id === clientId && u.role === 'client');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }

    const project = db.projects.find(p => p.clientId === client.id);
    const payment = db.payments.find(p => p.clientId === client.id);
    const clientInstallments = db.installments.filter(i => i.clientId === client.id);

    // Identify target installment
    let targetInstallment = null;
    if (installmentId) {
      targetInstallment = clientInstallments.find(i => i.id === installmentId);
    }
    if (!targetInstallment) {
      // Find first Overdue or Pending installment
      targetInstallment = clientInstallments.find(i => i.status === 'Overdue') ||
                          clientInstallments.find(i => i.status === 'Pending') ||
                          clientInstallments[0];
    }

    const amount = targetInstallment ? targetInstallment.amount : (payment ? payment.balance : 0);
    const installmentNumber = targetInstallment ? targetInstallment.installmentNumber : 1;
    const dueDate = targetInstallment ? targetInstallment.dueDate : new Date().toISOString().split('T')[0];
    const status = targetInstallment ? targetInstallment.status : 'Pending';

    // Dispatch email
    const emailResult = await sendPaymentDueReminder({
      clientEmail: client.email,
      clientName: client.name,
      company: client.company,
      projectName: project ? project.name : 'Digital Initiative',
      installmentNumber,
      amount,
      dueDate,
      status,
      totalAmount: payment ? payment.totalAmount : amount,
      amountPaid: payment ? payment.amountPaid : 0,
      balance: payment ? payment.balance : amount,
      portalUrl: `${req.protocol}://${req.get('host')}/login`,
      customNote
    });

    // Record notice in payment history for audit logging
    if (payment) {
      const paymentIndex = db.payments.findIndex(p => p.clientId === client.id);
      if (paymentIndex !== -1) {
        db.payments[paymentIndex].history = db.payments[paymentIndex].history || [];
        db.payments[paymentIndex].history.push({
          id: `notice_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: amount,
          method: 'Email Notice Sent (pgtpaverasa3@gmail.com)',
          status: 'Notice Dispatched',
          receiptNo: emailResult.refId
        });
        writeDb(db);
      }
    }

    res.json({
      success: true,
      message: `Due payment reminder sent to ${client.email} with Ref #${emailResult.refId}!`,
      subject: emailResult.subject,
      refId: emailResult.refId,
      recipient: client.email
    });
  } catch (error) {
    console.error('Send payment due email error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to dispatch email: ${error.message}`
    });
  }
});

module.exports = router;
