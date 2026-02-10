FROM node:20-slim AS builder
WORKDIR /app

# Install deps and build Next.js
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production runtime
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Install prod deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Bring built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# Start Next.js; Cloud Run injects PORT
CMD ["sh", "-c", "npm run start -- -H 0.0.0.0 -p ${PORT:-8080}"]
