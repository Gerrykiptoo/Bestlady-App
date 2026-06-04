# BestLady Beauty — AI-Powered Beauty Supply Platform

BestLady is a modern e-commerce and supply-chain platform built for Kenya's beauty
industry. It connects salons, retailers, and wholesale distributors with premium
beauty products, intelligent reordering, loyalty pricing, and seamless M-Pesa payments.

**Live app:** https://bestlady-app.onrender.com

---

## What BestLady Does

BestLady helps beauty businesses run smoothly by combining an online shop, an
AI purchase optimizer, real-time order tracking, and instant notifications in one
place. Retailers and wholesalers get pricing and tools tailored to their tier.

---

## Key Features

### For Customers (Retailers & Wholesalers)
- **Smart Catalogue** — browse and search hundreds of beauty products with images, pricing, and stock levels.
- **AI Purchase Optimizer** — analyses your cart and order history, then applies your loyalty-tier discount and recommends optimal reorder quantities. The savings appear on your cart and final receipt.
- **Tier-Based Pricing** — retail and wholesale customers see prices and discounts matched to their account level, growing from New → Bronze → Silver → Gold → Platinum as they order more.
- **Save for Later** — park a product you want but aren't ready to buy. It stays in your account and syncs across your phone and laptop.
- **Cart & Checkout** — clear order summary with subtotal, VAT, delivery, and AI savings, then pay by M-Pesa or wallet.
- **M-Pesa Payments** — pay instantly with an STK push to your phone, or scan the order's payment QR code to pay from any device.
- **Order Tracking** — follow each order through its stages (pending → paid → processing → dispatched → delivered) with a live progress tracker.
- **QR Delivery Confirmation** — when your order arrives, scan the delivery QR (or open the order) and tap "Order Delivered" to confirm receipt — instantly notifying the team.
- **Digital Receipts** — download a professional PDF receipt for every order, showing itemised pricing and your loyalty savings.
- **Instant Notifications** — get an email and WhatsApp message the moment your order is placed, paid, or its status changes.

### For Business Owners & Staff
- **Role-Based Dashboards** — Admin, Staff, Agent, Retail, and Wholesale each get a dedicated dashboard tailored to their work.
- **Admin** — manage products (add, edit, delete with image upload), view users, track revenue and analytics, and monitor live orders.
- **Staff (Operations)** — a kanban-style queue of orders to process, pack, and dispatch, with real-time updates.
- **Agent** — manage assigned clients, place orders on their behalf, and track commissions.
- **Live Market Intelligence** — compare the platform's category sales against beauty-industry demand benchmarks to spot strengths and opportunities.
- **Real-Time Updates** — new orders, payments, and delivery confirmations appear instantly across dashboards via live sockets.

---

## How It Works (Customer Journey)

1. **Sign up** as a retailer or wholesaler — you get pricing and tools for your tier.
2. **Browse** the catalogue and add products to your cart.
3. **Optimize** your cart with one tap — the AI applies your loyalty discount and suggests quantities.
4. **Save for later** anything you want to buy when you're ready.
5. **Checkout** — choose delivery (rider or pickup station) and pay by M-Pesa or wallet.
6. **Get notified** instantly by email and WhatsApp.
7. **Track** your order live until it's delivered, then confirm receipt with the QR code.
8. **Download** your receipt anytime.

---

## Technology

| Layer | Stack |
|-------|-------|
| Frontend | Vue 3, Vite, Tailwind CSS, Pinia, Chart.js |
| Backend | Node.js, Express, Socket.IO |
| Database | PostgreSQL (Supabase) |
| Payments | Safaricom M-Pesa (Daraja STK Push) |
| Notifications | Gmail SMTP (email) + Twilio (WhatsApp) |
| Storage | Supabase Storage (product images) |
| Hosting | Docker container on Render |

---

## Project Structure

```
Bestlady/
├── client_side/frontend/     # Vue 3 single-page application
│   ├── src/views/            # Pages (Home, Catalogue, Cart, Checkout, Dashboards…)
│   ├── src/components/        # Reusable UI components
│   ├── src/stores/            # Pinia state (cart, auth)
│   └── src/services/          # API + socket clients
│
├── server_side/backend/      # Express API
│   ├── src/controllers/       # Request handlers (orders, payments, AI, auth…)
│   ├── src/models/            # Sequelize models
│   ├── src/routes/            # API routes
│   └── src/services/          # M-Pesa, email, WhatsApp, AI, receipts
│
├── Dockerfile                # Multi-stage build (frontend + backend in one image)
└── docker-compose.yml        # Local full-stack with Redis
```

---

## Running Locally

**Prerequisites:** Node.js 20+, a PostgreSQL database (or Supabase), and the environment
variables below.

```bash
# Backend
cd server_side/backend
npm install
npm run dev          # starts the API on http://localhost:5000

# Frontend (separate terminal)
cd client_side/frontend
npm install
npm run dev          # starts the app on http://localhost:5173
```

### Required Environment Variables (`server_side/backend/.env`)
```
DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT     # PostgreSQL / Supabase
JWT_SECRET, JWT_REFRESH_SECRET                      # auth tokens
MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET,
MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_ENV           # M-Pesa (sandbox/production)
EMAIL_USER, EMAIL_PASS                              # Gmail SMTP (App Password)
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
TWILIO_WHATSAPP_FROM                                # WhatsApp notifications
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY            # image storage
```

---

## Deployment

The app deploys as a **single Docker container** — the backend serves the built
Vue frontend and the API from one service, so the whole app runs on one URL.

```bash
# Build and run with Docker
docker build -t bestlady .
docker run -p 5000:5000 --env-file server_side/backend/.env bestlady
```

A health endpoint is available at `/health` for uptime monitoring.

---

## License

Proprietary — © BestLady Beauty. All rights reserved.
