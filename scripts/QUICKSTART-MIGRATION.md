# Quick Start: Migrate Pages to Routes

## TL;DR

```bash
# 1. Run migration
node scripts/migrate-pages-to-routes.js

# 2. Review changes
git diff src/routes/

# 3. Fix any navigation calls (check migration-log.txt for warnings)

# 4. Test
pnpm type-check
pnpm start
# Click through your app and test

# 5. Delete pages folder
node scripts/cleanup-pages.js

# 6. Commit
git add -A
git commit -m "Migrate pages to routes for TanStack Router"
```

## What to Look For

### ⚠️ Navigation Calls

Search for `navigate(` in migrated files and update to TanStack Router syntax:

```tsx
// ❌ Old
navigate(`/beans/${id}`);

// ✅ New
navigate({ to: "/beans/$beansId", params: { beansId: id } });
```

### ⚠️ Type Errors

If you get import errors:
```bash
pnpm type-check
```

Usually just need to add/remove `../` in import paths.

## Manual Review Checklist

- [ ] No more imports from `../pages/` in route files
- [ ] All `navigate()` calls updated
- [ ] Type check passes: `pnpm type-check`
- [ ] App starts: `pnpm start`
- [ ] Click through main flows (add beans, add brew, etc.)
- [ ] Tests pass: `pnpm test:e2e`

## Rollback

If something breaks:
```bash
git checkout src/routes/
```

## Files Created

- `scripts/migrate-pages-to-routes.js` - Main migration script
- `scripts/cleanup-pages.js` - Deletes pages folder (run after verification)
- `scripts/README-MIGRATION.md` - Detailed documentation
- `migration-log.txt` - Created after running migration (detailed log)

## Need Help?

Check `README-MIGRATION.md` for detailed docs.
