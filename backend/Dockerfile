FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build TypeScript -> dist
COPY tsconfig.json tsconfig.test.json ./
COPY src ./src
RUN npm run build

# Production image
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Cloud Run expects the service to listen on $PORT (default 8080)
CMD ["node", "dist/server.js"]
