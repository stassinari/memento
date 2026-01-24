# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memento is a coffee brewing tracker web app built with React, TypeScript, and Firebase. It tracks coffee beans, filter/brew coffee, espresso shots, and tastings. The app is designed as a PWA for native-like experience on mobile devices.

## Development Commands

```bash
# Frontend development (runs Vite dev server)
pnpm start

# Run with Firebase emulators for local development
pnpm emulators:start          # With auth-only seed data
pnpm emulators:start:empty    # Fresh emulators
pnpm emulators:start:complete # With complete seed data

# Build and type checking
pnpm build
pnpm type-check

# Functions (in /functions directory)
cd functions
npm run build       # Compile TypeScript
npm run serve       # Build + start emulators
npm run deploy      # Deploy to default project
npm run deploy:prod # Deploy to production
```

## Architecture

### Frontend Stack

- **React 19** with TypeScript, **Vite** bundler, **Tailwind CSS 4** for styling
- **React Router v6** for routing (see `src/App.tsx` for all routes)
- **Jotai** for minimal global state (user auth atom in `src/hooks/useInitUser.tsx`)
- **react-hook-form** for form handling
- **Recharts** for Decent Espresso shot visualization

### Firebase Backend

- **Firestore** for data storage (real-time subscriptions)
- **Firebase Auth** (Google login + email/password + guest access)
- **Cloud Functions** in `/functions` for Decent Espresso machine integration

### Data Model

User data is stored under `users/{uid}/` with subcollections:

- `beans` - Coffee bean bags (single origin or blends)
- `brews` - Filter/brew coffee entries
- `espresso` - Espresso shots (with optional Decent machine data in `decentReadings` subcollection)

Types defined in `src/types/` (beans.ts, brew.ts, espresso.ts, user.ts).

### Key Patterns

**Firestore Hooks** (`src/hooks/firestore/`):

- `useFirestoreCollectionRealtime` / `useFirestoreDocRealtime` - Real-time subscriptions
- `useFirestoreCollectionOneTime` / `useFirestoreDocOneTime` - Single fetch
- `useCollectionQuery` - Builds typed Firestore queries

**Auth Flow**:

- `RequireAuth` / `RequireNoAuth` wrapper components for route protection
- `useCurrentUser()` hook throws if user not logged in

**Form Components** (`src/components/form/`):

- Wrapped react-hook-form components with suggestion support
- `FormSuggestions` provides one-tap autosuggestions from previous entries

### Decent Espresso Integration

The `/functions/src/index.ts` Cloud Function receives shot files (TCL or JSON format) from Decent Espresso machines and stores them with time-series data for pressure, flow, temperature graphs.

## Environment Variables

Firebase config via `VITE_FB_*` environment variables. Local development auto-connects to emulators when on localhost.
