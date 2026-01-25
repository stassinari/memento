# Scripts

This folder contains the one-off migration tooling for moving data from
Firestore to Postgres.

## Setup

Install dependencies:

```bash
pnpm --dir scripts install --resolution-mode=highest
```

## Environment variables

Create a `.env` file in `scripts/` (or export these in your shell):

```bash
FIREBASE_SERVICE_ACCOUNT_PATH="/absolute/path/to/service-account.json"
DATABASE_URL="postgres://memento:memento@localhost:5432/memento"
```

You can also set `FIREBASE_SERVICE_ACCOUNT_JSON` instead of a file path, or use
`GOOGLE_APPLICATION_CREDENTIALS`.

## Dry run

Dry run only reads Firestore and prints counts:

```bash
pnpm migrate:firestore -- --dry-run
```

## Migration

```bash
pnpm migrate:firestore
```
