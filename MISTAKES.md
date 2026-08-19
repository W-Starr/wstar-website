# MISTAKES.md — Troubleshooting History & Mistake Log

This document records operational failures, failed command attempts, troubleshooting steps, and bug fixes across the project lifecycle.

---

### [2026-08-19 13:44] — Work Item Done Mutation Rollback Due to ID Stripping & Feedback Status Type

- **Date/Time:** 2026-08-19 13:44 (WAT / UTC+1)
- **Context:** Resolving task operations where marking a work item as 'done' failed or rolled back, and eliminating local initial seed reliance.
- **The Mistake/Error:**
  1. `OSContext.tsx` stripped prefixes from Sanity `_id` (e.g. `replace(/^work-/, '').replace(/^item-/, '')`), causing the store to hold altered IDs like `1` instead of `work-item-1`. When mutating or patching status to `done`, `dispatchMutation` attempted to patch non-existent document `work-1`, triggering a Sanity 404 which rolled back the UI state.
  2. In `feedbackStore.ts`, `updateFeedbackStatus(feedbackId, 'resolved')` was called, but `FeedbackItem['status']` is typed as `'new' | 'triaged' | 'converted' | 'dismissed'`.
- **The Fix:**
  1. Preserved exact, uncorrupted Sanity `_id` values across all domain stores and mapped documents directly.
  2. Updated `/api/os/sync` to support `createOrReplace` and fallback `createIfNotExists` on patch to prevent rollbacks.
  3. Replaced `'resolved'` with `'converted'` in `feedbackStore.ts`.
  4. Removed initial seed reset controls and initialized all Zustand stores as empty arrays `[]`, fetching exclusively and directly from Sanity Cloud dataset.
- **Lesson Learned:** Never strip or mutate authoritative database document IDs on the client side; keep raw database `_id` keys uniform across all API routes, Zustand stores, and mutations.

---

- **Date/Time:** 2026-08-19 13:12 (WAT / UTC+1)
- **Context:** Implementing the Natural Language Universal Command API route `src/app/api/os/ai/source-command/route.ts`.
- **The Mistake/Error:** Imported nonexistent types `Priority` and `FounderId` from `@/os/types`, causing TypeScript build error: `Module '"@/os/types"' has no exported member 'Priority'`.
- **The Fix:** Replaced with the canonical exported types `WorkItemPriority` and literal `'abdulaziz' | 'ibrahim' | 'unassigned'`.
- **Lesson Learned:** Always check `src/os/types/index.ts` to verify exact type identifiers before writing API schema wrappers.

---

### [2026-08-19 13:01] — Missing Lucide Icon Imports in Sources Page

- **Date/Time:** 2026-08-19 13:01 (WAT / UTC+1)
- **Context:** Implementing the Google Drive background sync button and feedback banner in `src/app/os/sources/page.tsx`.
- **The Mistake/Error:** Used `<RefreshCw />` and `<X />` in JSX without including them in the `import { ... } from 'lucide-react'` declaration, triggering TypeScript build error `Cannot find name 'RefreshCw'`.
- **The Fix:** Added `RefreshCw` and `X` to the `lucide-react` import statement.
- **Lesson Learned:** Always verify that every Lucide icon referenced in newly added JSX headers is imported.

---

### [2026-08-19 12:09] — Structured Logger Metadata Argument Typing in Google Drive Route

- **Date/Time:** 2026-08-19 12:09 (WAT / UTC+1)
- **Context:** Implementing the Google Drive API server endpoint `src/app/api/os/sources/gdrive/route.ts`.
- **The Mistake/Error:** Passed the raw `unknown` catch error variable `e` directly as the 3rd argument to `logger.warn('...', 'GDRIVE-API', e)`. The structured logger interface in `src/os/lib/logger.ts` defines `metadata?: Record<string, unknown>`, causing TypeScript error: `Argument of type 'unknown' is not assignable to parameter of type 'Record<string, unknown> | undefined'`.
- **The Fix:** Changed the call to pass an object `{ error: e?.message || String(e) }`.
- **Lesson Learned:** Always wrap error strings or instances into a key-value object when invoking structured telemetry loggers.

---

### [2026-08-19 11:33] — TypeScript Mutation Dispatcher Signature Mismatch in SourceStore

- **Date/Time:** 2026-08-19 11:33 (WAT / UTC+1)
- **Context:** Implementing the Zustand domain store `src/os/store/sourceStore.ts` for WSTAR OS Source Intelligence.
- **The Mistake/Error:** `dispatchMutation` was invoked with a single object parameter `{ type: 'create', document: { ... } }`, whereas `src/os/store/syncHelper.ts` defines the signature as positional parameters `dispatchMutation(action, docType, id, data)`. This triggered a TypeScript compilation error during `npm run build`: `Type error: Expected 3-4 arguments, but got 1.`
- **The Fix:** Updated `sourceStore.ts` to call `dispatchMutation('create', 'source', id, { ... })`, `dispatchMutation('patch', 'source', id, updates)`, and `dispatchMutation('delete', 'source', id)`.
- **Lesson Learned:** Always check the exact positional parameter signature of domain helpers like `dispatchMutation` before composing new Zustand stores.

