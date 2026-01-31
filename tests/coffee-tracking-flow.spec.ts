import { expect, test } from "@playwright/test";

// Test user credentials - make sure this user exists in your Firebase Auth emulator
// You can create it via http://localhost:9099/auth when emulators are running
const TEST_USER = {
  email: "asd@asd.asd",
  password: "asdasd",
};

// Helper to login
async function login(page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password").fill(TEST_USER.password);
  await page.getByRole("button", { name: "Log in" }).click();

  // Wait for navigation to home page
  await page.waitForURL("/");
}

test.describe("Coffee Tracking Happy Path", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should complete full coffee tracking flow: add beans, brew, espresso, and verify associations", async ({
    page,
  }) => {
    // Generate unique names to avoid conflicts
    const timestamp = Date.now();
    const beansName = `Test Beans ${timestamp}`;
    const roasterName = `Test Roaster ${timestamp}`;
    const brewMethod = `V60 ${timestamp}`;

    // Step 1: Add beans
    await test.step("Add beans", async () => {
      await page.goto("/beans/add");

      // Wait for the page to load
      await expect(
        page.getByRole("heading", { name: "Add beans" }),
      ).toBeVisible();

      // Fill in required fields
      await page.getByLabel("Name *").fill(beansName);

      // For the roaster combobox, we need to type and select
      // Use .first() to handle Headless UI Combobox which creates multiple elements
      await page.getByLabel("Roaster *").first().click();
      await page.getByLabel("Roaster *").first().fill(roasterName);

      // Submit the form
      await page.getByRole("button", { name: "Add" }).click();

      // Wait for navigation to beans details page
      await page.waitForURL(/\/beans\/.+/);
      await expect(
        page.getByRole("heading", { name: beansName }),
      ).toBeVisible();
    });

    // Step 2: Add a brew with the beans
    await test.step("Add brew with beans", async () => {
      await page.goto("/drinks/brews/add");

      // Wait for the page to load
      await expect(
        page.getByRole("heading", { name: "Add brew" }),
      ).toBeVisible();

      // Select the beans we just created
      await page.getByText(beansName).click();

      // Fill in method (use .first() for comboboxes)
      await page.getByLabel("Method *").first().click();
      await page.getByLabel("Method *").first().fill(brewMethod);

      // Click Next to go to recipe step
      await page.getByRole("button", { name: "Next" }).click();

      // Recipe step - fill in required fields
      await page.getByLabel("Water weight (ml) *").fill("250");
      await page.getByLabel("Beans weight (g) *").fill("15");

      // Click Next to go to time step
      await page.getByRole("button", { name: "Next" }).click();

      // Time step - submit and wait for navigation
      // Use Promise.all to start waiting for navigation before clicking
      await Promise.all([
        page.waitForURL(/\/drinks\/brews\/.+/, { timeout: 10000 }),
        page.getByRole("button", { name: "Add" }).click(),
      ]);

      // Verify we're on the brew details page by checking the heading
      await expect(
        page.getByRole("heading", { name: brewMethod }),
      ).toBeVisible();
    });

    // Step 3: Add an espresso with the beans
    await test.step("Add espresso with beans", async () => {
      await page.goto("/drinks/espresso/add");

      // Wait for the page to load
      await expect(
        page.getByRole("heading", { name: "Add espresso" }),
      ).toBeVisible();

      // Select the beans we created
      await page.getByText(beansName).click();

      // Click Next to go to recipe step
      await page.getByRole("button", { name: "Next" }).click();

      // Recipe step - fill in required fields
      await page.getByLabel("Yield *").fill("42");
      await page.getByLabel("Dose (g) *").fill("18");

      // Click Next to go to time step
      await page.getByRole("button", { name: "Next" }).click();

      // Time step - submit and wait for navigation
      // Use Promise.all to start waiting for navigation before clicking
      await Promise.all([
        page.waitForURL(/\/drinks\/espresso\/.+/, { timeout: 10000 }),
        page.getByRole("button", { name: "Add" }).click(),
      ]);

      // Verify we're on the espresso details page
      await expect(page.getByText(beansName)).toBeVisible();
    });

    // Step 4: Go to beans details and verify both drinks are associated
    await test.step("Verify drinks associated with beans", async () => {
      // Navigate to beans list
      await page.goto("/beans");

      // Click on our test beans
      await page.getByText(beansName).click();

      // Wait for beans details page
      await page.waitForURL(/\/beans\/.+/);
      await expect(
        page.getByRole("heading", { name: beansName }),
      ).toBeVisible();

      // On mobile, we need to click the "Drinks" tab
      // Check if we're in mobile view (tabs visible)
      const drinksTab = page.getByRole("tab", { name: "Drinks" });
      if (await drinksTab.isVisible()) {
        await drinksTab.click();
      }

      // Verify the brew is listed
      await expect(page.getByText(brewMethod)).toBeVisible();

      // Verify the espresso is listed (look for beans name in the drinks list)
      // Scope to drink card links to avoid breadcrumb list items
      const drinkCards = page
        .locator('a[href^="/drinks/"]')
        .filter({ hasText: beansName });
      await expect(drinkCards).toHaveCount(2); // One brew, one espresso
    });
  });

  test("should add beans with minimal required fields only", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const beansName = `Minimal Beans ${timestamp}`;
    const roasterName = `Minimal Roaster ${timestamp}`;

    await page.goto("/beans/add");

    await page.getByLabel("Name *").fill(beansName);
    await page.getByLabel("Roaster *").first().click();
    await page.getByLabel("Roaster *").first().fill(roasterName);

    await page.getByRole("button", { name: "Add" }).click();

    await page.waitForURL(/\/beans\/.+/);
    await expect(page.getByRole("heading", { name: beansName })).toBeVisible();
  });
});
