import { expect, Page } from "@playwright/test";

export class TastingSetupPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/drinks/tastings/add");
    await expect(
      this.page.getByRole("heading", { name: "Tasting setup" }),
    ).toBeVisible();
  }

  async goToSamplesStep(): Promise<void> {
    await this.page.getByRole("button", { name: "Next: samples" }).click();
    await expect(
      this.page.getByRole("button", { name: "Save setup" }),
    ).toBeVisible();
  }

  async selectSampleBeans(
    sampleIndex: number,
    beanLabel: string,
  ): Promise<void> {
    await this.page.getByLabel("Beans *").nth(sampleIndex).click();
    await this.page.getByRole("option", { name: beanLabel }).click();
  }

  async saveSetupAndGoToScoring(): Promise<string> {
    await Promise.all([
      this.page.waitForURL(/\/drinks\/tastings\/[^/]+\/scoring$/),
      this.page.getByRole("button", { name: "Save setup" }).click(),
    ]);

    const urlMatch = this.page
      .url()
      .match(/\/drinks\/tastings\/([^/]+)\/scoring$/);
    if (!urlMatch?.[1]) {
      throw new Error(
        `Could not extract tasting ID from URL: ${this.page.url()}`,
      );
    }

    return urlMatch[1];
  }
}
