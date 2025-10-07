# Operations Guide

## Monitoring (Sentry)
- Set `SENTRY_DSN` in Vercel env (Preview + Production)
- Client uses `VITE_SENTRY_DSN` (or inject `__SENTRY_DSN__`)
- Backend functions initialize Sentry only when DSN is present

## Analytics (PostHog)
- Set `VITE_POSTHOG_KEY` (and optional `VITE_POSTHOG_HOST`) in Vercel env
- Client initializes PostHog if key is present

## Backups
- Enable automated backups on Neon; test restore quarterly

## Runbooks
- Incident: capture error IDs from Sentry, roll back via Vercel “Promote previous”
- Performance: review Sentry traces and Vercel function logs

## CI/CD
- GitHub Actions runs install, typecheck, and build on PRs and main
- Vercel auto-deploys previews for PRs and production on main
