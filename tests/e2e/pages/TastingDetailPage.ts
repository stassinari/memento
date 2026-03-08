import { expect, Page } from "@playwright/test";

export class TastingDetailPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Tasting detail" })).toBeVisible();
  }

  async expectSampleLabelVisible(label: string): Promise<void> {
    await expect(this.page.getByText(label)).toBeVisible();
  }

  async openSampleByLabel(label: string): Promise<void> {
    await this.page.getByRole("link", { name: new RegExp(label) }).first().click();
  }

  async expectSamplePage(sampleNumber: number): Promise<void> {
    await expect(this.page.getByRole("heading", { name: `Sample #${sampleNumber}` })).toBeVisible();
  }
}
