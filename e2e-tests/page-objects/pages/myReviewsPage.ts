import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class MyReviewsPage extends BasePage {
  public readonly signInPrompt: Locator;
  public readonly noReviews: Locator;

  public constructor(page: Page) {
    super(page);

    this.signInPrompt = page.getByText("Sign in to rate games and see your reviews here.");
    this.noReviews = page.getByText("You haven't reviewed any games yet.");
  }

  public goto = async (): Promise<Response | null> => this.page.goto("/app/my-reviews");

  public reviewedGame(name: string): Locator {
    return this.page.getByRole("listitem").filter({ has: this.page.getByRole("link", { name, exact: true }) });
  }

  public reviewText(text: string): Locator {
    return this.page.getByText(text);
  }

  public rating(stars: number): Locator {
    return this.page.getByRole("img", { name: `Rated ${stars} out of 5` });
  }
}
