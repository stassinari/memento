# E2E Tests

## Setup

### Prerequisites

1. A reachable auth backend (Firebase or emulator)
2. Test credentials exported before running Playwright:

```bash
export E2E_TEST_EMAIL="test@example.com"
export E2E_TEST_PASSWORD="testpassword123"
```

### Optional: run with Firebase emulators

1. Start the Firebase emulators:

   ```bash
   pnpm emulators:start:empty
   ```

2. Open the Firebase Auth Emulator UI in your browser:

   ```
   http://localhost:9099/auth
   ```

3. Click "Add User" and create a user with these credentials:
   - Email: `test@example.com`
   - Password: `testpassword123`

## Running Tests

### Run all tests

```bash
pnpm test:e2e
```

### Run tests with UI mode (recommended for development)

```bash
pnpm test:e2e:ui
```

### Run tests in headed mode

```bash
pnpm test:e2e --headed
```

### Run a specific test file

```bash
pnpm test:e2e tests/e2e/tastings-happy-path.spec.ts
```

## Test Structure

### `tests/e2e/tastings-happy-path.spec.ts`

Tests the tasting flow end-to-end:

1. Log in
2. Add two beans
3. Create a tasting setup with beans as variable
4. Save scoring
5. Verify details/sample navigation

## Notes

- Tests are skipped unless `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` are set
- Each test uses unique timestamps in names to avoid conflicts
- Page object models live in `tests/e2e/pages/`
