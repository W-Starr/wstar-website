# WSTAR — Corporate Web Platform & Company Operating System

> **WSTAR** is an innovation-driven technology company spearheading impactful software solutions across Africa, led by founders Ibrahim Abdulwahab (CEO) and Abdulaziz Abdulwahab (Lead Technical Architect).

---

## 🌟 System Overview

This repository houses two integrated systems built with **Next.js 16 (Turbopack)**, **Tailwind CSS v4**, and **Sanity CMS**:

1. **Public Marketing & Corporate Shell (`/`)**:
   - Institutional homepage highlighting enterprise AI solutions, executive leadership, and company track record.
   - Product showcases for **Ace Acad** (Smart academic mobile companion for Nigerian tertiary students) and **PlantIQ** (AI-driven smart agriculture & crop pathology).
   - Investor relations portal, company about page, and NDPA 2023 / FCCPA statutory legal policies.

2. **WSTAR Company Operating System (`/os`)**:
   - **Dual-Perspective Dashboard**: Distinct tailored interfaces for Lead Engineer (Abdulaziz) and CEO (Ibrahim).
   - **Work Stream & Bug Tracker (`/os/work`)**: Unified List & Kanban views for 40+ categorized tasks, bugs, and technical debt items across all products.
   - **Strategic Proposals Hub (`/os/proposals`)**: Executive briefs, financial projections, and 1-click task promotion for `PROP-001` (Class Rep UGC), `PROP-002` (Tier 2 Hybrid AI), and `PROP-003` (UGC Staging).
   - **Decision Ledger (`/os/decisions`)**: Architectural Decision Records (ADRs `DEC-001` to `DEC-006`).
   - **Customer Feedback Triage (`/os/feedback`)**: Intake and 1-click work item conversion.
   - **Sanity Cloud Real-Time Sync**: Multi-device live state synchronization (`sanityClient.listen`) between co-founders.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20.x or higher
- **Package Manager**: npm (or pnpm / yarn)

### 2. Installation & Running Locally
```bash
# Clone the repository
git clone https://github.com/KingAbdulAx/wstar-website.git
cd wstar-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site, or [http://localhost:3000/os](http://localhost:3000/os) for the Company Operating System.

### 3. Production Build
```bash
npm run build
```

---

## 📚 Documentation Index

For deep-dive technical and operational guides, see the `docs/` directory:

- [**Technical Architecture & System Design**](docs/ARCHITECTURE.md): Dual-shell layout isolation, Sanity sync engine, GROQ data schemas, and design principles.
- [**Founder User Manual (`/os`)**](docs/OPERATING_SYSTEM_MANUAL.md): How to use the dual-role perspectives, work stream, proposal promotions, and feedback triage.
- [**Deployment Guide**](docs/DEPLOYMENT.md): Step-by-step Vercel deployment, environment variable configuration, and Sanity Studio hosting.
- [**Troubleshooting & Mistakes Log**](MISTAKES.md): Operational failure logs and bug fix history.

---

## 🔒 Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=qx20j59l
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-01
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
```

---

## ⚖️ License & Proprietary Notice

© 2026 WSTAR Technologies. All rights reserved. Proprietary software for internal operations and public web presence.
