# AGENTS.md — MicroPOS Coding Guidelines

This file is intended for agentic coding agents operating in this repository.
Read it fully before making any changes.

---

## Repository Overview

MicroPOS is a Turborepo monorepo with two apps and three shared packages:

```
apps/
  api/   — AdonisJS 6 REST API (Node.js, TypeScript, PostgreSQL via Lucid ORM)
  web/   — SvelteKit 2 + Svelte 5 frontend (TypeScript, Tailwind CSS v4, Vite)
packages/
  ui/             — Shared React component stub library (@repo/ui)
  eslint-config/  — Shared ESLint configs (@repo/eslint-config)
  typescript-config/ — Shared tsconfig bases (@repo/typescript-config)
```

Package manager: **npm** (v11+, workspaces). Node ≥ 18 required.

---

## Commands

### Root (runs across all workspaces via Turborepo)

```bash
npm run dev          # Start all apps in development mode
npm run build        # Build all apps and packages
npm run lint         # Lint all workspaces
npm run format       # Prettier-format all .ts, .tsx, .md files
npm run check-types  # TypeScript type-check all workspaces
```

Run a single workspace with Turbo filters:

```bash
npx turbo dev --filter=web
npx turbo dev --filter=api
npx turbo build --filter=web
npx turbo lint --filter=api
```

### Frontend — `apps/web`

```bash
npm run dev              # Vite dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # svelte-check (type checking for .svelte files)
npm run check:watch      # svelte-check in watch mode
npm run lint             # ESLint
npm run test             # Run all tests once (vitest --run)
npm run test:unit        # Run vitest in watch mode
```

**Run a single test file:**

```bash
# From apps/web/
npx vitest run src/routes/page.svelte.spec.ts
```

**Run a test by name pattern:**

```bash
npx vitest run --reporter=verbose -t "should render h1"
```

Tests are split into two projects in `vite.config.ts`:

- `client` — browser tests via Playwright (Chromium, headless). Files: `**/*.svelte.{test,spec}.{js,ts}`
- `server` — Node environment. Files: `**/*.{test,spec}.{js,ts}` (non-svelte)

### Backend — `apps/api`

```bash
npm run dev          # AdonisJS dev server with HMR (node ace serve --hmr)
npm run build        # Compile TypeScript (node ace build)
npm run start        # Start compiled server (node bin/server.js)
npm run test         # Run all Japa tests (node ace test)
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # tsc --noEmit
```

**Run a single test suite:**

```bash
node ace test --suites=unit
node ace test --suites=functional
```

**Run a single test file:**

```bash
node ace test --files="tests/unit/example.spec.ts"
```

**Database migrations:**

```bash
node ace migration:run
node ace migration:rollback
node ace migration:fresh   # Drop all + re-run
```

---

## Code Style

### General

- All code is **TypeScript**. Strict mode is enabled everywhere.
- Use `"type": "module"` (ESM) in both apps — no CommonJS `require()`.
- Indentation: **tabs** in `apps/web` (matches Svelte default), **2-space** in `apps/api` (AdonisJS default).
- Trailing commas and semicolons follow Prettier defaults per workspace.

### Formatting

- Run `npm run format` from the root before committing.
- `apps/web` uses `prettier-plugin-tailwindcss` — Tailwind classes are auto-sorted.
- `apps/api` uses `@adonisjs/prettier-config`.

### Imports

**Frontend (`apps/web`):**

- Use SvelteKit path aliases: `$lib/` maps to `src/lib/`, `$lib/assets/` for static assets.
- Import order: external packages first, then internal `$lib/` aliases, then relative paths.
- No barrel re-exports unless intentional (the only one is `src/lib/index.ts`).

**Backend (`apps/api`):**

- Use `#`-prefixed subpath imports (defined in `package.json#imports`):
  - `#controllers/*`, `#models/*`, `#services/*`, `#validators/*`, `#middleware/*`, etc.
