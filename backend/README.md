# Backend (Express + WebSocket)

## Environment

Create `.env` (or supply vars in Cloud Run):

- `PORT` (default 3001; Cloud Run injects 8080)
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ANTHROPIC_API_KEY` (if completions used)
- `COMPLETIONS_MODEL` (default `claude-sonnet-4-20250514`)

## Local development

```bash
cd /Users/user74/Desktop/code/vow-app/backend
npm install
npm run dev
npm test
```

## Build & run locally with Docker

```bash
cd /Users/user74/Desktop/code/vow-app/backend
docker build -t vow-backend .
docker run -p 3001:8080 \
  -e PORT=8080 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  -e JWT_REFRESH_SECRET=... \
  -e COMPLETIONS_MODEL=claude-sonnet-4-20250514 \
  vow-backend
```

(Container listens on 8080; map to 3001 if you want the existing frontend defaults.)

## Deploy to Cloud Run

```bash
PROJECT_ID=mgp-login-v1
REGION=us-central1
gcloud builds submit --tag "gcr.io/$PROJECT_ID/vow-backend" .
gcloud run deploy vow-backend \
  --image "gcr.io/$PROJECT_ID/vow-backend" \
  --region $REGION \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="...",JWT_SECRET="...",JWT_REFRESH_SECRET="...",COMPLETIONS_MODEL="claude-sonnet-4-20250514"
```

## Entrypoint

`npm run start` executes `dist/server.js` (built via `npm run build`). Cloud Run injects `$PORT`; the app reads `env.PORT`.
