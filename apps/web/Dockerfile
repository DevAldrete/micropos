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

WORKDIR /app/apps/web

# PUBLIC_* env vars are baked into the bundle at build time by SvelteKit.
# Provide a build-time argument with a sensible default; override via
#   docker build --build-arg PUBLIC_API_URL=https://api.example.com
# or the docker-compose `build.args` key.
ARG PUBLIC_API_URL=http://localhost:3333
ENV PUBLIC_API_URL=$PUBLIC_API_URL

# Generate .svelte-kit/tsconfig.json and type declarations before building.
# Without this step, tsconfig.json's "extends" reference fails and
# $env/static/public virtual module is not populated.
RUN npx svelte-kit sync

# Build the SvelteKit app (outputs to apps/web/build/)
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: runtime
# ─────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

# adapter-node produces a fully self-contained build directory —
# all runtime dependencies are bundled inside it, no npm install needed.
COPY --from=builder /app/apps/web/build ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"]
