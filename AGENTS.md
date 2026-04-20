# AGENTS.md

## Repository Overview

BestLady is an AI-powered beauty supply-chain platform with:

- **Frontend**: Vue 3 + Vite SPA (`client_side/frontend`)
- **Backend API**: Node.js + Express + Sequelize (`server_side/backend`)
- **Database Layer**: Sequelize migrations/seeders (`server_side/database`)

The system supports multiple roles (admin, wholesaler, retailer, agent/staff), order management, M-Pesa payments, AI insights, receipts, and QR-assisted order handling.

---

## Current Architecture

### Frontend (`client_side/frontend`)
Key stack and patterns:
- Vue 3 (Composition API)
- Vue Router (route guards + role-based navigation)
- Pinia stores (`src/stores/auth.js`, `src/stores/cart.js`, `src/stores/ui.js`)
- TailwindCSS
- Chart.js / vue-chartjs for analytics visualization
- Axios API wrapper (`src/services/api.js`)

Important UI modules:
- Global app shell: `src/App.vue`
- Navigation: `src/components/layout/Navbar.vue`
- AI assistant: `src/components/AIChatAssistant.vue`, `src/components/AIAssistantWidget.vue`
- Commerce flow: `src/views/ProductCatalog.vue`, `src/views/Cart.vue`, `src/views/Checkout.vue`, `src/views/OrderDetail.vue`, `src/views/OrderHistory.vue`
- Landing/marketing analytics: `src/views/Home.vue`
- Role dashboards:
  - Admin: `src/views/Admin/AdminDashboard.vue`
  - Retail: `src/views/Retail/RetailDashboard.vue`
  - Wholesale: `src/views/Wholesale/WholesaleDashboard.vue`
  - Agent: `src/views/Agent/AgentDashboard.vue`
  - Staff: `src/views/Staff/StaffDashboard.vue`

### Backend (`server_side/backend`)
Key stack and patterns:
- Express app and modular routes/controllers
- Sequelize ORM models and associations
- JWT auth middleware
- Role-based authorization
- M-Pesa service integration
- Receipt generation service (PDF)
- AI routes/controller with optional auth for guest conversation mode
- QR generation utility

Important backend paths:
- App/server bootstrap: `src/app.js`, `src/server.js`
- Auth middleware: `src/middleware/authMiddleware.js`
- Routes:
  - `src/routes/authRoutes.js`
  - `src/routes/orderRoutes.js`
  - `src/routes/paymentRoutes.js`
  - `src/routes/aiRoutes.js`
  - `src/routes/adminRoutes.js`
  - `src/routes/categoryRoutes.js`
  - `src/routes/productRoutes.js`
  - `src/routes/walletRoutes.js`
- Controllers:
  - `src/controllers/authController.js`
  - `src/controllers/orderController.js`
  - `src/controllers/paymentController.js`
  - `src/controllers/aiController.js`
  - `src/controllers/adminController.js`
  - `src/controllers/walletController.js`
- Services:
  - `src/services/mpesaService.js`
  - `src/services/receiptService.js`
  - `src/services/aiService.js`
- Models:
  - `src/models/User.js`
  - `src/models/Order.js`
  - `src/models/OrderItem.js`
  - `src/models/Product.js`
  - `src/models/Category.js`
  - `src/models/WalletTransaction.js`
  - `src/models/AIPrediction.js`
  - `src/models/InventoryAlert.js`
  - `src/models/UserInventory.js`

### Database (`server_side/database`)
- Sequelize migration history in `server_side/database/migrations`
- Includes order schema and recent receipt-number migration:
  - `20261015120000-add-receipt-number-to-orders.js`
- Seed data includes:
  - `server_side/backend/seeders/202403-test-users.js`

---

## What Has Already Been Worked On (from repository context)

