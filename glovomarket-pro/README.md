<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Configure env values:
   - Copy `.env.example` to `.env.local`
   - Set `GEMINI_API_KEY`
   - Optional: set `VITE_API_BASE_URL` if your backend is not same-origin/proxied.
3. Run the app:
   `npm run dev`

## Backend API notes

- By default, the frontend uses **relative `/api/*`** calls in dev and relies on the Vite proxy.
- Vite proxy target defaults to `http://localhost:8000` (override with `VITE_DEV_BACKEND_URL`).
- If you see **"Failed to fetch"** during signup/login:
  1. Ensure Django backend is running on port `8000`.
  2. Ensure `VITE_API_BASE_URL` is correct for your environment (or leave it empty in local dev).
  3. If frontend is served over HTTPS, avoid pointing it to HTTP-only backend URLs (mixed-content block).
