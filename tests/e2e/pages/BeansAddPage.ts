import { expect, Page } from "@playwright/test";

export class BeansAddPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/beans/add");
    await expect(this.page.getByRole("heading", { name: "Add beans" })).toBeVisible();
  }

  async addMinimal(data: { name: string; roaster: string }): Promise<void> {
    await this.page.getByLabel("Name *").fill(data.name);
    await this.page.getByLabel("Roaster *").first().fill(data.roaster);

    await Promise.all([
      this.page.waitForURL(/\/beans\/[^/]+\/?$/),
      this.page.getByRole("button", { name: "Add" }).click(),
    ]);

    await expect(this.page.getByRole("heading", { name: data.name })).toBeVisible();
  }
}
