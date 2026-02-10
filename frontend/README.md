# Frontend (Next.js 16)

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://<backend>/api`)
- `NEXT_PUBLIC_WS_URL` (e.g. `wss://<backend>`)
- `JWT_SECRET` is unused on the client but kept for completeness.

## Local development

```bash
cd /Users/user74/Desktop/code/vow-app/frontend
npm install
npm run dev        # http://localhost:3000
npm test           # jest
```

## Build & run locally with Docker

```bash
cd /Users/user74/Desktop/code/vow-app/frontend
docker build -t vow-frontend .
docker run -p 3000:8080 \
  -e PORT=8080 \
  -e NEXT_PUBLIC_API_BASE_URL=https://localhost:3001/api \
  -e NEXT_PUBLIC_WS_URL=ws://localhost:3001 \
  vow-frontend
```

## Deploy to Cloud Run

```bash
PROJECT_ID=mgp-login-v1
REGION=us-central1
BACKEND_URL=https://<backend-service-url>

gcloud builds submit --tag "gcr.io/$PROJECT_ID/vow-frontend" .
gcloud run deploy vow-frontend \
  --image "gcr.io/$PROJECT_ID/vow-frontend" \
  --region $REGION \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_BASE_URL="$BACKEND_URL/api",NEXT_PUBLIC_WS_URL="wss://$(echo $BACKEND_URL | sed 's#^https#ws#')"
```

## Notes

- The Dockerfile builds once, then runs `npm run start` binding to `$PORT`.
- When changing env vars, redeploy the Cloud Run service so Next.js picks up the new public values.
