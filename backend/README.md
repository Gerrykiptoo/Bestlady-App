# Backend API

This is the Node.js/Express backend for the BestLady Cosmetics App.

## Features

- User authentication and authorization
- Product management
- Order processing
- Wallet transactions
- AI-powered predictions
- Admin dashboard
- M-Pesa payment integration

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT authentication
- Supabase for file storage

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env` file and configure the database and other settings.

4. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

## Running the Server

To start the development server:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/products` - Product management
- `/api/categories` - Category management
- `/api/orders` - Order processing
- `/api/wallet` - Wallet transactions
- `/api/ai` - AI predictions
- `/api/admin` - Admin operations

## Database Connection

The backend connects to a PostgreSQL database hosted on Supabase. Ensure your `.env` file has the correct database credentials.