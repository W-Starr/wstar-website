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
