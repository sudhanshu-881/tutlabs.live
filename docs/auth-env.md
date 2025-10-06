# Auth Environment Variables (Sprint 1)

Set these in Vercel (Preview and Production) and in a local `.env` for dev.

- `DATABASE_URL` (required): Neon Postgres connection string
- `JWT_SECRET` (required): strong random string, e.g., 32+ chars
- `NODE_ENV`: `development` | `production`

Local development:
```bash
# from repo root
DATABASE_URL=postgres://...
JWT_SECRET=your_local_secret
PORT=5000
npm run dev
```

Notes:
- Cookies are `httpOnly`, `secure`, and `sameSite=lax`; in local dev over http, you may temporarily remove `secure` if needed.
- On Vercel, API routes live under `/api/*`. Client uses `fetch('/api/...')` relative calls.
