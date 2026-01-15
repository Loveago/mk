# MyGhanaMarketplace

Monorepo containing backend (Express + Prisma) and frontend (Next.js) for a multi-vendor marketplace inspired by Jumia.

## Structure
- `backend/`: API server
- `frontend/`: Web UI
- `docs/`: Documentation (API, architecture, payments, shipping, deployment, wireframes)
- `docker/`: Compose for local dev

## Quickstart
1. Start PostgreSQL:
   - Install PostgreSQL locally or use a cloud service (Render, Supabase, etc.)
   - Create database: `myghanamarketplace`
2. Backend:
   - `cd backend`
   - Create `.env` from `.env.example` and update `DATABASE_URL`
   - `npm install`
   - `npx prisma generate && npx prisma migrate dev --name init`
   - `npm run seed`
   - `npm run dev`
3. Frontend:
   - `cd frontend && npm install && npm run dev`

Open `http://localhost:3000` (frontend) and `http://localhost:4000/health` (backend).

## Defaults
- Platform name: MyGhanaMarketplace
- Currency: GHS
- Timezone: Africa/Accra
- Languages: English
- Payment methods: Mobile Money, Card, Cash on Delivery
- Shipping regions: Ghana regions (see docs/SHIPPING.md)
- Admin email: configured in backend `.env` and seed

See `docs/` for detailed guides.
