# WSTAR — Corporate Web Platform & Company Operating System

> **WSTAR** is an innovation-driven technology company spearheading software and intelligence solutions across Africa, founded by Ibrahim Abdulwahab (CEO) and Abdulaziz Abdulwahab (Lead Technical Architect).

---

## 🌟 System Overview

This repository houses two integrated systems built with **Next.js 16 (Turbopack)**, **Tailwind CSS v4**, **Zustand**, **Google Gemini AI**, and **Sanity CMS**:

1. **Public Marketing & Corporate Shell (`/`)**:
   - Institutional homepage highlighting enterprise AI solutions, executive leadership, and company track record.
   - **WSTAR AI Solutions (`/ai-solutions`)**: High-conversion enterprise initiative showcasing deterministic Agentic AI systems for industrial & B2B workflows (Autonomous Procurement Agents, Parametric ERP Substitution, B2B Knowledge RAG, 90s sandbox Loom gallery, and targeted bottleneck intake flow).
   - Product showcases for **Ace Acad** (Smart academic mobile companion for Nigerian tertiary students) and **PlantIQ** (AI-driven smart agriculture & crop pathology).
   - Investor relations portal, company about page, and NDPA 2023 / FCCPA statutory legal policies.

2. **WSTAR Company Operating System (`/os`)**:
   - **Edge JWT Auth Guard**: Zero-trust protected route gateway (`/os/*` and `/api/os/*`) with corporate founder accounts.
   - **Real AI Intelligence Engine (Gemini Flash & Lite)**:
     - Real-time debounced Quick Capture NLP classification (`/api/os/ai/classify`).
     - Automated engineering subtask decomposition (`/api/os/ai/decompose`).
     - Daily async founder handoff briefings (`/api/os/ai/digest`).
     - Strategic proposal-to-sprint task extractor (`/api/os/ai/extract-proposal-tasks`).
   - **Unified Work Stream (`/os/work`)**: Real-time Kanban and List views with subtask checklists and monotonic numbering (`TASK-xxx`, `BUG-xxx`).
   - **Strategic Proposals Hub (`/os/proposals`)**: Executive briefs, financial projections, and 1-click sprint task promotion for `PROP-001`, `PROP-002`, and `PROP-003`.
   - **Architectural Decision Records (`/os/decisions`)**: Immutable ADR ledger (`DEC-001` to `DEC-006`) with alternatives evaluated and co-signers.
   - **Customer Feedback Triage (`/os/feedback`)**: Direct Firestore feed with 1-click conversion to tracked engineering work items.
   - **Activity Audit Trail (`/os/activity`)**: Real-time action log with actor/type filtering and RFC-4180 CSV export.
   - **Reactive Zustand Stores**: Optimistic mutations with automatic rollback on network failure.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20.x or higher
- **Package Manager**: npm (or pnpm / yarn)

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Required variables:
```env
# Sanity CMS Structured Cloud Storage
NEXT_PUBLIC_SANITY_PROJECT_ID=qx20j59l
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-01
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here

# Google Gemini Intelligence Engine
GEMINI_API_KEY=your_gemini_api_key_here

# WSTAR OS Authentication & Sessions
AUTH_SECRET=your_strong_random_jwt_secret_here
FOUNDER_PASSWORD_ABDULAZIZ=your_secure_password_for_abdulaziz
FOUNDER_PASSWORD_IBRAHIM=your_secure_password_for_ibrahim
```

### 3. Installation & Running Locally
```bash
# Clone the repository
git clone https://github.com/W-Starr/wstar-website.git
cd wstar-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site, or [http://localhost:3000/os](http://localhost:3000/os) for the Company Operating System.

### 4. Founder Authentication
Founder accounts (`abdulaziz@wstartech.ng` and `ibrahim@wstartech.ng`) access the Operating System via `/os/login`. Passwords must be defined via `FOUNDER_PASSWORD_ABDULAZIZ` and `FOUNDER_PASSWORD_IBRAHIM` in `.env.local` (local) or Vercel Environment Variables (production). Session tokens are signed using `AUTH_SECRET`.

### 5. Newsroom Studio (`/publications/admin`)
Publications on the public `/publications` newsroom are posted from the password-gated **Newsroom Studio** at `/publications/admin`. It accepts **either** founder password — no email — and issues its own 12-hour session scoped to publishing only, separate from the WSTAR OS session. Writes run server-side through `SANITY_API_WRITE_TOKEN`, which must be an **Editor**-scoped Sanity token; a read-only token lets the studio open and list items but fails every save. See [**Newsroom Studio Guide**](docs/NEWSROOM_STUDIO.md).

---

## 📚 Documentation Index

For deep-dive technical and operational guides, see the `docs/` directory:

- [**Technical Architecture & System Design**](docs/ARCHITECTURE.md): Dual-shell layout isolation, Zustand stores, Edge JWT middleware, Gemini AI routing, and Sanity sync.
- [**API Reference Manual**](docs/API_REFERENCE.md): Full REST specification for all `/api/os/*` routes (Auth, Gemini AI, Sanity sync).
- [**Founder User Manual (`/os`)**](docs/OPERATING_SYSTEM_MANUAL.md): Operating guide for dual-role perspectives, proposal promotion, and feedback triage.
- [**Newsroom Studio Guide**](docs/NEWSROOM_STUDIO.md): Password-gated publishing surface at `/publications/admin` — access, architecture, guardrails, and the Sanity token requirement.
- [**Audit Master Tracker**](AUDIT_MASTER_IMPLEMENTATION_TRACKER.md): Verification matrix tracking all 22 independent audit findings across 5 phases.
- [**Deployment Guide**](docs/DEPLOYMENT.md): Step-by-step Vercel deployment, environment variable configuration, and Sanity Studio hosting.
- [**Troubleshooting & Mistakes Log**](MISTAKES.md): Operational failure logs and bug fix history.

---

## ⚖️ License & Proprietary Notice

© 2026 WSTAR Technologies. All rights reserved. Proprietary software for internal company operations and public web presence.
