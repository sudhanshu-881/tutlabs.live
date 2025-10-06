## tutlabs.live Sprint Plan

A practical, incremental plan to deliver tutlabs (formerly “TutorConnect”) to production. Duration: ~12 weeks across 7 sprints plus post‑launch.

- Environments
  - Dev: local (`npm run dev`) with client at `http://localhost:5173`, API proxied to `http://localhost:5000`
  - Preview: Vercel Preview deployments on PRs
  - Production: Vercel Production branch (`main`)
- Data store: PostgreSQL (Neon). Schema managed by Drizzle ORM and migrations
- Monorepo: `client/` (Vite + React + TS), `server/` (Express + TS), `shared/` (Zod + DB schema), `migrations/`

---

## Sprint 0 — Foundation & Setup (1 week)
- Goals
  - Finalize repository structure, CI, deployment baseline, and developer tooling
- User stories
  - As a developer, I can run the app locally and see working health checks
- Technical tasks
  - Frontend: Vite/Tailwind setup, theme skeleton, routing (`wouter`)
  - Backend: Express app, health route, environment loading
  - DB/Schema: Drizzle config, initial empty migration
  - Infra/DevEx: Vercel project linked to GitHub, env placeholders
- Dependencies
  - GitHub repo connected to Vercel; Neon DB project created
- Acceptance criteria
  - Health endpoint returns `{ ok: true }`
  - Vercel Preview builds pass on PR
  - `npm run dev` runs client and server concurrently
- Deployment steps
  - Vercel → Project Settings → Environment Variables: `DATABASE_URL`, `NODE_ENV`, `PORT=5000`
  - Merge to `main` to trigger Production

---

## Sprint 1 — Authentication & User Management (2 weeks)
- Goals
  - Email/password authentication, roles (Tutor/Parent), basic session handling
- User stories
  - As a user, I can register with email/password and choose my role
  - As a user, I can log in/out and stay logged in across sessions
  - As a user, I can view my account info
