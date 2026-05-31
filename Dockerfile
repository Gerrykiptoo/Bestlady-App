# ══════════════════════════════════════════════════════════════
# Stage 1 — Build the Vue.js frontend
# ══════════════════════════════════════════════════════════════
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy only package files first (better layer caching)
COPY client_side/frontend/package*.json ./
RUN npm ci --prefer-offline

# Copy source and build
COPY client_side/frontend/ ./
# Pass build-time env vars (set these in your CI/CD or docker build command)
ARG VITE_BACKEND_URL
ARG VITE_BUSINESS_WHATSAPP=254703888085
ARG VITE_BUSINESS_EMAIL=kipgerry02@gmail.com
ARG VITE_BUSINESS_PHONE=+254703888085
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_BUSINESS_WHATSAPP=$VITE_BUSINESS_WHATSAPP
ENV VITE_BUSINESS_EMAIL=$VITE_BUSINESS_EMAIL
ENV VITE_BUSINESS_PHONE=$VITE_BUSINESS_PHONE
RUN npm run build

# ══════════════════════════════════════════════════════════════
# Stage 2 — Production backend image
# ══════════════════════════════════════════════════════════════
FROM node:20-alpine AS production

# DevSecOps: run as non-root user
RUN addgroup -S bestlady && adduser -S bestlady -G bestlady

WORKDIR /app

# Install backend dependencies only (no dev deps)
COPY server_side/backend/package*.json ./
RUN npm ci --omit=dev --prefer-offline && npm cache clean --force

# Copy backend source
COPY server_side/backend/src/ ./src/
COPY server_side/backend/seeders/ ./seeders/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./client_side/frontend/dist

# DevSecOps: create logs dir and set ownership
RUN mkdir -p logs uploads && chown -R bestlady:bestlady /app

# Switch to non-root user
USER bestlady

# Expose backend port
EXPOSE 5000

# Health check — Docker will restart container if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start backend (serves API + built frontend in production)
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
