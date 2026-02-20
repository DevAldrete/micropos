# ─────────────────────────────────────────────
# Stage 1: build
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy monorepo root manifests and lockfile first (layer cache)
COPY package.json package-lock.json ./

# Copy workspace package manifests (needed for npm ci workspaces)
COPY apps/api/package.json ./apps/api/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install all dependencies (including devDeps needed for the TypeScript build)
RUN npm ci --workspace=api --include-workspace-root

# Copy the full API source
COPY apps/api/ ./apps/api/

# Build the AdonisJS app (compiles TS → build/)
WORKDIR /app/apps/api
RUN node ace build

# Prune devDependencies from the monorepo node_modules in-place.
# We do this here so the runner stage only needs to copy the pruned tree.
WORKDIR /app
RUN npm prune --omit=dev --workspace=api

# ─────────────────────────────────────────────
# Stage 2: runtime
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Compiled JS output (package.json is included by ace build)
COPY --from=builder /app/apps/api/build ./

# Pruned production node_modules from the monorepo install
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3333

ENV NODE_ENV=production
ENV HOST=0.0.0.0

CMD ["node", "bin/server.js"]
