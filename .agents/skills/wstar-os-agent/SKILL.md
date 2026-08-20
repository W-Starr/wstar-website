---
name: wstar-os-agent
description: Standard operating procedure and CLI tool for AI agents and local LLMs to query, claim, update, and resolve work items, log architectural decisions (ADRs), and emit real-time activity events to WSTAR OS (Sanity Cloud).
---

# WSTAR OS Agent Protocol & Task Sync Guide

This skill defines the standard operating procedure (SOP) for any AI agent or local LLM working on WSTAR products (`ace_acad_mobile`, `wstar-website`, `plantiq`, `wstar-core`).

All product execution data (tasks, bugs, decisions, proposals, activity stream) lives in **Sanity Cloud** and is surfaced via **WSTAR OS** (`/os`).

---

## 🛠️ The Agent CLI Tool: `scripts/wstar-agent.js`

A zero-dependency Node.js CLI is available in the repository at `scripts/wstar-agent.js`. It reads `SANITY_API_WRITE_TOKEN` from `.env.local` or environment variables and communicates directly with Sanity Cloud.

---

## 🔄 Standard 5-Step Agent Workflow

```
1. DISCOVER  ──>  2. CLAIM  ──>  3. EXECUTE & ADR  ──>  4. VERIFY  ──>  5. COMPLETE
(Query tasks)    (in_progress)     (Code + Decisions)   (Tests/Build)   (done + Activity)
```

### Step 1: Discover Open Tasks
Before writing code or resolving issues, query Sanity for relevant open work items:

```bash
# List all open tasks for Ace Acad
node scripts/wstar-agent.js tasks --product ace-acad --status todo

# List critical or high priority bugs
node scripts/wstar-agent.js tasks --type bug --priority high

# Inspect full details and code references for a specific task
node scripts/wstar-agent.js task get BUG-001
# Or by Sanity document ID:
node scripts/wstar-agent.js task get work-item-1
```

### Step 2: Claim the Work Item
When beginning work on a ticket, mark its status as `in_progress` and assign it to the responsible founder (`abdulaziz` or `ibrahim`):

```bash
node scripts/wstar-agent.js task claim BUG-001 --assignee abdulaziz
```
*This automatically sets status to `in_progress` and logs an activity stream event.*

### Step 3: Execute & Log Architectural Decisions (ADR)
While implementing solutions, if you make a non-trivial architectural, algorithmic, or structural choice:
- Choosing a specific database/caching engine (e.g. SQLite Drift vs Hive)
- Defining token refresh / authentication retry windows
- Modifying legal/compliance data retention or NDPA privacy rules
- Altering cloud storage quarantine pipelines

**Immediately log an Architectural Decision Record:**
```bash
node scripts/wstar-agent.js decision log \
  --title "Adopt Drift SQLite for PDF Sandbox Isolation" \
  --decision "Use type-safe Drift SQLite tables to index local downloaded PDF files" \
  --reason "Guarantees offline reliability without memory leaks on large PDFs" \
  --product ace-acad
```

### Step 4: Verify Your Work
Always run local tests or build commands before marking a task complete:
- In `wstar-website`: `npm run build`
- In `ace_acad_mobile`: `flutter test` or `flutter analyze`

### Step 5: Mark Complete & Emit Activity
Once verified, mark the task as `done` and provide a concise summary note:

```bash
node scripts/wstar-agent.js task done BUG-001 --note "Fixed bounding box overflow in pdfrx viewer when rendering 50+ page lecture slides"
```
*This updates the task status to `done` in Sanity and automatically emits a completion badge to the WSTAR OS live activity feed and notification center.*

---

## ➕ Creating New Tasks or Bugs Discovered During Development

If you uncover a bug, technical debt, or missing requirement during your work session:

```bash
# Create a bug ticket
node scripts/wstar-agent.js task create \
  --title "Null safety crash on empty quiz answer array" \
  --type bug \
  --priority high \
  --product ace-acad \
  --assignee abdulaziz \
  --description "Quiz screen crashes if question option D is missing in Firestore document"

# Create a tech debt ticket
node scripts/wstar-agent.js task create \
  --title "Upgrade pdfrx to latest minor version" \
  --type tech_debt \
  --priority medium \
  --product ace-acad
```

---

## ⚡ Quick Reference Commands

| Goal | Command |
|---|---|
| List Todo Tasks | `node scripts/wstar-agent.js tasks --status todo` |
| Filter by Product | `node scripts/wstar-agent.js tasks --product ace-acad` |
| Get Task Details | `node scripts/wstar-agent.js task get <id_or_number>` |
| Claim Task | `node scripts/wstar-agent.js task claim <id_or_number> --assignee abdulaziz` |
| Resolve Task | `node scripts/wstar-agent.js task done <id_or_number> --note "Summary"` |
| Create Task / Bug | `node scripts/wstar-agent.js task create --title "..." --type bug --priority high` |
| Log Decision (ADR) | `node scripts/wstar-agent.js decision log --title "..." --decision "..." --reason "..."` |
| View Activity Stream | `node scripts/wstar-agent.js activity` |
| View Proposals | `node scripts/wstar-agent.js proposals` |
| JSON Output Mode | Add `--json` to any command |
