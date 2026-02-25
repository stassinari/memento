# AGENTS.md

Guidance for agentic coding tools working in this repo.

## Project Overview

Memento is a coffee brewing tracker web app built with React, TypeScript, and PostgreSQL. It tracks coffee beans, filter/brew coffee, espresso shots, and tastings. The app is designed as a PWA for a native-like mobile experience.

## Branch Strategy

- `main` is the main development branch.

## Repo Notes

- `srcOld/` is gitignored legacy source for reference only.
- File-based routing lives in `src/routes/` (TanStack Start).
- Generated file: `src/routeTree.gen.ts` (do not edit by hand).

## Commands

```bash
# Dev server
pnpm dev

# Build and preview
pnpm build
pnpm serve
pnpm build:preview

# Type check
pnpm type-check
pnpm type-watch

# Lint
pnpm lint
pnpm lint:fix

# Tests (Vitest)
pnpm test            # watch mode
pnpm test:run        # single run
pnpm test:ui         # UI runner
pnpm test:coverage   # coverage

# Tests (Playwright)
pnpm test:e2e
pnpm test:e2e:ui

# Database (Drizzle)
pnpm db:generate     # generate migrations
pnpm db:migrate      # apply migrations
pnpm db:push         # push schema (dev only)

# Firebase emulators (Auth only)
pnpm emulators:start
pnpm emulators:start:empty
```

### Run a single test

```bash
# Vitest: by file
pnpm test -- src/__tests__/lib/decent-parsers.test.ts
pnpm test:run -- src/__tests__/lib/decent-parsers.test.ts

# Vitest: by test name
pnpm test -- -t "parses tcl"
pnpm test:run -- -t "parses tcl"

# Playwright: by file
pnpm test:e2e -- tests/espresso.spec.ts

# Playwright: by title grep
pnpm test:e2e -- -g "uploads decent shot"
```

## Code Style Guidelines

### Imports and module boundaries

- Import order: external packages, then `~` alias imports, then relative imports.
- Keep side-effect imports (fonts, CSS) near the top of the file.
- Use the `~` alias for `src` (`~/...`) instead of long relative paths.
- Do not access the database from client code; use server functions or API routes.

### Formatting and layout

- No explicit formatter is configured; match the surrounding file style.
- Prefer two-space indentation (current files are 2 spaces).
- Keep JSX props aligned and wrapped the same way as neighbors.
- Favor `const` for bindings and immutable arrays/objects; use `as const` for literals.

### TypeScript and types

- `strictNullChecks` is enabled; treat nullable DB fields as `T | null`.
- Prefer explicit return types on exported functions and server handlers.
- Use `interface` or `type` for props and input data (see `BeansFormInputs`).
- For discriminated unions (e.g. `origin`), validate in `inputValidator` or helpers.
- Use `Record<...>` and `Readonly<...>` when it improves clarity.

### Naming conventions

- Components: `PascalCase` (`BeansForm`, `ErrorFallback`).
- Hooks: `useCamelCase` (`useInitUser`, `useScreenMediaQuery`).
- Server functions: `get*`, `add*`, `update*`, `delete*` in `src/db/*`.
- Route params use TanStack Start conventions (`$espressoId`, `$brewId`).
- Constants and variables: `camelCase`; enum-like values in `PascalCase` or `SCREAMING_SNAKE` only when already established.

### Error handling

- Server functions: validate inputs with `inputValidator`, `throw` meaningful `Error`s on invalid data.
- Wrap DB work in `try/catch`, log with `console.error`, and rethrow when callers should see failures.
- API routes return `Response` objects with JSON and proper status codes.
- UI errors are surfaced via `ErrorBoundary` + `ErrorFallback`.

### Data access patterns

- Use `createServerFn` for all DB reads/writes.
- Enforce ownership: always filter by `context.userId` for user data.
- Prefer `db.query.*` helpers and `drizzle-orm` composables (`eq`, `and`, `desc`).
- Normalize output: if returning nested data, spread `beans`, `brews`, `espressos` like existing handlers.

### React + TanStack conventions

- Use TanStack Router file routes under `src/routes/`.
- Use `useSuspenseQuery` and `useMutation` with invalidation (see existing routes/components).
- Wrap async screens in `<Suspense>` and show fallback UI.

### Styling

- Tailwind CSS 4 is the primary styling system.
- Prefer existing components in `src/components/` over ad-hoc markup.
- Keep class strings readable and consistent with neighboring code.

## Tests and fixtures

- Unit tests live in `src/__tests__` and use Vitest.
- Test filenames end with `.test.ts`.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `VITE_FB_*` — Firebase client config (Auth only)
- `SENTRY_DSN` — Error tracking

## Tooling and versions

- Package manager: `pnpm@10.28.2`
- Node: `>=22` (see `package.json` engines)
- Linting: `oxlint` (see `.oxlintrc.json`)

## Cursor/Copilot rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found in this repo.
