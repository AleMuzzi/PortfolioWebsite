# ─── Build stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ─── Production stage ────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install production deps + tsx for running the TypeScript server
COPY package*.json ./
RUN npm install --omit=dev && npm install tsx

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy server source
COPY --from=build /app/server ./server

EXPOSE 3001

ENV NODE_ENV=production

CMD ["tsx", "server/index.ts"]
