# J-Digital Solutions

Production-ready Next.js 14 agency website with a premium public marketing site and secure admin CMS dashboard.

## Stack
- Next.js 14 (App Router, TypeScript)
- TailwindCSS + shadcn/ui-style components
- Framer Motion
- Prisma ORM
- PostgreSQL (Supabase or Neon)
- NextAuth (Credentials)
- Zod + React Hook Form
- Resend email notifications
- Supabase Storage media manager

## Features
- Public pages: `/`, `/about`, `/services`, `/portfolio`, `/process`, `/pricing`, `/contact`
- Secure admin: `/admin` + protected CMS routes
- CMS sections:
  - `/admin/site`
  - `/admin/services`
  - `/admin/portfolio`
  - `/admin/process`
  - `/admin/pricing`
  - `/admin/leads` (+ CSV export)
  - `/admin/faq`
  - `/admin/testimonials`
  - `/admin/media`
  - `/admin/users`
- Contact form:
  - Zod + React Hook Form validation
  - DB lead storage
  - Resend admin email notification
  - basic in-memory IP throttle
- SEO:
  - Metadata API
  - OpenGraph/Twitter tags
  - `sitemap.xml` + `robots.txt`

## Prerequisites
- Node.js 18+ (recommended: 20+)
- npm 9+
- PostgreSQL database (Supabase Postgres, Neon, or local PostgreSQL)

## 1) Install
```bash
npm install
```

## 2) Environment Variables
Create `.env.local` from `.env.example`.

Required keys:
```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_SITE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NOTIFY_TO_EMAIL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
SMTP_TLS_REJECT_UNAUTHORIZED=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=
```

Connection string examples are included in `.env.example` for:
- Supabase Postgres
- Neon Postgres

## 3) Database Setup
Use Prisma migrations (recommended):
```bash
npx prisma migrate dev --name init
```

Or push schema directly:
```bash
npx prisma db push
```

Generate Prisma client:
```bash
npx prisma generate
```

## 4) Seed Default Data
```bash
npm run db:seed
```

Seed creates:
- full site content defaults
- 10 demo portfolio projects
- required pricing packages
- FAQ, process steps, testimonials
- default admin user:
  - email: `admin@jdigital.local`
  - password: `JDigital@12345`

Change the admin password immediately after first login at `/admin/users`.

## Local PostgreSQL Helper Commands
If using local PostgreSQL installed at `C:\Program Files\PostgreSQL\17`:
```bash
npm run db:start
npm run db:stop
```

## 5) Run Locally
```bash
npm run dev
```
`npm run dev` now auto-checks local PostgreSQL and starts it when `DATABASE_URL` points to `localhost:5432`.

Open:
- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Supabase Storage Setup
1. Create a bucket (example: `jdigital-media`) in Supabase Storage.
2. Set bucket name in `SUPABASE_STORAGE_BUCKET`.
3. Keep the bucket public if you want direct public URLs for uploaded images.
4. Set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Resend Setup
1. Create API key in Resend.
2. Set `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` (example: `J-Digital Leads <onboarding@resend.dev>` for testing).
4. For production, verify your domain in Resend and use a sender like `Leads <leads@yourdomain.com>`.
5. Set `NOTIFY_TO_EMAIL` to your admin inbox.

## SMTP Fallback (Optional)
If Resend is in test mode, you can send notifications via SMTP:
1. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
2. Optional: set `SMTP_FROM_EMAIL`.
3. For Gmail SMTP use:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=your-gmail@gmail.com`
   - `SMTP_PASS=your-16-char-app-password`
   - optional for local SSL interception only: `SMTP_TLS_REJECT_UNAUTHORIZED=false`

Test delivery:
```bash
npm run email:test
```

If `RESEND_API_KEY` is empty, contact submissions are still stored in DB but email notification is skipped.

## Vercel Deployment
1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add all environment variables from `.env.example` in Vercel project settings.
4. Set `NEXTAUTH_URL` to your production domain.
5. Set `NEXT_PUBLIC_SITE_URL` to your production domain (used for canonical/SEO URLs).
5. Deploy.

After deployment:
- run DB migration/push against production DB
- run seed once (if needed) via Vercel CLI or local against production DB

## Deployment Checklist
- Confirm all env vars are set in Vercel (including Supabase/Resend keys).
- Run `npm run lint` locally with production env values.
- Run `npm run build` locally before deploying.
- Run `npx prisma migrate deploy` (or `npx prisma db push`) against production DB.
- Seed only once if needed, then change default admin password immediately.
- Verify `/robots.txt`, `/sitemap.xml`, and social share preview image.

## Project Structure
```txt
app/
  (public routes + admin routes)
components/
  admin/
  marketing/
  ui/
lib/
  actions/
  auth, db, validators, helpers
prisma/
  schema.prisma
  seed.ts
public/
  logo.svg
  placeholders/
```

## Security Notes
- Passwords are hashed with bcrypt.
- Admin routes are protected via middleware + NextAuth.
- Server actions validate payloads with Zod.
- Contact form has lightweight IP throttling.

## Useful Commands
```bash
npm run dev
npm run build
npm run lint
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:start
npm run db:stop
```
