#!/bin/bash
# Quick start — opens backend + ngrok in separate terminals
# Usage: bash scripts/start-dev.sh YOUR-DOMAIN.ngrok-free.app

NGROK_DOMAIN="${1:-YOUR-DOMAIN.ngrok-free.app}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting BestLady backend..."
echo "ngrok domain: $NGROK_DOMAIN"

# Start backend in background
cd "$ROOT/server_side/backend"
npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
until curl -s http://localhost:5000/health > /dev/null 2>&1; do
  sleep 1
done
echo "✅ Backend is up"

# Start ngrok
echo "Starting ngrok tunnel..."
ngrok http --domain="$NGROK_DOMAIN" 5000
