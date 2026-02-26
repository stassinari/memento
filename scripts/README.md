# Scripts

This folder contains useful scripts, including:

- `test-decent-upload` to locally test the Decent Espresso machine's TCL plugin upload functionality.
- `migrate-firestore-to-postgres` to migrate data from Firestore to Postgres.
- `backfill:beans-fb-id` to reconnect Postgres beans to original Firestore bean IDs using tasting references.
- `set-admin-claims` to set the "admin" custom claim on Firebase user accounts.
- `seed-flags` to seed feature flags in the SQL database.

## Setup

Install dependencies (from the `scripts/` directory):

```bash
pnpm install --resolution-mode=highest
```

## Environment variables

Create a `.env` file in `scripts/` (or export these in your shell):

```bash
FIREBASE_SERVICE_ACCOUNT_PATH="/absolute/path/to/service-account.json"
DATABASE_URL="postgres://memento:memento@localhost:5432/memento"
USER_ID="your-firebase-user-id"  # For set-admin-claims script
```

### Migrate Firestore to Postgres

#### Dry run

Dry run only reads Firestore and prints counts:

```bash
pnpm migrate:firestore -- --dry-run
```

#### Migration

```bash
pnpm migrate:firestore
```

### Backfill beans `fb_id` from tasting references

**Note**: This is a one-time script to backfill `fb_id` for beans that are missing it, by matching tasting references to the original Firestore data. It generates SQL update statements that should be reviewed before applying.

Dry-run (recommended first):

```bash
pnpm backfill:beans-fb-id -- --log=beans-fb-id-backfill-log.json --sql=beans-fb-id-backfill-updates.sql
```

Apply only high-confidence matches (`AUTO`):

```bash
pnpm backfill:beans-fb-id -- --apply
```

Flags:

- `--include-existing` includes beans that already have `fb_id` set (default only considers null `fb_id`).
- `--log=<path>` path for JSON result log.
- `--sql=<path>` path for generated SQL updates.

### Test Decent Upload

Simulates the actual POST request from a Decent Espresso machine's TCL plugin.

#### Quick Start

```bash
# Set up credentials (one-time)
export DECENT_EMAIL="your-email@example.com"
export DECENT_SECRET_KEY="your-secret-key"  # Get from Settings page

# Test with a fixture file
pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.json
```

#### Usage

```bash
pnpm decent:upload <shot-file> [options]
```

See script for full documentation: `scripts/test-decent-upload.ts`
