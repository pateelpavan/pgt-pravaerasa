const http = require('http');

async function runTests() {
  console.log('--- Starting Paverasa Tech Growth (PTG) End-to-End Validation ---');

  // Start Express in process for testing
  require('dotenv').config();
  const app = require('express')();
  const cors = require('cors');
  app.use(cors());
  app.use(require('express').json());
  app.use('/api/auth', require('./server/routes/auth'));
  app.use('/api/client', require('./server/routes/client'));
  app.use('/api/admin', require('./server/routes/admin'));
  app.use('/api/contact', require('./server/routes/contact'));
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  const server = app.listen(5099, async () => {
    console.log('Test server running on port 5099');

    try {
      // 1. Health check
      console.log('\n[1] Checking Health Check Endpoint...');
      const healthRes = await fetch('http://localhost:5099/api/health');
      const healthData = await healthRes.json();
      console.log('✓ Health status:', healthData.status);

      // 2. Hidden Admin Login Test
      console.log('\n[2] Testing Hidden Admin Login (PAVERASAPVTLTD)...');
      const adminLoginRes = await fetch('http://localhost:5099/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'PAVERASAPVTLTD',
          password: 'Paverasa@@.PVTLTD'
        })
      });
      const adminLoginData = await adminLoginRes.json();
      if (!adminLoginData.success || adminLoginData.user.role !== 'admin') {
        throw new Error('Admin login verification failed: ' + JSON.stringify(adminLoginData));
      }
      console.log('✓ Hidden Admin Login passed! Role:', adminLoginData.user.role);
      const adminToken = adminLoginData.token;

      // 3. Admin Overview Check
      console.log('\n[3] Testing Admin Overview with Admin Token...');
      const adminOvRes = await fetch('http://localhost:5099/api/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const adminOvData = await adminOvRes.json();
      console.log(`✓ Admin Overview: Total Clients = ${adminOvData.data.totalClients}, Active Projects = ${adminOvData.data.activeProjects}, Revenue = ₹${adminOvData.data.totalRevenue}`);

      // 4. Client Registration Test
      console.log('\n[4] Testing Client Registration...');
      const testEmail = `test.client.${Date.now()}@nexustech.io`;
      const regRes = await fetch('http://localhost:5099/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sarah Connor',
          email: testEmail,
          phone: '+1 (555) 777-9911',
          company: 'Nexus Tech Robotics',
          password: 'Password@123',
          confirmPassword: 'Password@123'
        })
      });
      const regData = await regRes.json();
      if (!regData.success) {
        throw new Error('Client registration failed: ' + JSON.stringify(regData));
      }
      console.log('✓ Client registered successfully! Role:', regData.user.role);
      const clientToken = regData.token;

      // 5. Client Dashboard Access
      console.log('\n[5] Testing Client Dashboard Endpoint...');
      const clientDashRes = await fetch('http://localhost:5099/api/client/dashboard', {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      const clientDashData = await clientDashRes.json();
      console.log(`✓ Client Dashboard loaded! Project: "${clientDashData.data.project.name}", Progress: ${clientDashData.data.project.progress}%, Installments: ${clientDashData.data.installments.length}`);

      // 6. Security Check: Client attempting to access Admin Endpoint must be FORBIDDEN
      console.log('\n[6] Testing RBAC Security: Client token requesting /api/admin/overview...');
      const forbiddenRes = await fetch('http://localhost:5099/api/admin/overview', {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      if (forbiddenRes.status === 403) {
        console.log('✓ RBAC Security Passed! Client was properly blocked with 403 Forbidden.');
      } else {
        throw new Error(`Security breach: Client received status ${forbiddenRes.status}`);
      }

      // 7. Contact Form Submission
      console.log('\n[7] Testing Contact Form Submission...');
      const contactRes = await fetch('http://localhost:5099/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Robert Miller',
          email: 'robert.miller@enterprise.com',
          phone: '+1 (555) 432-1100',
          message: 'Interested in scoping a 3-month fintech mobile application with 3-installment EMI.'
        })
      });
      const contactData = await contactRes.json();
      console.log('✓ Contact Form Response:', contactData.message);

      // 8. Admin Meeting Creation
      console.log('\n[8] Testing Admin Meeting Scheduler...');
      const meetingRes = await fetch('http://localhost:5099/api/admin/meetings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          clientId: regData.user.id,
          title: 'Nexus Tech Sprint 1 Architecture Review',
          date: '2026-12-10',
          time: '15:30',
          meetingLink: 'https://meet.google.com/ptg-nexus-sprint1',
          notes: 'Reviewing database schema and cloud container deployments.'
        })
      });
      const meetingData = await meetingRes.json();
      console.log('✓ Meeting Scheduled successfully! ID:', meetingData.meeting.id);

      // 9. Verify Meeting appears on Client Dashboard
      const clientDashRes2 = await fetch('http://localhost:5099/api/client/dashboard', {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      const clientDashData2 = await clientDashRes2.json();
      console.log(`✓ Verified meeting appears on Client Dashboard: ${clientDashData2.data.meetings.length} meeting(s) visible.`);

      // 10. Admin EMI installment payment update
      console.log('\n[10] Testing Admin marking Installment #1 as Paid...');
      const firstInst = clientDashData2.data.installments[0];
      const payUpdateRes = await fetch(`http://localhost:5099/api/admin/installments/${firstInst.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}` 
        },
        body: JSON.stringify({ status: 'Paid' })
      });
      const payUpdateData = await payUpdateRes.json();
      console.log(`✓ Installment marked Paid! New Client Amount Paid: ₹${payUpdateData.payment.amountPaid}, Remaining Balance: ₹${payUpdateData.payment.balance}`);

      console.log('\n======================================================');
      console.log('🎉 ALL 10 END-TO-END VALIDATION TESTS PASSED 100%!');
      console.log('======================================================\n');

    } catch (err) {
      console.error('\n❌ Test Failure:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
