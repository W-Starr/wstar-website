# WSTAR Standard Operating Procedure (SOP): AI Agent & Developer Execution Protocol

This document defines the authoritative workflow for human developers, local LLMs, and autonomous AI agents working across the WSTAR ecosystem (`wstar-website`, `ace_acad_mobile`, `plantiq`, `wstar-core`).

---

## 1. Core Principles

1. **Sanity Cloud is the Single Source of Truth**: All tasks, bugs, architectural decisions, and activity items are stored centrally in Sanity Cloud (`dataset: production`, `projectId: qx20j59l`).
2. **Zero In-Memory Hardcoding**: All operations read from and write to the cloud database.
3. **Traceability**: Every completed task must link to its verification evidence (tests run, code references, PR/commit hash).
4. **Transparent Governance**: Non-trivial technical choices must be recorded as Architectural Decision Records (ADRs).

---

## 2. The 5-Stage Agent Lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. DISCOVER  │ ──> │   2. CLAIM   │ ──> │  3. EXECUTE & ADR   │ ──> │  4. VERIFY   │ ──> │ 5. COMPLETE  │
│ Find tickets │     │ in_progress  │     │ Code + Record ADRs  │     │ Tests/Build  │     │ Done + Stream│
└──────────────┘     └──────────────┘     └─────────────────────┘     └──────────────┘     └──────────────┘
```

### Stage 1: Discovery & Task Lookup
- Query open tickets filtered by product (`ace-acad`, `plantiq`, `wstar-core`), priority, or type.
- Command:
  ```bash
  node scripts/wstar-agent.js tasks --product ace-acad --status todo
  node scripts/wstar-agent.js task get BUG-001
  ```

### Stage 2: Claiming & Starting Work
- Mark the task `in_progress` and assign it to the active founder (`abdulaziz` or `ibrahim`).
- Command:
  ```bash
  node scripts/wstar-agent.js task claim BUG-001 --assignee abdulaziz
  ```

### Stage 3: Execution & Architectural Decision Logging
- Implement modifications according to design tokens, TypeScript/Dart type safety, and lint rules.
- If an architectural trade-off is made, log an ADR:
  ```bash
  node scripts/wstar-agent.js decision log \
    --title "Adopt Drift SQLite for PDF Sandbox Isolation" \
    --decision "Use type-safe Drift SQLite tables to index local downloaded PDF files" \
    --reason "Guarantees offline reliability without memory leaks on large PDFs" \
    --product ace-acad
  ```

### Stage 4: Verification
- Execute automated builds and tests:
  - **Web / OS**: `npm run build`
  - **Flutter Mobile**: `flutter test` or `flutter analyze`

### Stage 5: Completion & Live Activity Logging
- Mark the task `done` with a clear summary note:
  ```bash
  node scripts/wstar-agent.js task done BUG-001 --note "Fixed bounding box overflow in pdfrx viewer for large PDF slides"
  ```
- This automatically emits an `activityItem` badge to the live notification center and `/os/activity` stream.

---

## 3. Discovered Bugs & Technical Debt

When an agent identifies a new issue or unhandled edge case during development:
```bash
node scripts/wstar-agent.js task create \
  --title "Null check crash on empty question array" \
  --type bug \
  --priority high \
  --product ace-acad \
  --assignee abdulaziz \
  --description "Firestore quiz documents with missing options crash quiz screen on load"
```

---

## 4. CLI Tool Reference (`scripts/wstar-agent.js`)

| Command | Description |
|---|---|
| `tasks` / `task list` | List work items (`--product`, `--status`, `--priority`, `--assignee`) |
| `task get <id>` | Inspect full ticket details |
| `task claim <id>` | Claim task and set `status: 'in_progress'` |
| `task done <id> [--note "text"]` | Mark task as done and log verification activity |
| `task create --title "..."` | Create a new work item / bug |
| `decisions` / `decision list` | List architectural decision records |
| `decision log --title "..."` | Record a new architectural decision |
| `activity` / `activity list` | View live activity stream |
| `activity log --action "..."` | Log a custom activity event |
| `proposals` | List strategic proposals |
| `--json` | Return raw JSON output for programmatic parsing |
