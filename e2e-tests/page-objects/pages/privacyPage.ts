import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class PrivacyPage extends BasePage {
  public readonly heading: Locator;
  public readonly accountPageLink: Locator;

  public constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Privacy", level: 1 });
    this.accountPageLink = page.getByRole("link", { name: "Account page" });
  }

  public goto = async (): Promise<Response | null> => this.page.goto("/privacy");
}
