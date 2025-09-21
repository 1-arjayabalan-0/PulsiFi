# PulseFi Backend

Backend for the PulseFi app using Express, TypeScript, PostgreSQL, and Prisma ORM.

## Features

- User authentication with JWT
- User profile management
- Portfolio management
- Account and sub-account system
- Transaction tracking with automatic balance updates
- RESTful API design

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- PostgreSQL database

### Installation

1. Clone the repository
2. Navigate to the backend directory

```bash
cd backend
```

3. Install dependencies

```bash
npm install
```

4. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/pulsefi?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

5. Generate Prisma client

```bash
npm run prisma:generate
```

6. Run database migrations

```bash
npm run prisma:migrate
```

7. Seed the database (optional)

```bash
npm run seed
```

8. Start the development server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Portfolios

- `POST /api/portfolios` - Create a new portfolio
- `GET /api/portfolios` - Get all portfolios for user
- `GET /api/portfolios/:id` - Get portfolio by ID
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Accounts

- `POST /api/accounts` - Create a new account
- `GET /api/accounts/:id` - Get account by ID
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Transactions

- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/account/:accountId` - Get transactions by account
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes the following models:

- User
- Profile
- Portfolio
- Account (with support for sub-accounts)
- Transaction

## License

MIT