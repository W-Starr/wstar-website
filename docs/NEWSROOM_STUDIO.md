# Newsroom Studio — `/publications/admin`

A password-gated publishing surface for the public newsroom at `/publications`.
It exists so a founder can post an announcement, press release, publication, or
report — upload the PDF, write the summary, publish — without signing into the
full WSTAR Operating System.

---

## 1. Access

| | |
|---|---|
| **URL** | `/publications/admin` (`https://wstartech.ng/publications/admin` in production) |
| **Password** | Either `FOUNDER_PASSWORD_ABDULAZIZ` **or** `FOUNDER_PASSWORD_IBRAHIM` |
| **No email** | The gate takes a password only; the server works out which founder it belongs to and shows their name in the header |
| **Session** | Scoped, `httpOnly`, `SameSite=Strict` cookie `wstar_pub_session`, valid 12 hours, signed with `AUTH_SECRET` |
| **Discoverability** | Unlinked from site navigation, `noindex, nofollow`, absent from `sitemap.xml`, disallowed in `robots.txt` |

In development only, when neither founder password env var is set, the same dev
fallbacks used by `/os/login` apply (`dev_wstar_abdulaziz` / `dev_wstar_ibrahim`).
In production, an unset password means the studio refuses every attempt with a
503 rather than falling back to anything.

### Why a separate session from WSTAR OS

The OS session (`wstar_os_session`) grants access to roadmap, proposals,
decisions, sources, and financial context. Posting a press release should not
require handing out that much surface area, so the studio issues its own
short-lived cookie scoped to publishing alone. The two are independent: signing
into one does not sign you into the other.

---

## 2. What the studio does

- **Dashboard** — total / live / drafts counts and the date of the last published item.
- **Search & filter** — by title, summary, author, or PDF filename; by status (All / Live / Drafts); by category.
- **Editor drawer** — title, auto-generated URL slug (editable), category, visibility, date, summary with a character counter, attribution, PDF upload (drag-and-drop, up to 25MB, with real upload progress), and an optional cover image (PNG/JPEG/WebP, up to 8MB).
- **Live public preview** — renders the exact card the reader sees on `/publications`, updating as you type.
- **Inline publish / unpublish** — flip an item live or hide it without opening the editor.
- **Copy PDF link**, **edit**, and **two-step delete** on every row.
- **Keyboard** — `Esc` closes the editor, `Ctrl`/`⌘ + S` saves.

### Guardrails

- Publishing is blocked until a PDF is attached. Drafts may be saved without one.
- Drafts are never returned by the public `/publications` query (`status == "published"`).
- Title ≥ 3 characters, summary ≥ 10 characters, enforced client-side and again with Zod on the server.
- Unlock attempts are rate limited to 8 per minute per IP and logged under `NEWSROOM-AUTH`.

---

## 3. Architecture

```
/publications/admin  (client, force-dynamic, outside MarketingShell)
  ├─ LockScreen.tsx         password gate
  ├─ NewsroomStudio.tsx     dashboard, list, filters, toasts
  └─ PublicationEditor.tsx  drawer form, uploads, live preview
          │
          ▼
/api/publications/auth      POST unlock · GET probe · DELETE lock
/api/publications/items     GET list · POST create · PATCH update · DELETE remove
/api/publications/upload    POST PDF (kind=pdf) or cover image (kind=image)
          │
          ▼
  SANITY_API_WRITE_TOKEN → announcement documents + asset store
```

Key files:

| File | Role |
|---|---|
| `src/lib/publicationsAuth.ts` | Password matching (constant-time), JWT session, `requirePublicationsSession()` guard |
| `src/lib/sanityWrite.ts` | Shared server-only Sanity client built from `SANITY_API_WRITE_TOKEN` |
| `src/app/api/publications/*` | The three route handlers above |
| `src/app/publications/admin/*` | Page, components, and `studio.module.css` |

### Why the routes guard themselves

`src/middleware.ts` matches `/os/:path*` and `/api/os/:path*` only. The studio
lives outside that matcher deliberately — it must not redirect to `/os/login` —
so **every** studio route calls `requirePublicationsSession(req)` itself. Adding
a new `/api/publications/*` route without that call leaves it open to the public.

### Shared dataset with WSTAR OS

Studio documents are written in exactly the shape `src/os/context/OSContext.tsx`
already reads (`_type: "announcement"`, keyed on `_id`). An item posted here
appears on the OS announcements board at `/os/announcements`, and an item created
there appears in the studio. One dataset, two surfaces — no sync step.

After every mutation the studio calls `revalidatePath('/publications')` so the
ISR-cached public listing updates immediately instead of waiting out its 60s
window.

---

## 4. The Sanity token must allow writes

`SANITY_API_WRITE_TOKEN` has to be an **Editor**-scoped token. A read/viewer
token is a silent trap: the studio unlocks, the list of publications loads
normally, and then every save fails — reads work, mutations do not.

The studio names this failure explicitly rather than showing a generic error:

> Sanity rejected the write: SANITY_API_WRITE_TOKEN is read-only. Create a token
> with Editor permissions in Sanity (Manage → API → Tokens) and redeploy.

To fix it: [sanity.io/manage](https://www.sanity.io/manage) → project `qx20j59l`
→ **API → Tokens → Add API token** → role **Editor** → copy the value into
`SANITY_API_WRITE_TOKEN` in `.env.local` and in Vercel, then redeploy.

---

## 5. Posting a publication

1. Open `/publications/admin` and enter your founder password.
2. **New publication**.
3. Title, category, date, and a summary — the preview at the bottom of the drawer shows what a reader will see.
4. Drop the PDF into the upload zone and wait for it to finish.
5. Set **Visibility** to *Published — live*, then **Save & publish**. Or leave it on *Draft — hidden* and publish later from the row's **Publish** button.
6. Open **Public page** in the header to confirm it is live.

To take something down, use **Unpublish** — it leaves the document and its PDF
intact and simply hides it from `/publications`. **Delete** is permanent.
