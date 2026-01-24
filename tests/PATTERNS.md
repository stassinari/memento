# Common Playwright Patterns & Solutions

## Handling Multiple Elements (Strict Mode Violations)

### The Problem
Playwright's "strict mode" ensures you interact with exactly one element. When multiple elements match, you get:
```
Error: strict mode violation: locator resolved to 2 elements
```

### Solutions

#### 1. Use `.first()` or `.nth(index)`
```typescript
// Get the first matching element
await page.getByLabel('Roaster *').first().click();

// Get the second matching element (0-indexed)
await page.getByLabel('Something').nth(1).click();

// Get the last matching element
await page.getByLabel('Something').last().click();
```

#### 2. Use More Specific Locators
```typescript
// Instead of:
await page.getByText('Add').click();

// Use role + name:
await page.getByRole('button', { name: 'Add' }).click();

// Or combine locators:
await page.locator('form').getByText('Add').click();
```

#### 3. Filter by Parent/Child
```typescript
// Find button within a specific section
await page.locator('section.beans-form').getByRole('button', { name: 'Add' }).click();

// Find by test ID parent
await page.getByTestId('roaster-section').getByLabel('Roaster *').click();
```

## Headless UI Components

### Comboboxes (Select/Autocomplete)
Headless UI Combobox creates multiple elements with the same label. Always use `.first()`:

```typescript
// ❌ Will fail
await page.getByLabel('Roaster *').click();

// ✅ Works
await page.getByLabel('Roaster *').first().click();
await page.getByLabel('Roaster *').first().fill('Square Mile');
```

### Tabs
```typescript
// Click a tab
await page.getByRole('tab', { name: 'Drinks' }).click();

// Check if tab exists (for responsive layouts)
const drinksTab = page.getByRole('tab', { name: 'Drinks' });
if (await drinksTab.isVisible()) {
  await drinksTab.click();
}
```

### Radio Button Groups
```typescript
// HeadlessUI Radio groups
await page.getByText('Single origin').click();

// Or by role
await page.getByRole('radio', { name: 'Single origin' }).click();
```

## Form Interactions

### Text Inputs
```typescript
// Simple text input
await page.getByLabel('Name *').fill('Test Coffee');

// Clear and fill
await page.getByLabel('Name *').clear();
await page.getByLabel('Name *').fill('New Name');

// Fill with keyboard
await page.getByLabel('Name *').pressSequentially('Test', { delay: 100 });
```

### Number Inputs
```typescript
await page.getByLabel('Water weight (ml) *').fill('250');
await page.getByLabel('Dose (g) *').fill('18');
```

### Date Pickers
```typescript
// For react-datepicker or similar
await page.getByLabel('Roast date').click();
await page.getByRole('button', { name: '15' }).click(); // Select day 15
```

### Checkboxes
```typescript
await page.getByRole('checkbox', { name: 'Show frozen' }).check();
await page.getByRole('checkbox', { name: 'Show frozen' }).uncheck();
```

## Navigation & Waiting

### Wait for Navigation After Click
**IMPORTANT**: When clicking a button that triggers navigation (like form submit), use `Promise.all`:

```typescript
// ✅ Correct - Start waiting for navigation BEFORE clicking
await Promise.all([
  page.waitForURL(/\/drinks\/brews\/.+/),
  page.getByRole('button', { name: 'Add' }).click(),
]);

// ❌ Wrong - Navigation might start before wait begins (race condition)
await page.getByRole('button', { name: 'Add' }).click();
await page.waitForURL(/\/drinks\/brews\/.+/); // Might timeout!
```

### Wait for URL
```typescript
// Wait for exact URL
await page.waitForURL('/beans');

// Wait for URL pattern (regex)
await page.waitForURL(/\/beans\/.+/);

// Wait for URL with timeout
await page.waitForURL('/beans', { timeout: 5000 });
```

### Wait for Elements
```typescript
// Wait for element to be visible
await page.getByRole('heading', { name: 'Add beans' }).waitFor();

// Wait for element to be hidden
await page.getByText('Loading...').waitFor({ state: 'hidden' });

// Wait for network idle (after data fetching)
await page.waitForLoadState('networkidle');
```

### Explicit Waits
```typescript
// Wait for specific condition
await page.waitForFunction(() => {
  return document.querySelectorAll('.drink-card').length >= 2;
});

// Wait for timeout (last resort)
await page.waitForTimeout(1000); // Not recommended
```

## Assertions

### Visibility
```typescript
// Element is visible
await expect(page.getByText('Success')).toBeVisible();

// Element is hidden
await expect(page.getByText('Error')).toBeHidden();

// Element is attached to DOM (but may not be visible)
await expect(page.getByText('Something')).toBeAttached();
```

### Text Content
```typescript
// Exact text
await expect(page.getByRole('heading')).toHaveText('Add beans');

// Contains text
await expect(page.getByRole('heading')).toContainText('beans');

// Regex
await expect(page.getByText(/test beans \d+/i)).toBeVisible();
```

### Count
```typescript
// Exact count
await expect(page.getByRole('listitem')).toHaveCount(5);

// At least one
await expect(page.locator('.drink-card')).toHaveCount(expect.any(Number));
```

### URL
```typescript
await expect(page).toHaveURL('/beans');
await expect(page).toHaveURL(/\/beans\/.+/);
```

## Firebase-Specific Patterns

### Login Helper
```typescript
async function login(page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('/');
}
```

### Unique Test Data
```typescript
// Use timestamps to avoid conflicts
const timestamp = Date.now();
const beansName = `Test Beans ${timestamp}`;
```

### Check Firestore Associations
```typescript
// Navigate to detail page and verify related items
await page.goto('/beans');
await page.getByText(beansName).click();

// Verify multiple items are listed
const drinkCards = page.locator('li').filter({ hasText: beansName });
await expect(drinkCards).toHaveCount(2);
```

## Debugging Tips

### Take Screenshots
```typescript
await page.screenshot({ path: 'debug.png', fullPage: true });
```

### Pause Execution
```typescript
await page.pause(); // Opens Playwright Inspector
```

### Console Logging
```typescript
// Listen to console messages from the page
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

### Trace Viewer
Run with trace on:
```bash
pnpm test:e2e --trace on
```

Then view traces:
```bash
npx playwright show-trace trace.zip
```

## Best Practices

1. **Prefer Role-Based Selectors**
   ```typescript
   // ✅ Good
   await page.getByRole('button', { name: 'Add' }).click();

   // ❌ Avoid
   await page.locator('button.primary').click();
   ```

2. **Use Test Steps for Organization**
   ```typescript
   await test.step('Add beans', async () => {
     // ... test code
   });
   ```

3. **Handle Async Operations**
   ```typescript
   // Always await Playwright operations
   await page.goto('/beans');
   await page.getByText('Add').click();
   ```

4. **Add Meaningful Waits**
   ```typescript
   // Wait for navigation after clicking
   await page.getByRole('button', { name: 'Submit' }).click();
   await page.waitForURL(/\/success/);
   ```

5. **Use Unique Identifiers in Tests**
   ```typescript
   // Generate unique names to avoid conflicts
   const timestamp = Date.now();
   const uniqueName = `Test ${timestamp}`;
   ```

6. **Clean Up or Use Isolated Data**
   ```typescript
   // Use emulators with clean state
   // Or clean up after tests if needed
   ```
