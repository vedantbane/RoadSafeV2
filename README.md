# RoadSafe

RoadSafe is a production-ready road hazard reporting platform built with Next.js and Neon Postgres.

## Tech stack
- Next.js 14
- React 18
- Neon Postgres
- JWT auth
- Zod validation

## Local setup

1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env.local` and fill values.
3. Create the database schema in Neon using `database/schema.sql`.
4. Run the app:
   npm run dev

## Production deployment on Vercel

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Set environment variables in Vercel:
   - DATABASE_URL
   - JWT_SECRET
   - NEXT_PUBLIC_APP_URL
4. Deploy.

## Database schema

Use the SQL in `database/schema.sql`.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/reports`
- `POST /api/reports`
- `PATCH /api/reports/[id]`

## Notes

The earlier HTML version was converted into a React + Next.js app to support real backend storage, auth, and Vercel deployment.