- Technical tasks
  - Backend
    - Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/user`
    - Password hashing (`bcrypt`), session cookie/JWT, input validation (Zod)
    - Drizzle tables: `users` (id, email, password_hash, role, name, created_at)
  - Frontend
    - Pages: Register, Login
    - Form validation (React Hook Form + Zod), error states, toasts
    - Session persistence and protected route wrapper
- Dependencies
  - DB connectivity and secret management
- Acceptance criteria
  - End‑to‑end happy paths for register → login → fetch current user → logout
  - Invalid credentials and validation errors are handled with clear UI messaging
  - Automated tests for core flows (unit + minimal E2E)
- Deployment steps
  - Rotate `JWT_SECRET`/`SESSION_SECRET` in Vercel env
  - `npm run db:push` (server workspace) to update schema

---

## Sprint 2 — Tutor Profile Management (2 weeks)
- Goals
  - Let tutors create and manage detailed profiles
- User stories
  - As a tutor, I can create/update my profile (bio, education, experience, subjects, hourly rate, availability, location)
  - As any user, I can view a tutor’s profile page
- Technical tasks
  - Backend
    - Endpoints: `GET /api/tutors/profile/:userId`, `POST /api/tutors/profile`
    - Drizzle tables: `tutor_profiles` (user_id FK, bio, subjects[], rate, availability booleans, city, lat, lng)
  - Frontend
    - Pages: Tutor Profile page (public), Tutor Profile Management (authenticated)
    - Components: `TutorProfileForm` with RFF + Zod; `TutorCard`
- Dependencies
  - Authenticated user context from Sprint 1
- Acceptance criteria
  - Tutor can create, edit, and view their profile; validation enforced
  - Viewing a tutor profile displays all provided fields
- Deployment steps
  - `npm run db:push`
  - Regression: auth flows still work, profiles persist

---

## Sprint 3 — Location‑Based Search (2 weeks)
- Goals
  - Discover tutors near a specified location within a 10‑mile radius; filter by subject/rate/availability
- User stories
  - As a parent, I can search for tutors near my city and filter results
  - As a parent, I can sort results by distance or rate
- Technical tasks
  - Backend
    - Endpoints: `GET /api/tutors/nearby?lat&lng&radius&subject&maxRate&available`
    - Distance calculation (Haversine) with parameters; indexing on location columns
  - Frontend
    - `SearchFilters` component and results grid using `TutorCard`
    - Optional: Map view integration (deferred if time is tight)
- Dependencies
  - Tutor profiles require `lat/lng` and `city`
- Acceptance criteria
  - Given a city and radius, API returns tutors ordered by distance
  - Filters work together (subject + rate + availability)
- Deployment steps
  - Seed a few tutor profiles for demo
  - Monitor p95 latency for search endpoint (<300ms on cached queries)

---

## Sprint 4 — Requirements Posting (1.5 weeks)
- Goals
  - Parents can post learning requirements; tutors can browse/publicly view
- User stories
  - As a parent, I can post a requirement (subject, description, preferred schedule, city)
  - As a tutor, I can browse and filter requirements relevant to me
- Technical tasks
  - Backend
    - Endpoints: `GET /api/requirements`, `POST /api/requirements`
    - Drizzle tables: `requirements` (id, parent_user_id, subject, description, city, created_at)
  - Frontend
    - `RequirementPost` form; Requirements feed with filters
- Dependencies
  - Auth and parent role; city/location inputs
- Acceptance criteria
  - Parent can create requirement; appears in feed
  - Tutors can filter by subject/city and see consistent results
- Deployment steps
  - `npm run db:push`; data validation smoke tests

---

## Sprint 5 — Messaging System (2 weeks)
- Goals
  - Direct messaging between users with reasonable real‑time UX
- User stories
  - As a user, I can start a conversation and exchange messages
  - As a user, I can see unread counts and recent conversations
- Technical tasks
  - Backend
    - Endpoints: `GET /api/messages?peerId`, `POST /api/messages` (sender_id, recipient_id, body)
    - Drizzle tables: `messages` (id, sender_id, recipient_id, body, created_at, read_at)
    - Delivery strategy: start with short‑polling/interval fetch; evaluate WebSockets provider (Pusher/Ably) if needed on Vercel
  - Frontend
    - `MessagesPage` + `MessageThread` components; optimistic UI; unread states
- Dependencies
  - Auth; user profiles
- Acceptance criteria
  - Sending a message updates both sides on refresh within 5s (polling) or instantly if provider configured
  - No lost messages; ordering is consistent
- Deployment steps
  - If using provider: configure Pusher/Ably env vars in Vercel
  - Monitor API error rates and latency

---

## Sprint 6 — UI/UX Polish & Testing (2 weeks)
- Goals
  - Final polish, responsiveness, accessibility, and automated testing
- User stories
  - As a user, the app feels fast, consistent, and accessible
- Technical tasks
  - Theming completion (dark/light), skeletons, empty/error states, toasts
  - Add ARIA labels, keyboard navigation checks, color contrast passes
  - Testing: unit (utilities/components), integration (forms), E2E (Playwright) for critical flows
  - Performance: code‑splitting, image optimization, memoization where needed
- Dependencies
  - All core features complete
- Acceptance criteria
  - Core flows covered by E2E; lighthouse performance > 90 on key pages
  - No contrast or keyboard traps on primary flows
- Deployment steps
  - Protect main with required status checks; tag release v1.0.0

---

## Sprint 7 — Production Deployment (1 week)
- Goals
  - Harden production posture: monitoring, analytics, backups, runbooks
- Technical tasks
  - CI/CD: PR checks (type check, build), Preview deploys, auto‑promote on tag
  - Monitoring: Sentry (frontend + server functions), logging strategy
  - Analytics: PostHog or Plausible
  - Backups: Neon automated backups configured; restore drill
  - Runbooks: incident response, on‑call rotation (if applicable)
- Acceptance criteria
  - Observability in place; error budgets defined
  - Documented runbooks and rollback steps
- Deployment steps
  - Configure Sentry/Analytics env vars; confirm dashboards show events

---

## API Endpoints (initial scope)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/user`
- Tutors: `GET /api/tutors/profile/:userId`, `POST /api/tutors/profile`, `GET /api/tutors/nearby`
- Requirements: `GET /api/requirements`, `POST /api/requirements`
- Messages: `GET /api/messages`, `POST /api/messages`

---

## Risk Management Matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Vercel serverless limits for realtime | Medium | Medium | Start with polling; evaluate Pusher/Ably |
| Geocoding accuracy | Medium | Low | Allow manual city override; cache results |
| Schema churn | Medium | Medium | Schema‑first, migrations in small PRs |
| Perf regressions | Medium | Medium | CI budgets, p95 monitoring, E2E smoke |
| Secrets leakage | Low | High | Use Vercel env; never commit secrets |

---

## Success Metrics & KPIs
- Activation: % users completing profile in first session
- Engagement: searches per active user; message threads per active user
- Quality: p95 search latency < 300ms; error rate < 0.5%
- Conversion: parent requirement posts per week; tutor responses per requirement

---

## Team & Responsibilities
- Product/PM: backlog, acceptance criteria, stakeholder comms
- Frontend: UI/UX, accessibility, performance, E2E coverage
- Backend: API design, DB schema, performance, security
- QA: test plans, regression matrix, release sign‑off
- DevOps: CI/CD, observability, cost management

---

## Communication Guidelines
- Daily async standup (Slack)
- Twice‑weekly sync (30 min) for unblockers
- Weekly demo and retros
- PR etiquette: small, focused PRs; codeowners for schema

---

## Post‑Launch Maintenance
- Bug triage (Sentry/issue tracker), weekly maintenance window
- DB migrations policy, backups verification
- Performance tuning and cost review monthly

---

## Backlog (Future Iterations)
- Payments and invoicing
- Appointment scheduling/calendar sync
- Ratings and reviews
- Mobile PWA enhancements
- Advanced search (distance bands, availability slots)

---

## Deployment How‑Tos (per sprint)
- Environment variables (Vercel → Settings → Environment Variables)
  - `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, provider keys as needed
- Drizzle migrations
```bash
# run from repo root
npm run db:push
```
- Promote to Production
  - Merge PR to `main` or use Vercel “Promote to Production” on a stable preview
