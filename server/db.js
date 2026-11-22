const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const demoPasswordHash = bcrypt.hashSync('Client@123', salt);

  const defaultClients = [
    {
      id: 'usr_client_1',
      name: 'Alexander Wright',
      email: 'alex.wright@quantumedge.io',
      phone: '+91 98765 43210',
      company: 'QuantumEdge Technologies',
      password: demoPasswordHash,
      role: 'client',
      createdAt: '2026-02-10T10:00:00.000Z'
    },
    {
      id: 'usr_client_2',
      name: 'Sophia Patel',
      email: 'sophia@luminahealth.com',
      phone: '+91 98112 33445',
      company: 'Lumina Digital Health',
      password: demoPasswordHash,
      role: 'client',
      createdAt: '2026-02-15T14:30:00.000Z'
    },
    {
      id: 'usr_client_3',
      name: 'Marcus Vance',
      email: 'm.vance@aetherlogistics.com',
      phone: '+91 97234 56789',
      company: 'Aether Supply Chain',
      password: demoPasswordHash,
      role: 'client',
      createdAt: '2026-03-01T09:15:00.000Z'
    }
  ];

  const defaultProjects = [
    {
      id: 'proj_1',
      clientId: 'usr_client_1',
      name: 'QuantumEdge Enterprise Cloud Platform',
      description: 'End-to-end full stack web architecture with microservices, real-time analytics dashboard, and automated DevOps deployment pipeline.',
      status: 'In Progress',
      progress: 68,
      lastUpdated: '2026-11-20T16:00:00.000Z',
      milestones: [
        { id: 'm_101', title: 'System Architecture & Database Schema Design', completed: true, date: '2026-02-25' },
        { id: 'm_102', title: 'Core RESTful & GraphQL Microservices Setup', completed: true, date: '2026-04-12' },
        { id: 'm_103', title: 'Responsive Client Dashboard & Data Visualizations', completed: true, date: '2026-07-30' },
        { id: 'm_104', title: 'Integration Testing & Performance Load Audits', completed: false, date: '2026-12-05' },
        { id: 'm_105', title: 'Final Production Deployment & SLA Handover', completed: false, date: '2026-12-28' }
      ]
    },
    {
      id: 'proj_2',
      clientId: 'usr_client_2',
      name: 'Lumina Patient Telehealth Mobile & Web Suite',
      description: 'HIPAA-compliant telemedicine booking, encrypted video consultations, and real-time biometric vitals tracking.',
      status: 'In Progress',
      progress: 45,
      lastUpdated: '2026-11-18T11:20:00.000Z',
      milestones: [
        { id: 'm_201', title: 'Wireframes, UX Research & Interactive Prototypes', completed: true, date: '2026-03-10' },
        { id: 'm_202', title: 'HIPAA compliant authentication & Auth0 integrations', completed: true, date: '2026-05-20' },
        { id: 'm_203', title: 'WebRTC Video Conferencing & Doctor Portal', completed: false, date: '2026-12-15' },
        { id: 'm_204', title: 'iOS & Android App Store Submissions', completed: false, date: '2027-01-20' }
      ]
    },
    {
      id: 'proj_3',
      clientId: 'usr_client_3',
      name: 'Aether Real-Time Fleet & Dispatch Tracker',
      description: 'IoT sensor ingestion pipeline, fleet tracking map interface, and automated dispatch management software.',
      status: 'Planning',
      progress: 20,
      lastUpdated: '2026-11-15T09:45:00.000Z',
      milestones: [
        { id: 'm_301', title: 'Project Scope, Architecture & Technology Selection', completed: true, date: '2026-03-20' },
        { id: 'm_302', title: 'GPS Ingestion Microservice & WebSockets', completed: false, date: '2026-12-10' },
        { id: 'm_303', title: 'Fleet UI & Geospatial Mapping Interface', completed: false, date: '2027-01-15' }
      ]
    }
  ];

  const defaultMeetings = [
    {
      id: 'meet_1',
      clientId: 'usr_client_1',
      title: 'Sprint 14 Review & Architecture Demo',
      date: '2026-11-25',
      time: '14:30',
      meetingLink: 'https://meet.google.com/ptg-arch-demo',
      notes: 'Demonstrating cloud microservices throughput, data pipeline benchmarks, and collecting sprint feedback.',
      createdAt: '2026-11-15T08:00:00.000Z'
    },
    {
      id: 'meet_2',
      clientId: 'usr_client_1',
      title: 'Security Compliance & SLA Handover Briefing',
      date: '2026-12-08',
      time: '11:00',
      meetingLink: 'https://meet.google.com/ptg-sec-audit',
      notes: 'Reviewing penetration test reports, SSL certs, and backup recovery protocols with the security team.',
      createdAt: '2026-11-16T12:00:00.000Z'
    },
    {
      id: 'meet_3',
      clientId: 'usr_client_2',
      title: 'Telehealth Video Integration Walkthrough',
      date: '2026-11-28',
      time: '16:00',
      meetingLink: 'https://meet.google.com/ptg-lumina-webrtc',
      notes: 'Testing low-latency video feeds and doctor appointment queue management.',
      createdAt: '2026-11-10T10:00:00.000Z'
    },
    {
      id: 'meet_4',
      clientId: 'usr_client_3',
      title: 'Fleet IoT Dispatch Kickoff Session',
      date: '2026-12-02',
      time: '10:30',
      meetingLink: 'https://meet.google.com/ptg-aether-fleet',
      notes: 'Finalizing hardware protocols and API endpoint schema definitions.',
      createdAt: '2026-11-14T11:00:00.000Z'
    }
  ];

  // Currency amounts in Indian Rupees (₹)
  const defaultPayments = [
    {
      id: 'pay_1',
      clientId: 'usr_client_1',
      projectId: 'proj_1',
      totalAmount: 150000,
      amountPaid: 100000,
      balance: 50000,
      emiEnabled: true,
      createdAt: '2026-02-15T10:00:00.000Z',
      history: [
        {
          id: 'tx_101',
          date: '2026-03-01',
          amount: 50000,
          method: 'IMPS / UPI NetBanking',
          status: 'Completed',
          receiptNo: 'PTG-REC-2026-0041'
        },
        {
          id: 'tx_102',
          date: '2026-07-01',
          amount: 50000,
          method: 'NEFT Corporate Transfer',
          status: 'Completed',
          receiptNo: 'PTG-REC-2026-0189'
        }
      ]
    },
    {
      id: 'pay_2',
      clientId: 'usr_client_2',
      projectId: 'proj_2',
      totalAmount: 180000,
      amountPaid: 60000,
      balance: 120000,
      emiEnabled: true,
      createdAt: '2026-02-20T10:00:00.000Z',
      history: [
        {
          id: 'tx_201',
          date: '2026-03-05',
          amount: 60000,
          method: 'Corporate Bank Transfer',
          status: 'Completed',
          receiptNo: 'PTG-REC-2026-0056'
        }
      ]
    },
    {
      id: 'pay_3',
      clientId: 'usr_client_3',
      projectId: 'proj_3',
      totalAmount: 120000,
      amountPaid: 40000,
      balance: 80000,
      emiEnabled: true,
      createdAt: '2026-03-05T10:00:00.000Z',
      history: [
        {
          id: 'tx_301',
          date: '2026-03-10',
          amount: 40000,
          method: 'RTGS Transfer',
          status: 'Completed',
          receiptNo: 'PTG-REC-2026-0072'
        }
      ]
    }
  ];

  // EMI Installment schedules (in Indian Rupees)
  const defaultInstallments = [
    // Client 1 (Total: ₹1,50,000 -> EMI installments of ₹50,000)
    {
      id: 'inst_101',
      paymentId: 'pay_1',
      clientId: 'usr_client_1',
      installmentNumber: 1,
      amount: 50000,
      dueDate: '2026-03-01',
      paidDate: '2026-03-01',
      status: 'Paid'
    },
    {
      id: 'inst_102',
      paymentId: 'pay_1',
      clientId: 'usr_client_1',
      installmentNumber: 2,
      amount: 50000,
      dueDate: '2026-07-01',
      paidDate: '2026-07-01',
      status: 'Paid'
    },
    {
      id: 'inst_103',
      paymentId: 'pay_1',
      clientId: 'usr_client_1',
      installmentNumber: 3,
      amount: 50000,
      dueDate: '2026-12-15',
      paidDate: null,
      status: 'Pending'
    },
    // Client 2 (Total: ₹1,80,000 -> EMI installments of ₹60,000)
    {
      id: 'inst_201',
      paymentId: 'pay_2',
      clientId: 'usr_client_2',
      installmentNumber: 1,
      amount: 60000,
      dueDate: '2026-03-05',
      paidDate: '2026-03-05',
      status: 'Paid'
    },
    {
      id: 'inst_202',
      paymentId: 'pay_2',
      clientId: 'usr_client_2',
      installmentNumber: 2,
      amount: 60000,
      dueDate: '2026-08-05',
      paidDate: null,
      status: 'Overdue'
    },
    {
      id: 'inst_203',
      paymentId: 'pay_2',
      clientId: 'usr_client_2',
      installmentNumber: 3,
      amount: 60000,
      dueDate: '2026-12-20',
      paidDate: null,
      status: 'Pending'
    },
    // Client 3 (Total: ₹1,20,000 -> EMI installments of ₹40,000)
    {
      id: 'inst_301',
      paymentId: 'pay_3',
      clientId: 'usr_client_3',
      installmentNumber: 1,
      amount: 40000,
      dueDate: '2026-03-10',
      paidDate: '2026-03-10',
      status: 'Paid'
    },
    {
      id: 'inst_302',
      paymentId: 'pay_3',
      clientId: 'usr_client_3',
      installmentNumber: 2,
      amount: 40000,
      dueDate: '2026-11-30',
      paidDate: null,
      status: 'Pending'
    },
    {
      id: 'inst_303',
      paymentId: 'pay_3',
      clientId: 'usr_client_3',
      installmentNumber: 3,
      amount: 40000,
      dueDate: '2027-02-15',
      paidDate: null,
      status: 'Pending'
    }
  ];

  const defaultContacts = [
    {
      id: 'cnt_1',
      name: 'Rohan Deshmukh',
      email: 'rohan@deshmukhventures.in',
      phone: '+91 99887 76655',
      message: 'Looking for a dedicated tech partner to engineer a high-throughput financial analysis application with Next.js and Python.',
      createdAt: '2026-11-21T08:30:00.000Z',
      status: 'New'
    }
  ];

  return {
    users: defaultClients,
    projects: defaultProjects,
    meetings: defaultMeetings,
    payments: defaultPayments,
    installments: defaultInstallments,
    contacts: defaultContacts
  };
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, recovering with initial state:', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing to database file:', err);
    throw err;
  }
}

// Reset/reseed database with the updated Indian Rupee values
const initial = getInitialData();
fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');

module.exports = {
  readDb,
  writeDb
};
