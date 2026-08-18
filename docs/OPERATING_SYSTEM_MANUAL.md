# WSTAR Company Operating System (`/os`) — Founder User Manual

This manual explains how to use the WSTAR Operating System to manage company strategy, engineering execution, and legal governance.

---

## 1. Dual Founder Perspectives

The OS features tailored perspective views at the top right of every page:

- **Lead Engineer View (Abdulaziz)**:
  - Surfaces active engineering bottlenecks, P0 critical bugs (`BUG-001` through `BUG-005`), database migration debt, and next-horizon architectural pipelines.
  - Highlights engineering tasks for the Flutter mobile app and Cloud Functions.
- **CEO View (Ibrahim)**:
  - Surfaces statutory legal deadlines (NDPA 2023 filings, FCCPA compliance), campus ambassador playbooks, fundraising milestones, and investor relations.
  - Tracks business health metrics and strategic proposals.

---

## 2. Work Stream & Bug Tracker (`/os/work`)

A unified execution hub supporting tasks, bugs, technical debt, and features:

- **Views**: Toggle between **List View** (compact tabular view) and **Kanban Board** (drag/column view across `Backlog`, `Todo`, `In Progress`, `Blocked`, `Done`).
- **Product Filters**: Filter items by product (`All Products`, `Ace Acad`, `PlantIQ`, `WSTAR Core & Corporate HQ`).
- **Task Decomposition**: Open any complex feature card and click **"AI Decompose"** to generate an actionable checklist of subtasks.
- **Traceable References**: Tasks link directly to Flutter source files (`lib/...`), proposals (`proposals/...`), or legal documents (`Privacy policy...md`).

---

## 3. Strategic Proposals Hub (`/os/proposals`)

A deep-dive review center for unworked and in-flight company blueprints:

- **`PROP-001`**: *Cohort-Based UGC & The "Class Rep" Model* (Safe Harbor content hosting).
- **`PROP-002`**: *AI Study & Study Paths Revamp* (Tier 2 Hybrid AI + SM-2 spaced repetition).
- **`PROP-003`**: *UGC Upload & Staging System* (3-zone quarantined storage pipeline).

### One-Click Task Promotion:
Open any proposal modal, navigate to the **Roadmap** tab, and click **`+ Add to Work`** on any milestone task to extract it into the live work stream.

---

## 4. Decision Ledger / ADRs (`/os/decisions`)

Records foundational technical and business trade-offs so future team members understand *why* architectural choices were made:
- `DEC-001`: "Wizard of Oz" curated study paths for initial 100L launch.
- `DEC-002`: Target 100L ABU Zaria freshmen exclusively for initial MVP cohort.
- `DEC-003`: Free pilot launch prior to payment gateway integration.
- `DEC-004`: Use Sanity CMS for structured operating system data.
- `DEC-005`: Safe Harbor Class Rep hosting model for UGC scaling.
- `DEC-006`: Tier 2 Hybrid AI (Gemini 2.0 Flash batch + local SM-2) selection.

---

## 5. Customer Feedback Triage (`/os/feedback`)

Direct intake for student bug reports, feature requests, and praise:
- Change feedback status from `New` → `Triaged` → `Under Review`.
- Click **"Convert to Work Item"** to auto-generate a prioritized bug ticket.

---

## 6. Quick Capture & Shortcuts

- **`Ctrl+K` / `Cmd+K`**: Opens the universal Command Palette to search all work items, proposals, decisions, and navigation pages.
- **`+ Quick Capture`**: Quickly record an idea, bug, or decision from anywhere in the app with automatic category suggestions.
- **`Sync Code Seed`**: Re-populates the workspace from authoritative source code data if needed.