---

### [2026-08-19 10:04] — AI Endpoint Protection, Rate Limiting & Enterprise Readiness (Phase 5)

- **Date/Time:** 2026-08-19 10:04 (WAT / UTC+1)
- **Context:** Implementing Phase 5 of the Holistic Independent Audit (Integrations, Intelligence & Enterprise Readiness).
- **The Mistake/Error:** AI endpoints (`/api/os/ai/*`) and Auth routes lacked server-side rate limiting and token exhaustion guards. Rapid bursts of debounced quick capture keystrokes or brute-force authentication attempts could exhaust Gemini API quotas and cause 429 cascades.
- **The Fix:**
  1. Built an in-memory sliding window rate limiter (`src/os/lib/rateLimit.ts`) with per-route limits (30 req/min for classification, 20 req/min for decomposition, 10 req/min for digests/extraction, 8 req/min for login).
  2. Implemented structured telemetry logger (`src/os/lib/logger.ts`) with ISO timestamps and level categorization (`info`, `warn`, `error`).
  3. Created Proposal-to-Roadmap sprint backlog AI decomposition route (`/api/os/ai/extract-proposal-tasks`) using `gemini-flash-latest` and wired it into `ProposalDetailModal.tsx`.
  4. Upgraded Activity Audit Trail (`/os/activity`) with actor filters, event type filters, search, and RFC-4180 compliant CSV downloads.
  5. Synchronized all system living documentation (`README.md`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`).
- **Lesson Learned:** Every public-facing AI or auth gateway must have proactive edge rate limiting to protect API token budgets and prevent upstream rate limit errors.

---

### [2026-08-19 09:10] — Classification Suggestion Type Mismatch & Security Gateway Hardening (Phase 1)

- **Date/Time:** 2026-08-19 09:10 (WAT / UTC+1)
- **Context:** Implementing Phase 1 of the Independent Holistic Audit (Security Hardening & Zero-Vulnerability Core).
- **The Mistake/Error:** 
  1. `suggestClassification()` in `OSContext.tsx` returned object keys `{ suggestedType, suggestedPriority, suggestedArea, suggestedAssignee }` whereas the `ClassificationSuggestion` interface in `types/index.ts` and the consumer in `QuickCaptureModal.tsx` expected `{ type, productId, productAreaId, priority, assignee, confidence }`. This caused auto-suggested classifications to return `undefined` and silently fail in the UI.
  2. All `/os` subroutes and `/api/os/*` mutation endpoints were publicly accessible without authentication, unvalidated mutation payloads could be sent to Sanity, and hardcoded fallback project IDs (`qx20j59l`) were embedded directly in source code.
- **The Fix:**
  1. Refactored `suggestClassification()` in `src/os/context/OSContext.tsx` to return exact keys matching `ClassificationSuggestion`. Tested in browser; auto-suggestions for bugs (`🔴 P0 Critical`, `Abdulaziz`) and tasks populated correctly.
  2. Added Next.js Edge route protection middleware (`src/middleware.ts`) using `jose` JWT verification, redirecting unauthenticated `/os` visitors to `/os/login` and blocking unauthenticated API requests with `401 Unauthorized`.
  3. Created branded editorial login page at `src/app/os/login/page.tsx` for founders Abdulaziz and Ibrahim, and isolated it from the OS layout shell.
  4. Added runtime Zod validation schemas (`src/os/lib/validation.ts`) for `/api/os/sync` and `/api/os/seed`.
  5. Removed all hardcoded Sanity fallback IDs in favor of strict runtime validator `src/os/config/env.ts`.
  6. Added HTTP response security headers in `next.config.ts`.
- **Lesson Learned:** Always ensure contract keys between context providers, type definitions, and consuming modal components are strictly typed and aligned; never leave administrative internal tools open without middleware authentication.

---

### [2026-08-19 08:15] — PowerShell Statement Separator Error (`&&`)

- **Date/Time:** 2026-08-19 08:15 (WAT / UTC+1)
- **Context:** Executing `git add . && git commit -m "..."` in Windows PowerShell.
- **The Mistake/Error:** PowerShell returned ParserError: `The token '&&' is not a valid statement separator in this version.`
- **The Fix:** Executed `git add .` and `git commit` as separate commands (or using `;`).
- **Lesson Learned:** In Windows PowerShell 5.1/standard shell environments, `&&` is not supported as a statement separator; run commands sequentially or use `;`.

---

### [2026-08-19 08:14] — Mobile Viewport Squishing & Responsive Drawer Navigation

- **Date/Time:** 2026-08-19 08:14 (WAT / UTC+1)
- **Context:** User reported that the site lacked a mobile-optimized view, with desktop sidebars squishing content into narrow columns on mobile screens (< 768px).
- **The Mistake/Error:** 
  1. `src/app/os/layout.tsx` rendered the fixed-width desktop sidebar (`w-64 flex`) side-by-side with the main content on all screen sizes, severely cramping mobile devices (375px–412px viewports).
  2. `TopHeader.tsx` header controls (Sanity sync status, reset button, notification bell, and role toggle) were rigid and lacked a mobile menu toggle (`lg:hidden`).
  3. Modals and the Kanban board lacked responsive mobile padding, touch target sizing, and horizontal swipe containers.
- **The Fix:**
  1. Updated `src/app/os/layout.tsx` to hide the desktop sidebar on `< lg` screens and added a slide-out drawer with a backdrop overlay.
  2. Added mobile hamburger trigger (`Menu` icon) to `TopHeader.tsx` and condensed mobile controls.
  3. Updated `src/os/components/Sidebar.tsx` with mobile drawer navigation click dismissal.
  4. Updated `src/app/os/work/page.tsx` with mobile responsive filter wrapping and touch-swipeable Kanban columns (`snap-x snap-mandatory`).
  5. Updated modal components (`WorkItemDetailModal.tsx`, `QuickCaptureModal.tsx`) with mobile touch padding and full-width actions.
  6. Verified in Chrome DevTools MCP at 390px x 844px mobile viewport across all routes.
- **Lesson Learned:** Application layouts with sidebars must always implement responsive hiding (`hidden lg:flex`) paired with slide-out mobile drawers and touch-optimized horizontal snap scrolling.

---

### [2026-08-18 17:42] — TypeScript Union Mismatches in `OSContext.tsx` on Sanity Migration Actions

- **Date/Time:** 2026-08-18 17:42 (WAT / UTC+1)
- **Context:** Implementing Sanity CMS live-sync mutation handlers and activity dispatching for feedback conversions and roadmap shifts.
- **The Mistake/Error:** Next.js build failed with two TypeScript compilation errors:
  1. `Argument of type '"converted_to_issue"' is not assignable to parameter of type '"new" | "triaged" | "converted" | "dismissed"'` in `OSContext.tsx:527`.
  2. `Argument of type '"milestone"' is not assignable to parameter of type '"task" | "bug" | "decision" | "feedback" | "project" | "product" | "proposal"'` in `OSContext.tsx:539`.
- **The Fix:** 
  1. Changed feedback conversion status string to `'converted'`.
  2. Changed roadmap activity targetType string to `'project'`.
  3. Verified build with `next build` which compiled cleanly with zero errors.
- **Lesson Learned:** Check union definitions in `src/os/types/index.ts` before passing literal strings to activity logging or status transition methods.

---

### [2026-08-18 16:06] — Missing `setProjects` State Setter in `OSContext.tsx`

- **Date/Time:** 2026-08-18 16:06 (WAT / UTC+1)
- **Context:** Running `npm run build` after adding Proposals state and actions to `OSContext.tsx`.
- **The Mistake/Error:** Next.js build failed with `Type error: Cannot find name 'setProjects'. Did you mean 'projects'?` in `src/os/context/OSContext.tsx:495:5` because `const [projects] = useState<Project[]>(initialProjects)` lacked the setter.
- **The Fix:** Updated declaration to `const [projects, setProjects] = useState<Project[]>(initialProjects)`. Verified with clean `next build` exiting with code 0.
- **Lesson Learned:** Always ensure all state variables referenced in reset or action helpers have their corresponding setters declared in `useState` destructuring.

---

### [2026-08-17 12:55] — WSTAR OS Unstyled Layout & Tailwind v4 Integration Fix

- **Date/Time:** 2026-08-17 12:55 (WAT / UTC+1)
- **Context:** Inspecting `/os` in browser after user reported the OS landing page appeared unstyled.
- **The Mistake/Error:** 
  1. `postcss.config.mjs` was missing for Tailwind CSS v4, and `@import "tailwindcss";` was absent from `globals.css`, preventing Tailwind utility classes from generating.
  2. The marketing `Navbar` and `Footer` in `src/app/layout.tsx` were rendered globally, wrapping `/os` and conflicting with the OS sidebar/header layout.
  3. Unscoped `h1`, `h2`, `h3` clamp rules in `globals.css` were overriding Tailwind typography classes inside OS components.
- **The Fix:**
  1. Created `postcss.config.mjs` with `@tailwindcss/postcss` and added `@import "tailwindcss";` in `globals.css`.
  2. Created `MarketingShell.tsx` to isolate the marketing Navbar and Footer strictly to non-`/os` routes.
  3. Scoped marketing typography to `.marketing-shell` so it does not interfere with the OS design system.
  4. Verified in browser using Chrome DevTools MCP across `/os`, `/os/work`, `/os/ace-acad`, `/os/feedback`, `/os/roadmap`, and the Quick Capture modal.
  5. Tested and verified mobile responsive drawer and layouts across marketing and OS routes.
- **Lesson Learned:** Next.js projects utilizing Tailwind CSS v4 require an explicit `@tailwindcss/postcss` config and clean scoping of marketing layout styles away from internal application shells.
