# BOTZ Marketing Agency — website & CMS

> **Static version:** `site/` contains the same website as plain HTML, CSS and JavaScript
> (ES modules, no build step). `site/public/` is published to GitHub Pages by
> `.github/workflows/pages.yml`. See `site/README.md`.

Trilingual (Armenian / English / Russian) agency website with interactive pricing,
package comparison, a "find my package" guide, shareable estimates, lead management
and a full content-management admin.

**Stack:** Next.js 16 (App Router, server-rendered) · Payload CMS 3 (admin, auth,
drafts, versions, localization, media) · SQLite/libSQL · TypeScript · no CSS framework
(one hand-written stylesheet driven by CMS theme tokens).

| What | Where |
| --- | --- |
| Public site | `/hy`, `/en`, `/ru` (bare `/` redirects to the saved or default language) |
| Admin | `/admin` |
| Editing guide (also inside the admin → *Editing guide*) | [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) |
| Private commercial review list | [`docs/COMMERCIAL_REVIEW.md`](docs/COMMERCIAL_REVIEW.md) |

---

## 1. Install and run locally

Requirements: Node.js 20.18+ (tested on 24), npm.

```bash
npm install
cp .env.example .env          # then set PAYLOAD_SECRET (see the file for a generator)
npm run dev                    # first start creates the database schema in data/botz.db
npm run seed                   # in a second terminal: content, packages, settings (safe to repeat)
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a long passphrase' npm run admin:create
```

Open http://localhost:3000 and http://localhost:3000/admin.

> Windows PowerShell: set variables first, e.g. `$env:ADMIN_EMAIL='you@example.com'; $env:ADMIN_PASSWORD='...'; npm run admin:create`.

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (auto-syncs the schema) |
| `npm run build` / `npm start` | Production build / server |
| `npm run seed` | Create missing content. **Never overwrites** anything already saved |
| `npm run admin:create` | Create the first administrator (refuses if one exists unless `ADMIN_ADD=true`) |
| `npm run migrate` | Apply database migrations (production) |
| `npm run migrate:create <name>` | Create a migration after changing collections/fields in code |
| `npm run generate:types` / `generate:importmap` | Regenerate Payload types / admin import map after schema changes |
| `npm test` | Unit + integration tests (uses a throwaway database) |
| `npm run typecheck` | TypeScript |
| `npm run backup` / `npm run restore backups/<stamp>` | Back up / restore database + media |
| `npm run brand` | Rebuild web logo files from `brand/originals/` |

## 2. How the pieces fit

- **Content** — `src/collections` (Pages, Media, Portfolio/Case studies, Testimonials,
  Blog, Leads, Estimates, Users) and `src/globals` (Packages & prices, Package guide,
  Site settings, Design & brand, Menus & footer, Interface text ×3).
- **Pages** are built from reusable section blocks (`src/blocks/config.ts`), rendered by
  `src/components/blocks/RenderBlocks.tsx`.
- **Pricing engine** — `src/lib/pricing/engine.ts` is a pure module used by the cards,
  comparison, guide, WhatsApp text, contact form, share links *and* the server. The server
  always recalculates from the **published** catalog; browser amounts are never trusted.
- **Publishing** — every content type has drafts and revisions. Public pages read only
  published content (cached, invalidated on save). Draft preview requires a signed-in staff
  session (`/next/preview`) — a draft-mode cookie alone never shows drafts.
- **Packages & prices** is one global document, so prices, scopes and labels are published
  together as a single revision. Publishing is blocked until *Approval state = Approved*.
- **Seed state (important):** the published catalog contains the **original prices and
  package names only**. The revised service scopes from the proposal are seeded as an
  **unpublished draft** (approval: *Proposed*). Review them with Preview, then approve and
  publish. See `docs/COMMERCIAL_REVIEW.md`.

## 3. Security notes

- No public sign-up. The open "create first user" endpoint is blocked; use `npm run admin:create`.
- Roles: **Administrator** (everything, users, export, deletion), **Editor** (content,
  packages, settings), **Sales** (leads). All checks run on the server.
- Leads, estimates, settings and the pricing catalog are not readable through the public API.
- Logins lock after 5 failed attempts for 15 minutes; sessions expire after 8 hours.
- Inquiry form: server-side validation (zod), signed time-stamped form token, honeypot,
  link-spam heuristics, per-visitor rate limit, idempotent submission IDs.
