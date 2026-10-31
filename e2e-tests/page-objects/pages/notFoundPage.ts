import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base";

export class NotFoundPage extends BasePage {
  public readonly heading: Locator;
  public readonly homeLink: Locator;

  public constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Page not found", level: 1 });
    this.homeLink = page.getByRole("link", { name: "Back to the home page" });
  }
}
