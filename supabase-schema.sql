-- ==============================================================================
-- PAVERASA TECH GROWTH (PTG) - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Brand of Paverasa Private Limited
-- Headquarters: Middletown, A504, Medchal, Telangana | pgtpaverasa3@gmail.com
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT ('usr_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT ('proj_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  client_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'In Progress' CHECK (status IN ('Planning', 'In Progress', 'In Review', 'Completed', 'On Hold')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  milestones JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEETINGS TABLE
CREATE TABLE IF NOT EXISTS public.meetings (
  id TEXT PRIMARY KEY DEFAULT ('meet_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  client_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  meeting_link TEXT NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS TABLE (All figures in Indian Rupees - ₹ INR)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  client_id TEXT NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 150000.00,
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 150000.00,
  emi_enabled BOOLEAN DEFAULT TRUE,
  history JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INSTALLMENTS TABLE (Flexible Milestone EMI)
CREATE TABLE IF NOT EXISTS public.installments (
  id TEXT PRIMARY KEY DEFAULT ('inst_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  client_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON public.meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_installments_client_id ON public.installments(client_id);

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 10. RLS POLICIES (Client isolation & Service Role access)
-- Users can read their own profile
CREATE POLICY "Clients read self" ON public.users
  FOR SELECT USING (auth.uid()::text = id OR role = 'admin');

-- Projects: client reads own project
CREATE POLICY "Client read own project" ON public.projects
  FOR SELECT USING (auth.uid()::text = client_id);

-- Meetings: client reads own meetings
CREATE POLICY "Client read own meetings" ON public.meetings
  FOR SELECT USING (auth.uid()::text = client_id);

-- Payments: client reads own payments
CREATE POLICY "Client read own payment" ON public.payments
  FOR SELECT USING (auth.uid()::text = client_id);

-- Installments: client reads own installments
CREATE POLICY "Client read own installments" ON public.installments
  FOR SELECT USING (auth.uid()::text = client_id);

-- Service role bypasses all RLS automatically.

-- 11. INITIAL SEED DATA (Indian Rupee Currency - ₹ INR)
-- Default Demo Client: rahul@apexinnovations.in / password
INSERT INTO public.users (id, name, email, phone, company, password_hash, role)
VALUES (
  'usr_seed_rahul',
  'Rahul Sharma',
  'rahul@apexinnovations.in',
  '+91 7416472177',
  'Apex Innovations Pvt Ltd',
  '$2a$10$wK1F5lZzH/lBf7eBf0o3uOxv8lFq3w.lHwU8Ff2kQ7lJ1sX6aT5O.',
  'client'
) ON CONFLICT (email) DO NOTHING;

-- Initial Project for Rahul Sharma
INSERT INTO public.projects (id, client_id, name, description, status, progress, milestones)
VALUES (
  'proj_seed_apex',
  'usr_seed_rahul',
  'Enterprise Supply Chain Distributed Architecture',
  'Cloud-native event-driven microservices with live tracking dashboard and SLA monitoring.',
  'In Progress',
  65,
  '[
    {"id": "m1", "title": "System Architecture & Threat Modeling", "status": "Completed", "date": "2026-03-15"},
    {"id": "m2", "title": "Real-Time Telemetry & Kafka Stream Pipeline", "status": "Completed", "date": "2026-04-10"},
    {"id": "m3", "title": "Interactive Client Portal & Automated EMI Engine", "status": "In Progress", "date": "2026-05-01"},
    {"id": "m4", "title": "SOC2 Compliance & Production Deployment", "status": "Pending", "date": "2026-06-01"}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Initial Payment Contract for Rahul Sharma (₹1,50,000 INR)
INSERT INTO public.payments (id, client_id, total_amount, amount_paid, balance, emi_enabled, history)
VALUES (
  'pay_seed_apex',
  'usr_seed_rahul',
  150000.00,
  60000.00,
  90000.00,
  TRUE,
  '[
    {"id": "tx_seed_01", "date": "2026-03-15", "amount": 60000.00, "status": "Completed", "method": "NEFT Corporate Transfer", "receiptNo": "PTG-REC-2026-01"}
  ]'::jsonb
) ON CONFLICT (client_id) DO NOTHING;

-- Initial Milestone Installments for Rahul Sharma (₹50,000 each)
INSERT INTO public.installments (id, client_id, installment_number, amount, due_date, paid_date, status)
VALUES
  ('inst_seed_01', 'usr_seed_rahul', 1, 50000.00, '2026-03-15', '2026-03-15', 'Paid'),
  ('inst_seed_02', 'usr_seed_rahul', 2, 50000.00, '2026-04-15', NULL, 'Pending'),
  ('inst_seed_03', 'usr_seed_rahul', 3, 50000.00, '2026-05-15', NULL, 'Pending')
ON CONFLICT (id) DO NOTHING;
