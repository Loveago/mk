# Multi‑Vendor eCommerce Marketplace (Jumia‑style)

This repository contains a full‑stack multi‑vendor eCommerce marketplace built with:

- Backend: Node.js + Express + Prisma (PostgreSQL by default)
- Frontend: React + Vite + Tailwind CSS
- Auth: JWT (access + refresh)
- Deployment: Docker‑ready (API + DB + Frontend)

## Quickstart

1) Copy envs and adjust values:

```bash
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

2) Start with Docker (dev):

```bash
docker compose up --build
```

3) Run migrations and seed (in another terminal):

```bash
docker compose exec api npx prisma migrate dev --name init
docker compose exec api npm run seed
```

4) Open services:

- API: http://localhost:4000
- Swagger: http://localhost:4000/docs
- Frontend: http://localhost:5173

## Structure

```
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   ├── prisma
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── src
│   ├── index.html
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## Scripts

See `backend/package.json` and `frontend/package.json` for development scripts.

## Notes

- Default DB is PostgreSQL. You can switch to MySQL by adjusting `DATABASE_URL` and Docker services.
- Prisma models are defined in `backend/prisma/schema.prisma`.
- Seed data (categories/products) is in `backend/prisma/seed.ts`.


