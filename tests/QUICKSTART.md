# Playwright E2E Tests - Quick Start

## 🚀 Quick Start

### Step 1: Start Firebase Emulators

In one terminal:

```bash
pnpm emulators:start:empty
```

### Step 2: Run Tests

In another terminal:

```bash
pnpm test:e2e
```

That's it! The test user will be created automatically.

## 📋 What Gets Tested

The main test (`coffee-tracking-flow.spec.ts`) covers the complete user journey:

1. **Login** - Authenticates with test user
2. **Add Beans** - Creates a new coffee bean entry
3. **Add Brew** - Creates a filter coffee brew using those beans
4. **Add Espresso** - Creates an espresso shot using those beans
5. **Verify** - Checks that both drinks appear on the beans details page

## 🎯 Test Features

- ✅ Automatic test user creation via global setup
- ✅ Uses role-based selectors (accessible and robust)
- ✅ Unique timestamps to avoid test conflicts
- ✅ Multi-step form navigation
- ✅ Responsive design handling (mobile tabs)

## 🧪 Development Tips

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
pnpm test:e2e tests/coffee-tracking-flow.spec.ts
```

### Debug a test

```bash
pnpm test:e2e --debug
```

## 📝 Adding Test IDs (Optional)

If you find selectors are fragile, you can add `data-testid` attributes to components:

```tsx
<button data-testid="add-beans-button">Add</button>
```

Then in tests:

```typescript
await page.getByTestId("add-beans-button").click();
```

## 🔧 Troubleshooting

### "strict mode violation: locator resolved to 2 elements"

This happens with Headless UI components (comboboxes, etc.). **Solution**: Use `.first()`:

```typescript
// ❌ Error
await page.getByLabel("Roaster *").click();

// ✅ Fixed
await page.getByLabel("Roaster *").first().click();
```

See [PATTERNS.md](./PATTERNS.md) for more examples.

### Test user creation fails

- Ensure emulators are running on default ports
- Check that port 9099 (Auth emulator) is accessible
- Manually create the user via http://localhost:9099/auth

### Tests timeout

- Check that the dev server starts successfully on port 5173
- Ensure Firebase emulators are running
- Increase timeout in playwright.config.ts if needed

### Elements not found

- Check if the app requires different interaction patterns
- Use Playwright UI mode to inspect the page state
- Add explicit waits if needed: `await page.waitForSelector(...)`

## 📚 Resources

- **[PATTERNS.md](./PATTERNS.md)** - Common patterns and solutions for this project
- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Locator Documentation](https://playwright.dev/docs/locators)
