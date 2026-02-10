# Vow App – Deploy to Google Cloud Run

This repository contains a Next.js frontend and a Node/Express (TypeScript) backend. Use the Dockerfiles to build images and deploy each service to Cloud Run.

## Prerequisites

- gcloud CLI authenticated to your project (`gcloud auth login`)
- Artifact Registry enabled (recommended) or Container Registry
- Docker/Buildpacks available locally (Cloud Build can also build from source)

## Quick Deploy (Cloud Run)

```bash
PROJECT_ID=mgp-login-v1
REGION=us-central1

# Backend
gcloud builds submit --tag "gcr.io/$PROJECT_ID/vow-backend" ./backend
gcloud run deploy vow-backend \
  --image "gcr.io/$PROJECT_ID/vow-backend" \
  --region $REGION \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="your-mongo-uri",JWT_SECRET="your-secret",JWT_REFRESH_SECRET="your-refresh-secret",COMPLETIONS_MODEL="claude-sonnet-4-20250514"

# Frontend
gcloud builds submit --tag "gcr.io/$PROJECT_ID/vow-frontend" ./frontend
gcloud run deploy vow-frontend \
  --image "gcr.io/$PROJECT_ID/vow-frontend" \
  --region $REGION \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_BASE_URL="https://<backend-service-url>/api",NEXT_PUBLIC_WS_URL="wss://<backend-service-url>"
```

Replace `<backend-service-url>` with the HTTPS/WS endpoint Cloud Run gives your backend service.

## Local Docker Run

- Backend: see `/Users/user74/Desktop/code/vow-app/backend/README.md`
- Frontend: see `/Users/user74/Desktop/code/vow-app/frontend/README.md`

## Source Layout

- Backend (Express + WebSocket): `/Users/user74/Desktop/code/vow-app/backend`
- Frontend (Next.js 16): `/Users/user74/Desktop/code/vow-app/frontend`

## Notes

- Cloud Run requires the service to listen on `$PORT`; both images default to 8080 and respect the injected value.
- For smaller images, Artifact Registry + Cloud Build is recommended; the provided Dockerfiles also work locally with `docker build`/`docker run`.
