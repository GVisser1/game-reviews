import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class LandingPage extends BasePage {
  public readonly heading: Locator;
  public readonly browseGamesLink: Locator;
  public readonly signInLink: Locator;

  public constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Game Reviews", level: 1 });
    this.browseGamesLink = page.getByRole("link", { name: "Browse games" });
    this.signInLink = page.getByRole("link", { name: "Sign in" });
  }

  public goto = async (): Promise<Response | null> => this.page.goto("/");
}
