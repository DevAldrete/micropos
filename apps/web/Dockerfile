# ─────────────────────────────────────────────
# Stage 1: build
# ─────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Copy monorepo root manifests and lockfile first (layer cache)
COPY package.json package-lock.json ./

# Copy workspace package manifests
COPY apps/web/package.json ./apps/web/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install all dependencies
RUN npm ci --workspace=web --include-workspace-root

# Copy the full web source
COPY apps/web/ ./apps/web/
COPY packages/ ./packages/

# Build the SvelteKit app (outputs to apps/web/build/)
WORKDIR /app/apps/web
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: runtime
# ─────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

# adapter-node outputs a standalone build — copy it directly
COPY --from=builder /app/apps/web/build ./

# The adapter-node build bundles its own dependencies,
# but we still need a package.json for the Node module resolution
COPY --from=builder /app/apps/web/package.json ./package.json
RUN npm ci --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"]
