# MISTAKES.md — Troubleshooting History & Mistake Log

This document records operational failures, failed command attempts, troubleshooting steps, and bug fixes across the project lifecycle.

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
- **Lesson Learned:** Next.js projects utilizing Tailwind CSS v4 require an explicit `@tailwindcss/postcss` config and clean scoping of marketing layout styles away from internal application shells.
