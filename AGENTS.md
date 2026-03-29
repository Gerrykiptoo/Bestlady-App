# Repository Guidelines

## Project Structure & Module Organization
- **client_side/frontend**: Vue.js 3 application built with Vite. Uses **Pinia** for state management, **Vue Router** for navigation, **Tailwind CSS** for styling, and **Chart.js** for analytics visualizations.
- **server_side/backend**: Node.js Express API. Uses **Sequelize ORM** with **PostgreSQL** (hosted on Supabase), **JWT** for authentication, and **Socket.io** for real-time features.
- **server_side/database**: Contains database configurations and migrations managed via Sequelize CLI.

## Build, Test, and Development Commands

### Frontend (`client_side/frontend`)
- `npm install`: Install dependencies
- `npm run dev`: Start development server (typically on http://localhost:5173)
- `npm run build`: Build for production
- `npm run lint`: Run ESLint for code quality

### Backend (`server_side/backend`)
- `npm install`: Install dependencies
- `npm start`: Start production server
- `npm run dev`: Start development server with Nodemon
- `npx sequelize-cli db:migrate`: Run database migrations

## Coding Style & Naming Conventions
- **Frontend**: Follows Vue 3 Composition API patterns. Uses Tailwind CSS for utility-first styling.
- **Backend**: Standard Express.js patterns. Uses Sequelize models for database interactions.
- **Linting**: ESLint is configured for the frontend to maintain code quality.

## Testing Guidelines
- No specific testing framework is currently configured. Ensure manual verification of features before committing.

## Commit Guidelines
- The repository follows a loose commit convention, often using "auto-commit" for small changes or descriptive messages for feature integrations (e.g., "backend functionalities fully integrated").
