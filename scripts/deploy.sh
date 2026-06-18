#!/usr/bin/env bash
# Auto-deploy bharatapp-admin-portal-api on bharatapp-prod (PM2: admin)
set -euo pipefail

APP_DIR="/home/pranav/workspace/bharatapp-admin-portal-api"
PM2_NAME="admin"
BRANCH="main"
LOG_FILE="/home/pranav/.pm2/logs/admin-deploy.log"

log() {
  echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"
}

log "Starting deploy..."

cd "$APP_DIR"

# Load nvm so npm/node match PM2 (v24.12.0)
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24.12.0 >/dev/null 2>&1 || true

log "Fetching latest code from origin/$BRANCH..."
if [ -z "${GH_DEPLOY_TOKEN:-}" ]; then
  log "ERROR: GH_DEPLOY_TOKEN is not set (add it in GitHub Actions secrets)"
  exit 1
fi
if [ -z "${GITHUB_REPO:-}" ]; then
  log "ERROR: GITHUB_REPO is not set (add it in GitHub Actions variables)"
  exit 1
fi
git fetch "https://x-access-token:${GH_DEPLOY_TOKEN}@github.com/${GITHUB_REPO}.git" "$BRANCH"
git reset --hard "FETCH_HEAD"

log "Installing dependencies..."
if [ -f yarn.lock ]; then
  yarn install --frozen-lockfile
else
  npm ci
fi

log "Building..."
npm run build

log "Restarting PM2 process '$PM2_NAME'..."
pm2 restart "$PM2_NAME" --update-env

log "Deploy finished successfully."
pm2 status "$PM2_NAME"
