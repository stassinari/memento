import { expect, Page } from "@playwright/test";

export class TastingScoringPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Tasting scoring" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back to tasting" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Save scoring" })).toBeVisible();
  }

  async fillSampleNote(note: string): Promise<void> {
    await this.page.getByLabel("Sample note").fill(note);
  }

  async saveScoring(): Promise<void> {
    await this.page.getByRole("button", { name: "Save scoring" }).click();
    await expect(this.page.getByRole("button", { name: "Save scoring" })).toBeVisible();
  }

  async goBackToTasting(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/drinks\/tastings\/[^/]+\/?$/),
      this.page.getByRole("button", { name: "Back" }).click(),
    ]);
  }
}
