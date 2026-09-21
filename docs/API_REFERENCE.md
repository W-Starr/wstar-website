# WSTAR OS API Reference

Complete documentation of all internal REST API routes powering the WSTAR Company Operating System.

---

## 1. Authentication Endpoints

### `POST /api/os/auth/login`
Authenticates a co-founder and establishes an HTTP-only secure cookie session.

- **Rate Limit:** 8 requests / minute / IP
- **Request Body:**
  ```json
  {
    "email": "abdulaziz@wstartech.ng",
    "password": "..."
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "abdulaziz",
      "email": "abdulaziz@wstartech.ng",
      "name": "Abdulaziz Abdulwahab",
      "role": "Lead Technical Architect"
    }
  }
  ```

### `POST /api/os/auth/logout`
Clears the `wstar_os_session` authentication cookie.

---

## 2. Artificial Intelligence Services (Gemini)

### `POST /api/os/ai/classify`
NLP natural language classification for quick capture items.

- **Rate Limit:** 30 requests / minute / IP
- **Model Used:** `gemini-3.5-flash-lite`
- **Request Body:**
  ```json
  {
    "text": "Fatal null check operator exception on pdf rendering in Ace Acad",
    "context": "Reported during 100L student test run"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "classification": {
      "type": "bug",
      "priority": "critical",
      "productId": "ace-acad",
      "productAreaId": "area-library",
      "assignee": "abdulaziz",
      "confidence": 0.95,
      "reasoning": "A null check exception during PDF rendering is a critical technical bug requiring Flutter code intervention."
    }
  }
  ```

---

### `POST /api/os/ai/decompose`
Deconstructs a task or bug into 3-6 actionable sequential subtasks.

- **Rate Limit:** 20 requests / minute / IP
- **Model Used:** `gemini-3.5-flash-lite`
- **Request Body:**
  ```json
  {
    "title": "Migrate Ace Acad study paths to offline Drift DB",
    "description": "Ensure Nigerian students can study with 0 data",
    "type": "task"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "result": {
      "summary": "Step-by-step Drift SQLite migration and offline synchronization plan.",
      "subtasks": [
        {
          "title": "Define StudyPathTable in Drift database schema",
          "estimatedMinutes": 30,
          "verificationCriterion": "Compiles with dart run build_runner build"
        }
      ]
    }
  }
  ```

---

### `POST /api/os/ai/digest`
Generates a daily async handoff briefing tailored for the requesting founder.

- **Rate Limit:** 10 requests / minute / IP
- **Model Used:** `gemini-flash-latest`
- **Request Body:**
  ```json
  {
    "role": "engineer",
    "itemsSummary": {
      "openBugs": 5,
      "blockedItems": 1
    }
  }
  ```

---

### `POST /api/os/ai/extract-proposal-tasks`
Parses a multi-page strategic proposal and extracts 4-8 concrete engineering and business tasks.

- **Rate Limit:** 10 requests / minute / IP
- **Model Used:** `gemini-flash-latest`
- **Request Body:**
  ```json
  {
    "proposalNumber": "PROP-002",
    "title": "SuperMemo SM-2 Adaptive Spaced Repetition",
    "problem": "...",
    "solution": "...",
    "phases": [...]
  }
  ```

---

## 3. Data Synchronization & Sanity Gateways

### `POST /api/os/sync`
Universal write dispatcher for creating, updating, or deleting Sanity CMS documents.

- **Validation:** Zod schema (`syncRequestSchema`)
- **Operations:**
  - `create`: `{ "action": "create", "document": { "_type": "workItem", ... } }`
  - `patch`: `{ "action": "patch", "documentId": "...", "patches": { "status": "done" } }`
  - `delete`: `{ "action": "delete", "documentId": "..." }`

### `GET /api/os/fetch`
Queries all active collections from Sanity Cloud (`workItems`, `proposals`, `decisions`, `feedbackItems`, `projects`, `roadmapItems`, `activities`, `products`, `productAreas`, `sources`).

- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "hasData": true,
    "data": { ... }
  }
  ```

### `GET /api/os/sources` & `POST /api/os/sources`
Manages connected knowledge sources (Google Drive docs, local markdown specifications, statutory filings) and triggers background AI entity extraction.

### `POST /api/os/sources/sync-drive`
Crawls the WSTAR Google Drive folder tree using the server-side Service Account and syncs document metadata and text content to Sanity.

### `POST /api/os/feedback/fetch-firebase`
Directly connects to Google Cloud Firestore, queries recent Ace Acad user feedback submissions, and maps them to Sanity feedback documents.

---

## Newsroom Studio Endpoints (`/api/publications/*`)

These power the password-gated Newsroom Studio at `/publications/admin`. They sit
**outside** the `src/middleware.ts` matcher (which covers `/os` and `/api/os` only),
so each handler calls `requirePublicationsSession(req)` from
`src/lib/publicationsAuth.ts` itself. A new route under `/api/publications/*` that
omits that call is public — there is no middleware backstop.

Authentication is the `wstar_pub_session` cookie: `httpOnly`, `SameSite=Strict`,
12-hour expiry, signed with `AUTH_SECRET` and scoped to `publications`. It is
independent of the WSTAR OS session.

### `POST /api/publications/auth`
Exchanges a founder password for a studio session. Takes a password only — no
email — and matches it in constant time against both `FOUNDER_PASSWORD_ABDULAZIZ`
and `FOUNDER_PASSWORD_IBRAHIM`.

- **Rate Limit:** 8 requests / minute / IP
- **Request Body:** `{ "password": "..." }`
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "session": { "key": "ibrahim", "name": "Ibrahim Abdulwahab", "initials": "IA" }
  }
  ```
- **Errors:** `401` incorrect password · `429` rate limited · `503` no founder password configured on the deployment

### `GET /api/publications/auth`
Probes the current session so the studio can restore itself on reload. Always
`200`; returns `{ "authenticated": false, "session": null }` when locked.

### `DELETE /api/publications/auth`
Clears the `wstar_pub_session` cookie.

### `GET /api/publications/items`
Returns every `announcement` document, drafts included, ordered by `publishedAt`
descending. Studio-only — the public `/publications` page uses its own CDN-backed
client and filters to `status == "published"`.

### `POST /api/publications/items`
Creates a publication. Zod-validated; `slug` is derived from the title when omitted.

- **Request Body:**
  ```json
  {
    "title": "WSTAR Closes Pre-Seed Round",
    "category": "press-release",
    "status": "published",
    "excerpt": "...",
    "publishedAt": "2026-09-21",
    "author": "WSTAR Technologies",
    "pdfUrl": "https://cdn.sanity.io/files/...",
    "pdfFilename": "wstar-pre-seed.pdf",
    "pdfSize": 482114
  }
  ```
- **Response:** `201 Created` — `{ "success": true, "item": { ... } }`

### `PATCH /api/publications/items`
Partial update; also backs the inline publish/unpublish toggle. Body is the same
shape with all fields optional plus a required `"id"`.

### `DELETE /api/publications/items`
Permanently removes a document. Body: `{ "id": "announcement-1758441599519" }`.

### `POST /api/publications/upload`
Uploads a PDF or cover image to the Sanity asset store and returns its CDN URL.

- **Body:** `multipart/form-data` with `file` and `kind` (`"pdf"` | `"image"`)
- **Limits:** PDF `application/pdf` up to 25MB · image PNG/JPEG/WebP up to 8MB
- **Response:** `{ "success": true, "assetId": "...", "url": "...", "filename": "...", "size": 482114 }`

### Shared behaviour

- Every mutation calls `revalidatePath('/publications')` so the ISR-cached public listing updates immediately rather than waiting out its 60s window.
- Documents are written in the shape `src/os/context/OSContext.tsx` already reads (keyed on `_id`), so items are shared with the OS announcements board at `/os/announcements`.
- `503` means `SANITY_API_WRITE_TOKEN` is unset. `403` means Sanity rejected the token — most often a read/viewer token where an **Editor** token is required; the response says so explicitly.
