# Google OAuth Configuration Checklist

This document lists all the configuration steps required to make Google OAuth login work on XPEAK. The code fix alone is not sufficient — these external configurations must be completed in Supabase and Google Cloud Console.

## Code-side fix (DONE)
- ✓ Updated `src/pages/Auth.tsx` to use `import.meta.env.VITE_SITE_URL` instead of `window.location.origin`
- ✓ Added `.env` with `VITE_SITE_URL=http://localhost:5173` (development)
- ✓ Added `.env.production` with `VITE_SITE_URL=https://xpeak.es` (production)
- ✓ Improved error messages to distinguish configuration errors from network errors

## Configuration steps (MANUAL — must be done in dashboards)

### Supabase Dashboard (https://supabase.com/dashboard)

- [ ] **Step 1: Configure Site URL**
  - Project: XPEAK
  - Go to: Authentication → URL Configuration
  - Set **Site URL** to: `https://xpeak.es`
  - Save

- [ ] **Step 2: Add Redirect URLs**
  - In the same URL Configuration section
  - Add **Redirect URL**: `https://xpeak.es/auth`
  - Save

- [ ] **Step 3: Enable Google Provider**
  - Go to: Authentication → Providers → Google
  - Toggle **Google** to **ON**
  - Note: If credentials are already configured, the toggle will show enabled
  - **Copy the Supabase callback URL** (something like `https://ddrqhwravupjzysriblq.supabase.co/auth/v1/callback`) — you'll need this for Google Cloud Console

### Google Cloud Console (https://console.cloud.google.com)

- [ ] **Step 4: Add Supabase callback to Google OAuth**
  - Project: XPEAK (or whichever has your OAuth credentials)
  - Go to: APIs & Services → Credentials
  - Find and edit the **OAuth 2.0 Client ID** for Web
  - In **Authorized redirect URIs**, add:
    - `https://ddrqhwravupjzysriblq.supabase.co/auth/v1/callback` (copy from Supabase step 3)
  - Save

- [ ] **Step 5: Add production origin to Google OAuth**
  - In the same OAuth 2.0 Client ID
  - In **Authorized JavaScript origins**, add:
    - `https://xpeak.es`
  - Optionally, also add for development/staging:
    - `http://localhost:5173`
    - `https://vercel-preview-url.vercel.app` (if using Vercel staging)
  - Save

## What happens without these steps?

If the code is updated but Supabase/Google are not configured:
- Users click "Continuar con Google"
- Google redirects to Supabase with the correct callback URL
- Google checks: "Is this redirect URI authorized?" → NO
- Error: `Error 400: redirect_uri_mismatch` or similar
- User sees: "Google login no está configurado. Usa email y contraseña."

## Environment variables

**Development (.env)**
```
VITE_SITE_URL=http://localhost:5173
```

**Production (.env.production)**
```
VITE_SITE_URL=https://xpeak.es
```

These are read by the code at runtime via `import.meta.env.VITE_SITE_URL`.

## Testing the fix

1. Local: Click "Continuar con Google" → should redirect to `http://localhost:5173/auth` after auth
2. Production: Click "Continuar con Google" → should redirect to `https://xpeak.es/auth` (never a Vercel preview URL)

If you get the "no está configurado" error, check:
1. Is Google enabled in Supabase? (Step 3)
2. Is the Supabase callback URL in Google Cloud? (Step 4)
3. Is xpeak.es in the JavaScript origins? (Step 5)

---

**Status**: Configuration checklist created for reference. Run through steps 1-5 in the dashboards to complete the setup.
