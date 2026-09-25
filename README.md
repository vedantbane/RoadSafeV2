# RoadSafe

RoadSafe is a Next.js road-hazard reporting application backed by Neon Postgres.

## Deploy on Vercel

1. Import `vedantbane/RoadSafeV2` into Vercel.
2. Use the default Next.js framework preset. The repository already includes the build configuration.
3. Add these environment variables in the Vercel project settings:
   - `DATABASE_URL` — Neon Postgres connection string.
   - `JWT_SECRET` — a long, random production secret.
   - `NEXT_PUBLIC_APP_URL` — the deployed site URL, for example `https://your-project.vercel.app`.
4. Run `database/schema.sql` once against the Neon database.
5. Deploy.

Vercel installs dependencies with the lockfile/package manifest and runs `npm run build`.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/reports`
- `POST /api/reports`
- `PATCH /api/reports/[id]`
- `GET/PATCH /api/admin/reports`
