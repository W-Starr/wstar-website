# Vercel Deployment & Environment Configuration

This guide provides instructions for deploying the **WSTAR Web Platform & Operating System** to Vercel.

---

## 1. Vercel Deployment Steps

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete WSTAR Operating System & Sanity Cloud synchronization"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository (`wstar-website`).
   - Framework Preset: **Next.js** (auto-detected).
   - Root Directory: `./` (default).

3. **Configure Environment Variables in Vercel**:
   In Vercel **Project Settings → Environment Variables**, add the following required variables:

   | Variable Name | Required | Description |
   |---|---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Public Sanity Project ID (`qx20j59l`) |
   | `NEXT_PUBLIC_SANITY_DATASET` | Yes | Public Sanity Dataset name (`production`) |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | Sanity API version (`2024-03-01`) |
   | `SANITY_API_WRITE_TOKEN` | Yes | Secret Sanity write token (server-side only) |
   | `GEMINI_API_KEY` | Yes | Google Gemini API key for WSTAR OS AI decomposition |
   | `AUTH_SECRET` | Yes | Strong random secret (32+ chars) for JWT session cookies |
   | `FOUNDER_PASSWORD_ABDULAZIZ` | Yes | Secure password for `abdulaziz@wstartech.ng` |
   | `FOUNDER_PASSWORD_IBRAHIM` | Yes | Secure password for `ibrahim@wstartech.ng` |
   | `GOOGLE_SERVICE_ACCOUNT_KEY` | Optional | Minified JSON key for Google Drive source ingestion |
   | `FIREBASE_SERVICE_ACCOUNT_KEY` | Optional | Minified JSON key for Ace Acad user feedback sync |

4. **Deploy**:
   Click **Deploy**. Vercel will build all static & dynamic routes with Turbopack and deploy to their global Edge network.

---

## 2. Sanity Studio Deployment (`studio-wstar`)

The Sanity Studio lives in the sibling directory `studio-wstar/`.

To deploy Sanity Studio to Sanity's hosted infrastructure:
```bash
cd ../studio-wstar
npm run deploy
```
This deploys the studio to `https://<your-subdomain>.sanity.studio`.

### CORS Origins Configuration:
1. Go to [sanity.io/manage](https://www.sanity.io/manage) and select project `qx20j59l`.
2. Navigate to **API → CORS Origins**.
3. Click **Add CORS origin**:
   - `https://*.vercel.app` (Allow credentials: **Yes**)
   - `https://wstartech.ng` (Allow credentials: **Yes**)
   - `http://localhost:3000` (Allow credentials: **Yes**)