- Always prefer subpath imports over relative paths in the `app/` directory.
- Import AdonisJS services from their canonical service paths, e.g.:
  ```ts
  import router from "@adonisjs/core/services/router";
  import app from "@adonisjs/core/services/app";
  ```

### TypeScript

- Prefer `interface` for object shapes; use `type` for unions/intersections.
- Use `declare` for Lucid model properties (not assignments):
  ```ts
  @column()
  declare email: string
  ```
- Avoid `any`; use `unknown` and narrow with type guards.
- Avoid non-null assertions (`!`) unless unavoidable and justified by a comment.
- Always annotate function return types on public/exported functions.

### Naming Conventions

| Thing                 | Convention                                             | Example                                   |
| --------------------- | ------------------------------------------------------ | ----------------------------------------- |
| Files (TS/JS)         | `snake_case` (api) / `kebab-case` (web)                | `auth_middleware.ts` / `user-form.svelte` |
| SvelteKit routes      | `+page.svelte`, `+layout.svelte`                       | standard SvelteKit conventions            |
| Classes               | `PascalCase`                                           | `class UserController`                    |
| Variables / functions | `camelCase`                                            | `const fullName`, `function getUser()`    |
| DB columns            | `snake_case`                                           | `full_name`, `created_at`                 |
| Model properties      | `camelCase` (Lucid maps automatically)                 | `declare fullName: string`                |
| Constants             | `SCREAMING_SNAKE_CASE` only if truly constant/exported | `export const MAX_RETRIES = 3`            |
| Svelte components     | `PascalCase.svelte`                                    | `ProductCard.svelte`                      |

### Svelte / SvelteKit (Frontend)

- Use **Svelte 5 runes** syntax: `$props()`, `$state()`, `$derived()`, `$effect()`.
- All `<script>` blocks use `lang="ts"`.
- Component props destructured from `$props()`:
  ```svelte
  <script lang="ts">
    let { title, count = 0 } = $props();
  </script>
  ```
- CSS: use **Tailwind CSS v4** utility classes. Avoid inline styles.
- Global styles go in `src/routes/layout.css`, imported once in `+layout.svelte`.

### AdonisJS (Backend)

- Controllers live in `app/controllers/`, named `<resource>_controller.ts`.
- Models extend `BaseModel` from `@adonisjs/lucid/orm` with `@column` decorators.
- Validation uses **VineJS** (`@vinejs/vine`). Always validate request bodies in controllers.
- Authentication uses `@adonisjs/auth` with Lucid's `withAuthFinder` mixin.
- Route definitions belong in `start/routes.ts`. Group related routes with `router.group()`.
- Use `env.get()` (from `#start/env`) for all environment variables — never `process.env` directly.

### Error Handling

**Backend:**

- Extend `ExceptionHandler` in `app/exceptions/handler.ts` for global HTTP error handling.
- Use AdonisJS's built-in HTTP exceptions (`E_VALIDATION_ERROR`, `E_UNAUTHORIZED_ACCESS`, etc.) rather than throwing plain `Error` objects in controllers.
- Log via AdonisJS logger, not `console.log`.

**Frontend:**

- Use SvelteKit's `+error.svelte` pages for route-level errors.
- Validate user input on the client before sending requests; show inline error messages.

### Testing

**Frontend (Vitest + vitest-browser-svelte):**

- Test files: `*.spec.ts` (server) or `*.svelte.spec.ts` (browser/component).
- Use `render()` from `vitest-browser-svelte` for component tests.
- Use `page.getByRole()` / `page.getByText()` queries (accessibility-first).
- Every test must have at least one assertion (`expect.requireAssertions` is enforced).

**Backend (Japa):**

- Unit tests: `tests/unit/**/*.spec.ts`
- Functional tests: `tests/functional/**/*.spec.ts`
- Use `@japa/api-client` for HTTP integration tests.
- Test bootstrap is in `tests/bootstrap.ts` — do not modify without understanding the setup.

---

## Environment Setup

Copy `apps/api/.env.example` to `apps/api/.env` and fill in PostgreSQL credentials before running the API. Required variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`.
