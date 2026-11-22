# Paverasa Tech Growth (PTG)

> **PTG, a brand of Paverasa Private Limited.**  
> Elite Engineering & Freelance Technology Execution Platform.

---

## 🎨 Theme & Design Philosophy

- **Color Palette**: Light theme with clean white (`#FFFFFF`), soft background (`#F8FAFC`), energetic orange (`#EA580C`, `#F97316`, `#FB923C`), and amber highlights.
- **Currency**: All financials are denominated in **Indian Rupees (₹ INR)** with standard Indian numbering formatting (`en-IN`).
- **Flexible EMI Financing**: Project investments are distributed through milestone-based **EMI plans** tied directly to verified deliverables.
- **Cinematic Splash Screen**: Powered by the WebGL fragment shader **Prism Comet Preloader** (`/components/ui/prism-comet-preloader.tsx`) featuring an energetic ember/orange light gate.

---

## 📂 Project Structure & shadcn Architecture

This project is organized following standard **shadcn** and modern React architectural conventions:

```
PGT/
├── package.json                   # Root package configuration
├── .env                           # Environment secrets (Port, JWT Secret, Admin Credentials)
├── server/                        # Node.js + Express Backend Engine
│   ├── index.js                   # Server entry point & static SPA delivery
│   ├── db.js                      # Persistent database layer (JSON store with initial seeds)
│   ├── data/                      # Persistent storage directory (db.json)
│   ├── middleware/                # JWT Authentication & Role-Based Access Control (RBAC)
│   │   └── auth.js
│   └── routes/                    # RESTful API Endpoints
│       ├── auth.js                # Universal login, client registration, password change
│       ├── client.js              # Client dashboard, milestones, payments, meetings
│       ├── admin.js               # Admin overview, project scoping, meeting & EMI scheduler
│       └── contact.js             # Public contact inquiry handling
└── client/                        # React + Vite Frontend
    ├── index.html                 # HTML shell with Google Fonts & favicon
    ├── vite.config.js             # Vite configuration with @/ path alias & API proxy
    ├── tsconfig.json              # TypeScript configuration supporting shadcn paths
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Light-themed navigation with Splash trigger
    │   │   ├── Footer.jsx         # Footer with mandatory copyright notice
    │   │   ├── PaymentCalendar.jsx # Interactive EMI due date & paid date calendar (₹ INR)
    │   │   ├── MeetingCalendar.jsx # Scheduled meetings list & calendar view
    │   │   └── ui/                # Standard shadcn UI component directory
    │   │       ├── prism-comet-preloader.tsx  # WebGL Splash Screen Preloader
    │   │       └── demo.tsx                   # Ember showcase demo
    │   ├── context/
    │   │   └── AuthContext.jsx    # Session management & role-based routing
    │   ├── pages/
    │   │   ├── HomePage.jsx       # Hero, Services, 4-step How We Work, Why Choose Us, CTA
    │   │   ├── AboutPage.jsx      # Story, Mission, Vision, and Leadership Team
    │   │   ├── ContactPage.jsx    # Validated contact form, headquarters info
    │   │   ├── LoginPage.jsx      # Universal login form (Client & Hidden Admin)
    │   │   ├── RegisterPage.jsx   # Validated client registration
    │   │   ├── client/
    │   │   │   └── ClientDashboard.jsx # Project progress, meetings, EMI, calendar, profile
    │   │   └── admin/
    │   │       └── AdminDashboard.jsx  # Overview cards, client, project, meetings, EMI
    │   ├── services/
    │   │   └── api.js             # Centralized fetch client with JWT token injection
    │   ├── App.jsx                # Router, protected routes, and splash gate wrapper
    │   └── index.css              # Tailwind CSS v4 styling & light theme variables
```

---

## 🛠️ shadcn, Tailwind & TypeScript Support

### Why the `/components/ui` Folder is Important
- In standard **shadcn/ui** architecture, `/components/ui` is the designated directory for low-level, reusable primitive components (e.g. buttons, dialogs, inputs, preloaders).
- By placing primitives like `prism-comet-preloader.tsx` inside `/components/ui`, high-level application views and layouts can import them using clean, predictable path aliases (e.g. `@/components/ui/prism-comet-preloader`).

### How to Initialize shadcn CLI (if adding more components):
```bash
cd client
npx shadcn@latest init
```
When prompted:
- **Style**: Default
- **Base color**: Neutral / Slate
- **CSS variables**: Yes
- **Tailwind CSS config**: `@import "tailwindcss";` in `src/index.css`
- **Component path**: `@/components/ui`

---

## 🔐 Credentials & Authentication

### Hidden Admin Access
- The website contains **NO "Admin Login" button or link anywhere**.
- The administrator uses the **exact same login form** as clients at `/login`.
- **Admin Login ID**: `PAVERASAPVTLTD`
- **Admin Password**: `Paverasa@@.PVTLTD`
- When these credentials are entered, the backend verifies them against environment variables and issues an admin JWT token; the frontend automatically redirects to `/admin`.

### Default Demo Client Credentials
- **Email**: `alex.wright@quantumedge.io`
- **Password**: `Client@123`
- Client logins automatically redirect to the Client Dashboard at `/dashboard`.

---

## 🚀 Running the Application

### 1. Run the Full Production-Ready App (Backend + Static Frontend)
```powershell
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your web browser.

### 2. Run in Development Mode
- **Backend API**:
  ```powershell
  npm run server
  ```
  Runs Express on port 5000.
- **Frontend Vite Server**:
  ```powershell
  npm run client
  ```
  Runs Vite with HMR on port 5173.

---

## 📄 Mandatory Copyright Notice
```
© 2026 Paverasa Private Limited. All Rights Reserved.
```