- Uploads: images (PNG/JPEG/WebP/AVIF/GIF/ICO) and MP4/WebM video only, 50 MB max.
  SVG uploads are refused on purpose (they can carry scripts).
- Secrets live only in environment variables; nothing secret is sent to the browser.
- The in-memory rate limiter protects a single server process. If you run several
  instances, add a limit at the proxy/CDN as well.

## 4. Deployment

The app is a standard Node.js server (`npm run build && npm start`). It needs:

1. **A persistent database** — either a SQLite file on a persistent disk, or a hosted
   libSQL database (e.g. Turso: set `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`).
2. **Persistent media** — either the `media/` folder on a persistent disk, or an
   S3-compatible bucket (`S3_*` variables). Serverless hosts (e.g. Vercel) **must** use
   a hosted database and a bucket, because their filesystem is temporary.
3. Environment variables from `.env.example` (at least `PAYLOAD_SECRET`,
   `NEXT_PUBLIC_SERVER_URL`, `DATABASE_URL`).
4. **Contact-form emails** — set the `SMTP_*` variables (Gmail: `smtp.gmail.com`, port 465,
   `SMTP_SECURE=true`, your Gmail address and an App Password). New inquiries are emailed to
   `dadaryane@gmail.com` unless `INQUIRY_NOTIFY_TO` or *Site settings → Forms → Notify emails*
   says otherwise. Without SMTP, inquiries are only stored in *Leads* in the admin.

### Recommended: a small VPS (simplest, cheapest)

```bash
# on the server, in the project folder
npm ci
npm run build
NODE_ENV=production npm run migrate          # creates/updates tables from src/migrations
NODE_ENV=production npm run seed             # first time only (safe to repeat)
NODE_ENV=production ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create
NODE_ENV=production npm start                # behind Nginx/Caddy with HTTPS
```

Keep it running with a process manager (systemd, PM2). In production the server also
applies pending migrations automatically on start.

**Do not point production at a development database** — development auto-syncs the schema,
and Payload will (correctly) refuse to mix that with migrations.

### After changing the schema in code

```bash
npm run migrate:create describe-the-change   # commit the new file in src/migrations
npm run generate:types && npm run generate:importmap
```

Nothing is purchased or published to a domain by this repository; choose a host and
domain when you are ready.

## 5. Backups

- **Local SQLite + disk media:** `npm run backup` writes `backups/<timestamp>/` with a
  consistent database copy (`VACUUM INTO`, safe while running) and the `media/` folder.
  Schedule it daily (cron/Task Scheduler) and copy `backups/` off the server.
- **Restore:** stop the site, `npm run restore backups/<timestamp>`, start the site.
  The previous database is kept next to it as `*.before-restore-<time>`.
- **Turso / S3:** use the provider's point-in-time backups and bucket versioning.
- Content mistakes rarely need a restore: every page and setting has a revision history
  in the admin (see the editing guide).

## 6. Analytics

Disabled until `NEXT_PUBLIC_ANALYTICS_PROVIDER` and its ID are set. When enabled,
visitors are asked for consent first (can be switched off in *Site settings → Analytics*).
Events: service/package views, duration changes, comparisons, guide completion,
WhatsApp/phone/email clicks, **saved** inquiries (only after the server confirms the save),
estimate creation and language selection. No names, emails, phone numbers, messages or
notes are ever sent. A WhatsApp click is only an analytics event — never a lead.

## 7. Tests and what was verified

`npm test` runs 69 tests: price table, totals/savings, unavailable terms, inheritance and
overrides (Gold videos/community, Authority = 6 articles, bundles), add-ons, snapshots,
guide recommendations (missing website does not exclude SEO), analytics consent/dedupe/PII
stripping, WhatsApp encoding, contact routing, form tokens, rate limiting, CSV safety,
WCAG contrast of default colours, translations present; and on a real database: seed
(published vs draft, repeatable without overwriting edits), approval gate, draft isolation,
publish + restore, inquiry persistence with email failure, idempotency, server repricing,
spam handling, access control per role, no public sign-up, slug-change redirects, media
in-use protection, contrast validation, translation report, share links.
