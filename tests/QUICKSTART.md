# Playwright E2E Tests - Quick Start

## Quick Start

### Step 1: Set test credentials

In your shell:

```bash
export E2E_TEST_EMAIL="test@example.com"
export E2E_TEST_PASSWORD="testpassword123"
```

### Step 2: Run tests

```bash
pnpm test:e2e
```

### Optional: run with Firebase emulators

```bash
pnpm emulators:start:empty
```

## What Gets Tested

The main test (`tests/e2e/tastings-happy-path.spec.ts`) covers:

1. **Login** - Authenticates with test user
2. **Add Beans** - Creates two bean entries
3. **Tasting Setup** - Creates a tasting setup using beans variable
4. **Scoring** - Saves scoring data
5. **Verify** - Checks tasting detail and sample view

## Test Features

- Uses page object models (`tests/e2e/pages`)
- ✅ Uses role-based selectors (accessible and robust)
- ✅ Unique timestamps to avoid test conflicts
- ✅ Multi-step form navigation

## Development Tips

### Run tests with UI (recommended for development)

```bash
pnpm test:e2e:ui
```

This opens Playwright's interactive UI where you can:

- Watch tests run step-by-step
- Debug failures
- See screenshots and traces

### Run tests in headed mode

```bash
pnpm test:e2e --headed
```

See the browser window as tests run.

### Run a specific test

```bash
pnpm test:e2e tests/e2e/tastings-happy-path.spec.ts
```

### Debug a test

```bash
pnpm test:e2e --debug
```

## Adding Test IDs (Optional)

If you find selectors are fragile, you can add `data-testid` attributes to components:

```tsx
<button data-testid="add-beans-button">Add</button>
```

Then in tests:

```typescript
await page.getByTestId("add-beans-button").click();
```

## Troubleshooting

### "strict mode violation: locator resolved to 2 elements"

This happens with Headless UI components (comboboxes, etc.). **Solution**: Use `.first()`:

```typescript
// ❌ Error
await page.getByLabel("Roaster *").click();

// ✅ Fixed
await page.getByLabel("Roaster *").first().click();
```

See [PATTERNS.md](./PATTERNS.md) for more examples.

### Login fails

- Ensure `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` are set
- Ensure the account exists in the auth backend you are using

### Tests timeout

- Check that the dev server starts successfully on port 5173
- If using emulators, ensure they are running
- Increase timeout in playwright.config.ts if needed

### Elements not found

- Check if the app requires different interaction patterns
- Use Playwright UI mode to inspect the page state
- Add explicit waits if needed: `await page.waitForSelector(...)`

## Resources

- **[PATTERNS.md](./PATTERNS.md)** - Common patterns and solutions for this project
- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Locator Documentation](https://playwright.dev/docs/locators)
