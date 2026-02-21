# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memento is a coffee brewing tracker web app built with React, TypeScript, and PostgreSQL. It tracks coffee beans, filter/brew coffee, espresso shots, and tastings. The app is designed as a PWA for native-like experience on mobile devices.

## Branch Strategy

- **`master`** - Main development branch. All new work happens here.

**Note:** There's a `srcOld/` folder (gitignored) containing legacy source for reference. Ignore it unless explicitly mentioned.

## Development Commands

```bash
# Development server (TanStack Start / Nitro)
pnpm dev

# Build and type checking
pnpm build
pnpm type-check

# Database (Drizzle)
pnpm db:generate  # Generate migrations from schema changes
pnpm db:migrate   # Run pending migrations
pnpm db:push      # Push schema directly (dev only)

# Tests
pnpm test           # Vitest watch mode
pnpm test:run       # Single test run
pnpm test:coverage  # Coverage report
pnpm test:e2e       # Playwright end-to-end tests

# Firebase emulators (Auth only)
pnpm emulators:start          # With auth seed data
pnpm emulators:start:empty    # Fresh emulators
```

## Architecture

### Frontend Stack

- **React 19** with TypeScript, **Vite** bundler, **Tailwind CSS 4** for styling
- **TanStack Start** for full-stack routing and SSR (file-based routes in `src/routes/`)
- **TanStack Query** for data fetching and caching (`useSuspenseQuery`, `useMutation`)
- **Jotai** for minimal global state (user auth atom in `src/hooks/useInitUser.tsx`)
- **react-hook-form** for form handling
- **Recharts** for Decent Espresso shot visualization

### Backend

- **PostgreSQL** as the primary database
- **Drizzle ORM** (`src/db/schema.ts`) for type-safe queries and migrations
- **TanStack Start server functions** (`createServerFn`) for type-safe RPC — defined in `src/db/queries.ts` and `src/db/mutations.ts`
- **Nitro** as the server runtime (Netlify preset for deployment)
- **Firebase Auth** for authentication (Google login + email/password + guest access)

### Data Model

Schema defined in `src/db/schema.ts`. Core tables:

- `users` — `id` (UUID), `fbId` (Firebase UID), `secretKey` (Decent machine auth)
- `beans` — Coffee bean bags; single-origin or blend, with freeze/thaw dates, computed `isFrozen` / `isOpen` columns
- `brews` — Filter/brew coffee entries with grinder settings and tasting scores
- `espresso` — Espresso shots; manual or from Decent machine (`fromDecent` flag)
- `espressoDecentReadings` — Time-series JSONB arrays (pressure, flow, weight, temperature) for Decent shots
- `tastings` — Per-bean tasting notes

Inferred TypeScript types live in `src/db/types.ts`.

### Key Patterns

**Server Functions** (`src/db/queries.ts`, `src/db/mutations.ts`):

- All data access goes through `createServerFn()` — no direct DB calls from the client
- Server functions resolve Firebase UID → PostgreSQL UUID and verify ownership before returning data

**Auth Flow**:

- Firebase Auth client-side listener managed by `useInitUser()` (Jotai atoms)
- Route `beforeLoad` hooks call `getAuthInitPromise()` to gate protected routes
- Server functions receive the Firebase UID token and look up the corresponding PostgreSQL user

**Query Pattern**:

- Routes define `queryOptions()` for reusable query definitions
- Components use `useSuspenseQuery()` for data, wrapped in `<Suspense>` boundaries
- Mutations use `useMutation()` with query invalidation on success

**Form Components** (`src/components/form/`):

- Wrapped react-hook-form components with suggestion support
- `FormSuggestions` provides one-tap autosuggestions from previous entries

### Decent Espresso Integration

The `/api/decent-shots` route (server function) receives shot files (TCL or JSON format) from Decent Espresso machines, authenticated via the user's `secretKey`. Shot time-series data is stored in `espressoDecentReadings`.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `VITE_FB_*` — Firebase client config (Auth only)
- `SENTRY_DSN` — Error tracking
