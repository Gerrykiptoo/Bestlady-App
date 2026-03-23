# Database Configuration

This folder contains the database configuration and migrations for the BestLady Cosmetics App.

## Database Setup

The application uses PostgreSQL database hosted on Supabase.

### Environment Variables

Copy the `.env` file from this folder and ensure the following variables are set:

```
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=BestyLady@,,254
DB_HOST=db.hfxcrdsicdfodzdfvvvn.supabase.co
DB_PORT=5432
```

### Running Migrations

To run the database migrations, navigate to the backend folder and run:

```bash
npx sequelize-cli db:migrate
```

### Database Models

The database includes the following models:
- User
- Category
- Product
- Order
- OrderItem
- WalletTransaction
- AIPrediction
- InventoryAlert

### Connection

The database connection is configured in `backend/config/config.js` and uses Sequelize ORM.