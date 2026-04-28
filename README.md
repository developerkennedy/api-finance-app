# Finance App API

A RESTful API for personal finance management — track transactions, organize categories, and manage user accounts with secure JWT authentication.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/)
- **Auth:** JWT (access token) + UUID refresh tokens (SHA-256 hashed at rest)
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit, bcryptjs

## Architecture

Clean Architecture / Ports & Adapters with constructor-based dependency injection.

```
Domain (entities + errors)
  → Application (ports/interfaces + use cases)
    → Infrastructure (Drizzle repositories + services + HTTP)
      → Composition (factories)
        → Main (server bootstrap)
```

Each layer depends only on the layer above it. Business logic lives in use cases and never touches HTTP or database directly.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone https://github.com/developerkennedy/api-finance-app.git
cd api-finance-app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/finance_db

JWT_ACCESS_SECRET=your-access-secret-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=finances-api

BCRYPT_ROUNDS=10
NODE_ENV=development
PORT=3333
```

> All variables are validated at startup via Zod. The app exits immediately on missing or invalid values.

### Database Setup

```bash
# Apply migrations
npm run db:migrate

# Or push schema directly (no migration file)
npm run db:push
```

### Running

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
node dist/main/server.js
```

## API Endpoints

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/auth/register` | No | Create a new user account |
| `POST` | `/auth/login` | No | Login and receive tokens |
| `POST` | `/auth/refresh` | No | Rotate access + refresh tokens |
| `POST` | `/auth/logout` | No | Invalidate refresh token |
| `GET` | `/auth/me` | Yes | Get authenticated user info |

### Categories

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/categories` | Yes | List all categories for the user |
| `POST` | `/categories` | Yes | Create a new category |

### Transactions

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/transactions` | Yes | List transactions (paginated) |
| `POST` | `/transactions` | Yes | Create a transaction |
| `GET` | `/transactions/:id` | Yes | Get a single transaction |
| `PUT` | `/transactions/:id` | Yes | Update a transaction |
| `DELETE` | `/transactions/:id` | Yes | Delete a transaction |

### Authentication Flow

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

**Token rotation:** On `POST /auth/refresh`, the old refresh token is invalidated and a new access + refresh token pair is returned.

### Request & Response Examples

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret@123"
}
```

> Password rules: min 8 characters, at least one uppercase letter, one digit, and one special character.

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Secret@123"
}
```
```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<uuid>"
}
```

**Create Transaction**
```http
POST /transactions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Freelance payment",
  "amount": "1500.00",
  "type": "income",
  "date": "2025-04-28T00:00:00.000Z",
  "categoryId": "<uuid>",
  "description": "Optional description"
}
```

## Project Structure

```
src/
├── application/
│   ├── ports/              # Repository and service interfaces
│   └── use-cases/          # Business logic (one file per operation)
├── auth/                   # Factory functions (dependency wiring)
├── domain/
│   ├── entities/           # Zod schemas and DTO types
│   └── errors/             # APIError domain error class
├── infra/
│   ├── database/           # Drizzle client and schema
│   ├── http/
│   │   ├── controller/     # Route handlers (one class per operation)
│   │   ├── middlewares/    # Auth middleware
│   │   └── routes.ts       # Route registration
│   ├── repositories/       # Drizzle implementations
│   └── services/           # JWT token service
├── main/
│   ├── config/env.ts       # Zod env validation
│   └── server.ts           # Express app bootstrap
└── types/
    └── express.d.ts        # req.user type augmentation
```

## Database Scripts

```bash
npm run db:generate   # Generate migration files from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:push       # Push schema directly (no migration file)
npm run db:studio     # Open Drizzle Studio (visual DB browser)
```

## License

MIT
