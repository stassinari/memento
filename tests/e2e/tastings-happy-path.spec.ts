import { expect, test } from "@playwright/test";
import { BeansAddPage } from "./pages/BeansAddPage";
import { LoginPage } from "./pages/LoginPage";
import { TastingDetailPage } from "./pages/TastingDetailPage";
import { TastingScoringPage } from "./pages/TastingScoringPage";
import { TastingSetupPage } from "./pages/TastingSetupPage";

test.describe("Tastings happy path", () => {
  test("creates a tasting setup, saves scoring, and reviews samples", async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL;
    const password = process.env.E2E_TEST_PASSWORD;
    test.skip(!email || !password, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run E2E tests");

    const timestamp = Date.now();
    const firstBeans = {
      name: `Tasting Beans A ${timestamp}`,
      roaster: `Roaster ${timestamp}`,
    };
    const secondBeans = {
      name: `Tasting Beans B ${timestamp}`,
      roaster: `Roaster ${timestamp}`,
    };

    const firstBeansLabel = `${firstBeans.name} (${firstBeans.roaster})`;
    const secondBeansLabel = `${secondBeans.name} (${secondBeans.roaster})`;

    const loginPage = new LoginPage(page);
    const beansAddPage = new BeansAddPage(page);
    const tastingSetupPage = new TastingSetupPage(page);
    const tastingScoringPage = new TastingScoringPage(page);
    const tastingDetailPage = new TastingDetailPage(page);

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await beansAddPage.goto();
    await beansAddPage.addMinimal(firstBeans);

    await beansAddPage.goto();
    await beansAddPage.addMinimal(secondBeans);

    await tastingSetupPage.goto();
    await tastingSetupPage.goToSamplesStep();
    await tastingSetupPage.selectSampleBeans(0, firstBeansLabel);
    await tastingSetupPage.selectSampleBeans(1, secondBeansLabel);
    const tastingId = await tastingSetupPage.saveSetupAndGoToScoring();

    await tastingScoringPage.expectLoaded();
    await tastingScoringPage.fillSampleNote("Initial scoring note from E2E");
    await tastingScoringPage.saveScoring();
    await tastingScoringPage.goBackToTasting();

    await expect(page).toHaveURL(new RegExp(`/drinks/tastings/${tastingId}/?$`));
    await tastingDetailPage.expectLoaded();
    await tastingDetailPage.expectSampleLabelVisible(firstBeansLabel);
    await tastingDetailPage.expectSampleLabelVisible(secondBeansLabel);

    await tastingDetailPage.openSampleByLabel(firstBeans.name);
    await tastingDetailPage.expectSamplePage(1);
    await expect(page.getByRole("link", { name: firstBeansLabel })).toBeVisible();
  });
});
