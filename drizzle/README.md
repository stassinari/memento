# Drizzle migrations

## Run migration against different databases

### Local

```bash
pnpm db:migrate
```

### Remote dev branch DB

```bash
pnpm exec env-cmd -f ./.env.preview-dev.local pnpm db:migrate
```

### Remote prod branch DB

**Warning**: Always review generated SQL before applying, especially on production.

```bash
pnpm exec env-cmd -f ./.env.preview-prod.local pnpm db:migrate
```
