# Groca - Grocery Shopping E-commerce App

Groca is a production-ready full-stack grocery shopping platform with a modern React frontend, secure Express REST API backend, PostgreSQL database, and Prisma ORM.

This repository includes:
- Customer storefront with categories, filtering, cart, checkout, orders, and profile
- Admin dashboard with product/category/order/user management
- JWT authentication with role-based authorization
- PostgreSQL relational schema with Prisma migrations and seed data

## Tech Stack

### Frontend
- React.js (Vite)
- JavaScript (no TypeScript)
- React Router
- Tailwind CSS
- Axios
- React Context API (auth + cart)
- Built-in EN/BG language switcher (Bulgarian support)
- Multi-theme UI switcher (Green, Ocean, Sunset, Berry)
- Theme-aware core component styles (cards, buttons, inputs, layout shell)

### Backend
- Node.js
- Express.js
- JavaScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Helmet + CORS + rate limiting
- Zod validation

### Database
- PostgreSQL 16
- Prisma schema + migration SQL baseline + seed script

## Requirements

- Node.js 18+
- npm 9+
- Docker (optional, for PostgreSQL container)
- PostgreSQL (local or Docker)

## Project Structure

```
groca/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── prisma/
│   │   └── server.js
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Installation

1. Clone repository and go to project root:

```bash
cd groca
```

2. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## PostgreSQL Setup

### Option A: Docker

```bash
docker compose up -d
```

This starts PostgreSQL with:
- host: `localhost`
- port: `5432`
- db: `groca`
- user: `postgres`
- password: `postgres`

### Option B: Local PostgreSQL

Create a database named `groca` and update your `DATABASE_URL`.

## Environment Variables

Create `.env` files from `.env.example` values.

### Root `.env.example`

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/groca"
JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
VITE_API_URL="http://localhost:5000/api"
```

### Recommended setup
- Put backend variables in `server/.env`
- Put frontend variable in `client/.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

## Prisma Setup

Generate Prisma client:

```bash
cd server
npx prisma generate
```

## Database Migration

Initial SQL migration baseline is included:
- `server/prisma/migrations/20261004120000_init/migration.sql`

Apply migrations against your database:

```bash
cd server
npx prisma migrate dev --name init
```

## Database Seeding

Run seed script:

```bash
cd server
npm run prisma:seed
```

Seed includes:
- 1 admin user
- 2 normal users
- 10 categories
- 30 products
- example order data

### Development Admin Credentials

- Email: `admin@groca.com`
- Password: `Admin123!`

Important: This credential is for development only. Change it in non-development environments.

## Running the App

### Run frontend + backend together

```bash
npm run dev
```

### Run backend only

```bash
npm run dev --prefix server
```

### Run frontend only

```bash
npm run dev --prefix client
```

### Production build/start

```bash
npm run build
npm run start
```

## System Control Scripts

Lifecycle and port-management scripts are available in `scripts/`.

Whole system (Docker PostgreSQL + backend + frontend):

```bash
./scripts/start-system.sh
./scripts/stop-system.sh
./scripts/restart-system.sh
./scripts/status-system.sh
```

Port and app control:

```bash
./scripts/port-manager.sh status all
./scripts/port-manager.sh status server
./scripts/port-manager.sh status client
./scripts/port-manager.sh status db
./scripts/port-manager.sh start all
./scripts/port-manager.sh stop server
./scripts/port-manager.sh restart client
./scripts/port-manager.sh kill 5000
```

Default ports used by scripts:
- Server: 5000
- Client: 5173
- PostgreSQL: 5432

## Testing

### Backend integration tests (Supertest + Vitest)

```bash
npm run test --prefix server
```

### Frontend test scaffolding (Vitest + Testing Library)

```bash
npm run test --prefix client
npm run test:run --prefix client
```

## CI

GitHub Actions workflow is included at:
- `.github/workflows/ci.yml`

Pipeline runs:
- dependency installation (root, server, client)
- Prisma validation and generation
- migration deploy + seed
- backend integration tests
- frontend test run
- frontend production build
- backend startup smoke checks

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Categories
- `GET /categories`
- `GET /categories/:id`
- `POST /categories` (admin)
- `PUT /categories/:id` (admin)
- `DELETE /categories/:id` (admin)

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

Supported query params on `GET /products`:
- `page`, `limit`
- `search`
- `category`
- `minPrice`, `maxPrice`
- `sort` (`newest`, `price_asc`, `price_desc`, `name_asc`, `name_desc`)
- `featured=true`
- `discounted=true`

### Cart
- `GET /cart`
- `POST /cart`
- `PUT /cart/:itemId`
- `DELETE /cart/:itemId`
- `DELETE /cart`

### Orders
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `PUT /orders/:id/status` (admin)

### Users
- `GET /users/me`
- `PUT /users/me`
- `PUT /users/me/password`
- `POST /users/me/addresses`
- `DELETE /users/me/addresses/:addressId`

### Admin
- `GET /admin/stats`
- `GET /admin/users`

## Frontend Routes

### Customer
- `/`
- `/shop`
- `/products/:id`
- `/categories/:slug`
- `/cart`
- `/checkout`
- `/login`
- `/register`
- `/profile`
- `/orders`
- `/orders/:id`

### Admin
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/:id/edit`
- `/admin/categories`
- `/admin/orders`
- `/admin/users`

## Security Notes

- Passwords are hashed with bcrypt
- JWT auth for protected endpoints
- Role-based authorization for admin actions
- Helmet-enabled HTTP hardening
- CORS configured using `CLIENT_URL`
- Basic global rate limiter enabled
- Input validation via Zod
- Passwords and JWT secrets are never returned by API

## Architecture

Backend architecture follows:

```
routes -> controllers -> services -> Prisma -> PostgreSQL
```

- Controllers stay thin
- Business logic in services
- Centralized not-found and error middleware
- Consistent API response structure:

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Product not found"
}
```

## Notes

- Current checkout supports Cash on Delivery.
- Code structure is ready for adding Stripe or other payment providers.
- Product/category images are URL-based and can be extended for S3/Cloudinary uploads.
