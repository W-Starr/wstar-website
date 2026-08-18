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
   In Vercel **Project Settings → Environment Variables**, add the following:

   | Variable Name | Value | Description |
   |---|---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `qx20j59l` | Public Sanity Project ID |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | Public Sanity Dataset name |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-03-01` | Sanity API version |
   | `SANITY_API_WRITE_TOKEN` | *(Your Secret Token)* | Secret Sanity write token (server-side only) |

4. **Deploy**:
   Click **Deploy**. Vercel will build all 21 static routes with Turbopack and deploy to their global Edge network.

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
