import { expect, Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/login");
    await expect(this.page.getByRole("heading", { name: "Sign in to Memento" })).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);

    await Promise.all([
      this.page.waitForURL((url) => !url.pathname.includes("/login")),
      this.page.getByRole("button", { name: "Log in" }).click(),
    ]);
  }
}
