# Pages to Routes Migration Script

## What This Script Does

Automatically migrates page components from `src/pages/` into `src/routes/` files:

1. ✅ Finds all route files importing from `../pages/`
2. ✅ Reads the page component
3. ✅ Merges component code into route file
4. ✅ Adjusts import paths (adds extra `../` for deeper route nesting)
5. ✅ Updates `react-router-dom` imports to `@tanstack/react-router`
6. ✅ Removes page import from route
7. ⚠️  Flags navigation calls that may need manual review

## Usage

```bash
# Run the migration
node scripts/migrate-pages-to-routes.js

# Review the changes
git diff src/routes/

# Test your app
pnpm start

# When satisfied, delete the pages folder
rm -rf src/pages/
```

## What Gets Changed

### Before (route file):
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../../../pages/Home";

export const Route = createFileRoute("/_auth/_layout/")({
  component: Home,
});
```

### After (route file):
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "../../../components/Heading";

export const Route = createFileRoute("/_auth/_layout/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Heading>Memento</Heading>
      <p>Content here...</p>
    </>
  );
}
```

## Import Path Adjustments

The script automatically adjusts relative imports because route files are deeper in the tree:

**Page file:** `src/pages/beans/BeansAdd.tsx`
```tsx
import { Heading } from "../../components/Heading";
```

**Route file:** `src/routes/_auth/_layout/beans/add.lazy.tsx`
```tsx
import { Heading } from "../../../../components/Heading";  // Added extra ../
```

## What Needs Manual Review

### 1. Navigation Calls

The script flags `navigate()` calls for manual review. You may need to convert:

```tsx
// Old (react-router)
navigate(`/beans/${beansId}`);

// New (TanStack Router)
navigate({ to: "/beans/$beansId", params: { beansId } });
```

### 2. Complex Navigate Patterns

```tsx
// Old
navigate(-1);  // Go back

// New
// May need to use router.history.back() or different approach
```

### 3. Link Components

Simple `<Link to="...">` should work fine, but nested routing might need updates:

```tsx
// Relative links
<Link to="./details">  // Usually works as-is

// Params
<Link to="/beans/$beansId" params={{ beansId: "123" }}>
```

## Verification Checklist

After running the script:

- [ ] All route files no longer import from `../pages/`
- [ ] App starts without errors: `pnpm start`
- [ ] Navigation works (click through your app)
- [ ] No console errors in browser
- [ ] Forms submit correctly
- [ ] Run type check: `pnpm type-check`
- [ ] Run tests: `pnpm test:e2e`

## Rollback

The script doesn't delete files, so you can always rollback:

```bash
# Discard all changes
git checkout src/routes/

# Or selectively restore files
git checkout src/routes/_auth/_layout/index.tsx
```

## Output

The script creates `migration-log.txt` with detailed info about what was processed.

## Troubleshooting

### "Page file not found"
- Check if the page file exists at the expected path
- Might be a named export vs default export mismatch

### Type errors after migration
- Run `pnpm type-check` to see specific errors
- Usually import path issues that need manual adjustment

### App doesn't start
- Check for duplicate imports
- Look for circular dependencies
- Review the migration log for warnings

## Examples

The script handles:

- ✅ Simple components (Home, Settings, etc.)
- ✅ Complex components with hooks (DrinksPage, BeansList, etc.)
- ✅ Lazy routes (add.lazy.tsx)
- ✅ Non-lazy routes (index.tsx)
- ✅ Default exports
- ✅ Named exports
- ✅ React.FC types

## Known Limitations

- ⚠️  `navigate()` calls need manual review
- ⚠️  Complex routing patterns may need adjustments
- ⚠️  Component display names are not preserved
- ⚠️  React.FC types are removed (use function declarations instead)

## After Migration

Once you've verified everything works:

```bash
# Delete the pages folder
rm -rf src/pages/

# Delete the old App.tsx if you had one
rm src/App.tsx  # If it exists and is no longer used

# Update CLAUDE.md or docs to reflect new structure

# Commit
git add -A
git commit -m "Migrate pages to routes for TanStack Router"
```
