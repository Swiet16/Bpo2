# MYNE7X BPO — Enterprise Operations Platform

A premium, production-ready BPO management system built with React, Vite, TypeScript, and Supabase. Features role-based dashboards, payroll, contracts, attendance, support ticketing, BI analytics, professional PDF generation, and a beautiful dark premium UI.

![MYNE7X BPO](https://img.shields.io/badge/MYNE7X-BPO-8b5cf6) ![React](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Supabase](https://img.shields.io/badge/Supabase-2-3ecf8e)

## ✨ Features

### 9 Role-Based Dashboards
- **Super Admin (CEO)** — Full command center with all modules
- **Admin** — Business operations management
- **HR** — Workforce, payroll, contracts, leave
- **Team Leader** — Team performance & attendance
- **Agent** — Personal dashboard with attendance & payslips
- **IT Team** — Assets, tickets, system issues
- **Corporation Team** — Corporate accounts & contracts
- **Client Team** — Client management & service delivery
- **BI Team** — Advanced analytics & reporting

### Core Modules
- 🔐 **Authentication** — Supabase Auth with protected Super Admin
- 👥 **User Management** — Create, edit, suspend, role changes
- 📅 **Attendance** — Check-in/out, monthly tracking, corrections
- 💰 **Payroll & Payslips** — Complete payroll with PDF generation
- 📄 **Contracts** — Lifecycle management with branded PDFs
- 🎫 **Support Tickets** — Full ticketing system with public forms
- 📊 **BI Analytics** — Real-time dashboards with Recharts
- 📢 **Announcements** — Audience-targeted broadcasts
- 🔔 **Notifications** — In-app notification center
- 🗂️ **Documents** — Supabase Storage with role-based access
- 📈 **Reports** — 13 report types with PDF export
- 🔍 **Global Search & Command Palette** — Ctrl+K shortcuts

### Public Website
- Home, About, Services, Careers, FAQ
- Contact form, Customer Support form
- Terms, Privacy, Cookie policies
- Support Center

### Premium Design
- Dark navy theme with violet/cyan accents
- Glassmorphism cards with backdrop blur
- Framer Motion animations
- Animated counters & transitions
- Fully responsive (mobile-first)
- Skeleton loading states
- Toast notifications
- Beautiful error pages (403, 404, 500)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPER_ADMIN_EMAIL=myne7x@gmail.com
VITE_APP_NAME=MYNE7X BPO
VITE_APP_URL=http://localhost:5173
```

> **Note**: The `VITE_SUPABASE_ANON_KEY` is safe to expose in frontend code — it's designed to be public. Make sure Row Level Security (RLS) is properly configured in your Supabase project. **NEVER** expose the `service_role` key in frontend code.

## 🗄️ Database Setup

See [`SUPABASE_SCHEMA.md`](./SUPABASE_SCHEMA.md) for the complete database schema including:
- All table definitions
- Row Level Security (RLS) policies
- Storage bucket configuration
- Protected Super Admin triggers
- Initial setup instructions

### Quick Setup Steps:
1. Create a new Supabase project
2. Run the SQL from `SUPABASE_SCHEMA.md` in the SQL Editor
3. Create the storage buckets listed in the schema doc
4. Create the super admin user in Auth → Users with email `myne7x@gmail.com`
5. Set the database-level config: `alter database postgres set app.super_admin_email = 'myne7x@gmail.com';`

## 🛡️ Security Features

- **Protected Super Admin**: The CEO account (`myne7x@gmail.com`) cannot be modified, deleted, suspended, or have its role changed by anyone — enforced at the database level via triggers.
- **Role-Based Access Control**: 9 roles with 30+ granular permissions
- **Row Level Security**: Every table has RLS enabled
- **Private Storage**: All document buckets are private with signed URL access
- **Audit Logging**: All sensitive actions are logged
- **Force Password Change**: Temporary passwords trigger forced change on next login
- **Route Guards**: Frontend route protection with 403 access denied pages

## 🎨 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Backend | Supabase (Auth, Database, Storage) |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Tables | TanStack Table |
| PDF | jsPDF + jspdf-autotable |
| Forms | React Hook Form + Zod |
| Notifications | React Hot Toast |

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI primitives
│   ├── AnimatedCounter.tsx
│   ├── ChartCard.tsx
│   ├── CommandPalette.tsx
│   ├── DataTable.tsx
│   ├── DashboardTemplate.tsx
│   ├── EmptyState.tsx
│   ├── GlobalSearch.tsx
│   ├── Logo.tsx
│   ├── Modal.tsx
│   ├── NotificationsPanel.tsx
│   ├── PageHeader.tsx
│   ├── PublicPageShell.tsx
│   ├── Skeleton.tsx
│   └── StatCard.tsx
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── dashboards/        # Role-specific dashboards
│   ├── SuperAdminDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── HRDashboard.tsx
│   ├── AgentDashboard.tsx
│   ├── TeamLeaderDashboard.tsx
│   ├── ITDashboard.tsx
│   ├── CorporationDashboard.tsx
│   ├── ClientDashboard.tsx
│   └── BIDashboard.tsx
├── layouts/           # Layout wrappers
│   ├── DashboardLayout.tsx
│   └── PublicLayout.tsx
├── lib/               # Utilities & services
│   ├── supabase.ts
│   ├── services.ts
│   ├── permissions.ts
│   ├── pdfEngine.ts
│   ├── mockData.ts
│   └── utils.ts
├── pages/             # Route pages
│   ├── auth/
│   ├── error/
│   ├── public/
│   ├── UsersPage.tsx
│   ├── AttendancePage.tsx
│   ├── PayrollPage.tsx
│   ├── PayslipsPage.tsx
│   ├── ContractsPage.tsx
│   ├── SupportPage.tsx
│   └── ... (20+ module pages)
├── types/             # TypeScript definitions
│   └── index.ts
├── App.tsx            # Main app with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy — Vercel will auto-detect Vite and run `npm run build`

The `vercel.json` file is included with proper configuration.

### Other Platforms

The build output is in `dist/` — deploy it to any static hosting provider:
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open Command Palette |
| `Ctrl+/` / `Cmd+/` | Open Global Search |
| `ESC` | Close modals / panels |
| `↑↓` | Navigate command palette |
| `Enter` | Execute selected command |

## 📝 License

© 2025 MYNE7X BPO. All rights reserved.

## 🆘 Support

- **Email**: info@myne7x.com
- **Phone**: +92 21 111 696 379
- **Address**: Plot 14, I.T. Tower, Clifton, Karachi, Pakistan
