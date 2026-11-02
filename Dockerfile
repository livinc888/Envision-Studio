# Multi-stage production build for EnvisionStudio (Single Service: Express + React SPA)
FROM node:22-bookworm-slim AS base
WORKDIR /app

# Stage 1: Build Frontend
FROM base AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM base AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy root seed data
COPY data/mock.json ./data/mock.json

# Copy built frontend into location served by Express
COPY --from=client-builder /app/client/dist ./client/dist

# Setup production server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --omit=dev
COPY --from=server-builder /app/server/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