The project has active in-progress work around:
1. Guest-visible home analytics ("Platform Insights") with charts.
2. AI assistant availability without mandatory login.
3. Optional-auth AI chat endpoint (`/api/ai/chat`) for guest + authenticated modes.
4. Login UX improvements (password visibility, role selection concepts, background sync).
5. Retail dashboard analysis parity improvements with wholesale insights.
6. Checkout and order details payment enhancements (phone capture + STK push trigger patterns).
7. QR + receipt enhancements in backend order/receipt services.
8. Navbar responsiveness and visual polish.

---

## Build, Run, and Dev Commands

### Backend
From `server_side/backend`:
- `npm install`
- `npm run dev`
- `npm start`
- `npx sequelize-cli db:migrate`
- `npx sequelize-cli db:seed:run --seed 202403-test-users.js`

### Frontend
From `client_side/frontend`:
- `npm install`
- `npm run dev` (expected on `http://localhost:5173`)
- `npm run build`
- `npm run lint`

---

## Coding Conventions

- Prefer Composition API in Vue components.
- Keep API calls centralized via `src/services/api.js`.
- Use Pinia stores for auth/cart global state.
- Use Tailwind utility classes consistently.
- Keep role checks explicit in router guards and dashboard redirects.
- In backend controllers:
  - Validate input early.
  - Use transactions for multi-step writes (orders/payments).
  - Return consistent JSON response format.
- Keep auth middleware strict for protected endpoints; use `optionalProtect` only where guest access is intentional (e.g., AI chat, public analytics where applicable).

---

## Functional Objectives Being Driven

Based on active requirements and repo direction:

1. **AI Assistant**
   - Conversational UX for guest and logged-in users.
   - Guest mode on home page without auth requirement.
   - Context-aware responses (orders/stock/recommendations) for logged-in users.

2. **Orders & Customer Visibility**
   - Every customer should clearly see order history + amounts.
   - Better detail pages with payment/status clarity.

3. **Receipts**
   - Streamlined generation.
   - Include item names, quantities, totals, and order metadata.
   - Consistent order number/receipt numbering.

4. **Payments**
   - Clickable payment actions in checkout/order detail.
   - Phone number entry for M-Pesa.
   - STK push callback-oriented UX with clear pop-up feedback.

5. **Public Landing Analytics**
   - Home page shows product/market analysis and graphs before login.
   - Showcase value to improve conversion.

---

## Known Focus Files for Next Iterations

Frontend:
- `client_side/frontend/src/App.vue`
- `client_side/frontend/src/views/Home.vue`
- `client_side/frontend/src/components/AIChatAssistant.vue`
- `client_side/frontend/src/views/OrderHistory.vue`
- `client_side/frontend/src/views/OrderDetail.vue`
- `client_side/frontend/src/views/Checkout.vue`
- `client_side/frontend/src/views/ProductCatalog.vue`
- `client_side/frontend/src/components/layout/Navbar.vue`

Backend:
- `server_side/backend/src/routes/aiRoutes.js`
- `server_side/backend/src/controllers/aiController.js`
- `server_side/backend/src/middleware/authMiddleware.js`
- `server_side/backend/src/controllers/orderController.js`
- `server_side/backend/src/controllers/paymentController.js`
- `server_side/backend/src/services/receiptService.js`
- `server_side/backend/src/services/mpesaService.js`
- `server_side/backend/src/models/Order.js`

---

## QA / Verification Checklist

Use this for quick verification after changes:

1. Home page loads with charts and analysis when logged out.
2. AI assistant opens and responds in guest mode.
3. Login + role flows still work.
4. Order history lists all customer orders with totals and statuses.
5. Order detail shows payment CTA for unpaid orders.
6. M-Pesa phone input present where needed; STK initiation shows success/failure toast.
7. Receipt download works and includes itemized names/amounts.
8. QR code is rendered for order verification/payment context.
9. No router crash/blank page on localhost:5173.
10. Tailwind classes compile correctly (including secondary palette usage).

---

## Notes

- There are multiple similarly named legacy directories (`backend/`, `frontend/`) in repo root; active implementation target for this project is primarily:
  - `client_side/frontend`
  - `server_side/backend`
- Keep new changes scoped to active paths above unless explicitly migrating legacy code.
