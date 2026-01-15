# Backend (MyGhanaMarketplace)

## Requirements
- Node.js 18+
- PostgreSQL 14+

## Environment
Create a `.env` file in `backend/` with:

```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/my_ghana_marketplace
JWT_SECRET=replace-with-strong-secret
PLATFORM_NAME=MyGhanaMarketplace
DEFAULT_CURRENCY=GHS
TIMEZONE=Africa/Accra
ADMIN_EMAIL=admin@myghanamarketplace.local
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:3000
```

## Setup
```
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

Health check: `GET http://localhost:4000/health`

## Notes
- Vendor registration is approved by admin via `POST /api/vendors/:id/approve`.
- See `docs/API.md` for endpoints.


