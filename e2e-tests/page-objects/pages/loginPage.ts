import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class LoginPage extends BasePage {
  public readonly heading: Locator;
  public readonly continueWithTwitchButton: Locator;
  public readonly backLink: Locator;
  public readonly signInFailed: Locator;

  public constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Sign in", level: 1 });
    this.continueWithTwitchButton = page.getByRole("button", { name: "Continue with Twitch" });
    this.backLink = page.getByRole("link", { name: "← Back" });
    this.signInFailed = page.getByText("Sign-in didn't complete. Please try again.");
  }

  public goto = async (query = ""): Promise<Response | null> => this.page.goto(`/login${query}`);
}
