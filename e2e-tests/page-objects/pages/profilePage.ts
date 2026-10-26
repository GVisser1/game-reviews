import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class ProfilePage extends BasePage {
  public readonly accountSettingsLink: Locator;
  public readonly noReviews: Locator;
  public readonly notFound: Locator;

  public constructor(page: Page) {
    super(page);

    this.accountSettingsLink = page.getByRole("link", { name: "Account settings" });
    this.noReviews = page.getByText("You haven't reviewed any games yet.");
    this.notFound = page.getByRole("heading", { name: "Player not found" });
  }

  public goto = async (username: string): Promise<Response | null> => this.page.goto(`/app/users/${username}`);

  public heading(displayName: string): Locator {
    return this.page.getByRole("heading", { name: displayName });
  }

  public reviewedGame(name: string): Locator {
    return this.page.getByRole("listitem").filter({ has: this.page.getByRole("link", { name, exact: true }) });
  }

  public rating(stars: number): Locator {
    return this.page.getByRole("img", { name: `Rated ${stars} out of 5` });
  }
}
