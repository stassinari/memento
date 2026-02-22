# E2E Tests

## Setup

### Prerequisites

1. Firebase emulators must be running
2. A test user will be automatically created via the global setup script

### Running Tests with Emulators

The easiest way to run tests is:

1. In one terminal, start the Firebase emulators:

   ```bash
   pnpm emulators:start:empty
   ```

2. In another terminal, run the tests:
   ```bash
   pnpm test:e2e
   ```

The global setup script (`tests/global-setup.ts`) will automatically create the test user (`test@example.com`) in the Firebase Auth emulator before running tests.

### Manual Test User Creation (Optional)

If you prefer to create the test user manually:

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
pnpm test:e2e tests/coffee-tracking-flow.spec.ts
```

## Test Structure

### `coffee-tracking-flow.spec.ts`

Tests the main happy path flow:

1. Add beans
2. Add a brew using those beans
3. Add an espresso using those beans
4. Verify both drinks appear on the beans details page

## Notes

- Tests assume an empty Firebase emulator state for consistency
- Each test uses unique timestamps in names to avoid conflicts
- The main flow test is comprehensive and covers the entire user journey
- Tests use both role-based selectors (preferred) and text selectors as fallback
