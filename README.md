# MicroPOS

**MicroPOS** is a free, real-time Point of Sale and ERP platform for everyone. Anyone can sign up as an owner, create their own business, and immediately get a full POS + ERP system — inventory management, payments, billing, and metrics — shareable with their employees and updated live for the whole team.

> **Completely free. No cost. No catch.**

---

## Features

- **Multi-tenant stores** — sign up as an owner and create your own business POS in seconds
- **Real-time collaboration** — all changes sync instantly across every connected employee
- **Inventory management** — track stock levels interactively and efficiently
- **Payments & billing** — manage transactions and generate invoices
- **Metrics & reporting** — dashboards to monitor your business health
- **Role-based access** — owners control what employees can see and do

---

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | SvelteKit 2 + Svelte 5, Tailwind CSS v4, TypeScript |
| Backend  | AdonisJS 6, TypeScript, PostgreSQL                  |
| Monorepo | Turborepo, npm workspaces                           |

---

## Project Structure

```
apps/
  api/   — REST API (AdonisJS 6, Lucid ORM, PostgreSQL)
  web/   — Frontend (SvelteKit 2, Svelte 5, Tailwind CSS v4)
packages/
  ui/             — Shared component library (@repo/ui)
  eslint-config/  — Shared ESLint configs (@repo/eslint-config)
  typescript-config/ — Shared tsconfig bases (@repo/typescript-config)
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 11
- PostgreSQL

### Setup

```bash
# Clone the repo
git clone https://github.com/your-org/micropos.git
cd micropos

# Install dependencies
npm install

# Configure the API environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your PostgreSQL credentials

# Run database migrations
cd apps/api
node ace migration:run
cd ../..

# Start everything in development mode
npm run dev
```

The API will be available at `http://localhost:3333` and the frontend at `http://localhost:5173`.

---

## Development Commands

```bash
npm run dev          # Start all apps in development mode
npm run build        # Build all apps and packages
npm run lint         # Lint all workspaces
npm run format       # Format all files with Prettier
npm run check-types  # TypeScript type-check all workspaces
```

Run a single app:

```bash
npx turbo dev --filter=web
npx turbo dev --filter=api
```

---

## Contributing

See [AGENTS.md](./AGENTS.md) for full coding guidelines, naming conventions, and testing instructions.

---

## License

MicroPOS is free and open source.
