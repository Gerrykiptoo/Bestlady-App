#!/bin/bash
# DevSecOps — pre-deploy security checks
# Run: bash scripts/security-check.sh  (from project root)

# Always resolve to project root regardless of where script is called from
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
PASS=0; FAIL=0

check() {
  if (cd "$ROOT" && eval "$2") > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC} — $1"
    PASS=$((PASS+1))
  else
    echo -e "${RED}❌ FAIL${NC} — $1"
    FAIL=$((FAIL+1))
  fi
}

warn() {
  if (cd "$ROOT" && eval "$2") > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  WARN${NC} — $1"
  fi
}

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  BestLady — DevSecOps Security Check  ${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}── Secrets ─────────────────────────────${NC}"
check ".env not committed to git" \
  "! git ls-files --error-unmatch server_side/backend/.env"
check ".env.production not committed to git" \
  "! git ls-files --error-unmatch client_side/frontend/.env.production"
check "Gmail App Password is real (not placeholder)" \
  "grep -q 'EMAIL_PASS=' server_side/backend/.env && ! grep -q 'your_16_char' server_side/backend/.env"
check "Twilio Account SID starts with AC (is real)" \
  "grep -q 'TWILIO_ACCOUNT_SID=AC' server_side/backend/.env"
check "JWT_SECRET is long enough (>= 32 chars)" \
  "awk -F= '/^JWT_SECRET/{print length(\$2)}' server_side/backend/.env | awk '{exit (\$1>=32)?0:1}'"

echo ""
echo -e "${YELLOW}── Dependencies ─────────────────────────${NC}"
check "No critical npm vulnerabilities in backend" \
  "cd server_side/backend && npm audit --audit-level=critical 2>/dev/null"
check "No critical npm vulnerabilities in frontend" \
  "cd client_side/frontend && npm audit --audit-level=critical 2>/dev/null"

echo ""
echo -e "${YELLOW}── Docker / Infrastructure ──────────────${NC}"
check "Dockerfile uses non-root USER" \
  "grep -q '^USER bestlady' Dockerfile"
check "Dockerfile has HEALTHCHECK" \
  "grep -q 'HEALTHCHECK' Dockerfile"
check "docker-compose.yml exists" \
  "[ -f docker-compose.yml ]"

echo ""
echo -e "${YELLOW}── Application Security ─────────────────${NC}"
check "Rate limiting enabled (app.js)" \
  "grep -q 'rateLimit' server_side/backend/src/app.js"
check "Helmet security headers enabled" \
  "grep -q 'helmet' server_side/backend/src/app.js"
check "CORS configured (not wildcard *)" \
  "grep -q 'ALLOWED_ORIGINS' server_side/backend/src/app.js"
check "trust proxy set (for ngrok/Vercel)" \
  "grep -q 'trust proxy' server_side/backend/src/app.js"

echo ""
echo -e "${YELLOW}── Build Readiness ──────────────────────${NC}"
check ".gitignore protects .env files" \
  "grep -q 'backend/.env' .gitignore || grep -q 'server_side/backend/.env' .gitignore"
warn "Frontend not built — run 'npm run build' first" \
  "[ ! -d 'client_side/frontend/dist' ]"
check "PM2 ecosystem config exists" \
  "[ -f ecosystem.config.js ]"

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "  Results: ${GREEN}${PASS} passed${NC}  ${RED}${FAIL} failed${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

if [ $FAIL -gt 0 ]; then
  echo -e "${RED}Fix the failures above before deploying.${NC}"
  exit 1
else
  echo -e "${GREEN}All checks passed — safe to deploy! 🚀${NC}"
  exit 0
fi
