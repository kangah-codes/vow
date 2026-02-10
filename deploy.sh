#!/usr/bin/env bash
set -euo pipefail

# =====================
# CONFIG
# =====================
PROJECT_ID="mgp-login-v1"
REGION="us-central1"

BACKEND_SERVICE="vow-backend"
FRONTEND_SERVICE="vow-frontend"

BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

BACKEND_ENV_FILE="./backend/.env.production"
FRONTEND_ENV_FILE="./frontend/.env.production"

TARGET="${1:-all}"  # backend | frontend | all

# =====================
# HELPERS
# =====================
env_file_to_gcloud_args () {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    echo "❌ Env file not found: $file"
    exit 1
  fi

  sed '/^\s*#/d;/^\s*$/d' "$file" | tr '\n' ','
}

deploy_backend () {
  echo "🚀 Deploying backend..."

  gcloud builds submit \
    --tag "gcr.io/$PROJECT_ID/$BACKEND_SERVICE" \
    "$BACKEND_DIR"

  gcloud run deploy "$BACKEND_SERVICE" \
    --image "gcr.io/$PROJECT_ID/$BACKEND_SERVICE" \
    --region "$REGION" \
    --port 8080 \
    --allow-unauthenticated \
    --set-env-vars "$(env_file_to_gcloud_args "$BACKEND_ENV_FILE")"

  echo "✅ Backend deployed"
}

deploy_frontend () {
  echo "🚀 Deploying frontend..."

  gcloud builds submit \
    --tag "gcr.io/$PROJECT_ID/$FRONTEND_SERVICE" \
    "$FRONTEND_DIR"

  gcloud run deploy "$FRONTEND_SERVICE" \
    --image "gcr.io/$PROJECT_ID/$FRONTEND_SERVICE" \
    --region "$REGION" \
    --port 8080 \
    --allow-unauthenticated \
    --set-env-vars "$(env_file_to_gcloud_args "$FRONTEND_ENV_FILE")"

  echo "✅ Frontend deployed"
}

print_urls () {
  echo
  echo "🌍 Service URLs:"

  if [[ "$TARGET" == "backend" || "$TARGET" == "all" ]]; then
    gcloud run services describe "$BACKEND_SERVICE" \
      --region "$REGION" \
      --format="value(status.url)"
  fi

  if [[ "$TARGET" == "frontend" || "$TARGET" == "all" ]]; then
    gcloud run services describe "$FRONTEND_SERVICE" \
      --region "$REGION" \
      --format="value(status.url)"
  fi
}

# =====================
# MAIN
# =====================
case "$TARGET" in
  backend)
    deploy_backend
    print_urls
    ;;
  frontend)
    deploy_frontend
    print_urls
    ;;
  all)
    deploy_backend
    deploy_frontend
    print_urls
    ;;
  *)
    echo "❌ Unknown target: $TARGET"
    echo "Usage: ./deploy.sh [backend|frontend|all]"
    exit 1
    ;;
esac
