# BestLady Cosmetics App

A comprehensive e-commerce platform for beauty and cosmetics products, similar to Jumia but specialized for cosmetics. This application provides a complete supply chain management system for beauty businesses.

## Project Structure

```
bestlady-app/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express API server
├── database/          # Database migrations and configs
└── README.md          # This file
```

## Features

### Frontend
- Modern React application with responsive design
- Product catalog with search and filtering
- User authentication and profiles
- Shopping cart and checkout
- Order tracking
- Wallet management
- Admin dashboard

### Backend
- RESTful API built with Node.js and Express
- User authentication with JWT
- Product and inventory management
- Order processing
- Payment integration (M-Pesa)
- AI-powered analytics and predictions
- File upload to Supabase storage

### Database
- PostgreSQL database hosted on Supabase
- Sequelize ORM for data modeling
- Automated migrations
- Models for users, products, orders, wallet transactions, etc.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Supabase)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd bestlady-app
```

### 2. Database Setup
```bash
cd database
# Ensure .env file is configured with database credentials
# Run migrations (from backend directory)
cd ../backend
npx sequelize-cli db:migrate
```

### 3. Backend Setup
```bash
cd backend
npm install
# Configure .env file with database and other settings
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Running the Application

### Development Mode

1. **Database**: Ensure PostgreSQL is running and migrations are applied
2. **Backend**: `cd backend && npm start` (runs on http://localhost:5000)
3. **Frontend**: `cd frontend && npm run dev` (runs on http://localhost:3000)

### Production Build

1. **Backend**: `cd backend && npm start`
2. **Frontend**: `cd frontend && npm run build && npm run preview`

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=BestyLady@,,254
DB_HOST=db.hfxcrdsicdfodzdfvvvn.supabase.co
DB_PORT=5432
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
SUPABASE_ACCESS_KEY=your-access-key
SUPABASE_SECRET_KEY=your-secret-key
SUPABASE_BUCKET_NAME=product-images
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Documentation

The backend provides RESTful APIs for:
- Authentication (`/api/auth`)
- Products (`/api/products`)
- Categories (`/api/categories`)
- Orders (`/api/orders`)
- Wallet (`/api/wallet`)
- AI Analytics (`/api/ai`)
- Admin (`/api/admin`)

## Database Models

- **User**: Customer and business accounts
- **Product**: Beauty products with inventory
- **Category**: Product categories
- **Order**: Customer orders
- **OrderItem**: Individual order items
- **WalletTransaction**: Financial transactions
- **AIPrediction**: AI-generated insights
- **InventoryAlert**: Stock level notifications

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, React Query
- **Backend**: Node.js, Express, Sequelize, JWT
- **Database**: PostgreSQL, Supabase
- **Storage**: Supabase Storage
- **Payments**: M-Pesa integration
- **AI**: Custom prediction models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.