import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class GameDetailsPage extends BasePage {
  public readonly backLink: Locator;
  public readonly signInPrompt: Locator;
  public readonly signInLink: Locator;
  public readonly removeReviewButton: Locator;
  public readonly reviewTextbox: Locator;
  public readonly saveReviewButton: Locator;
  public readonly reviewsHeading: Locator;
  public readonly noReviewsYet: Locator;

  public constructor(page: Page) {
    super(page);

    this.backLink = page.getByRole("link", { name: "← All games" });
    this.signInPrompt = page.getByText("Sign in to rate this game.");
    this.signInLink = page.getByRole("main").getByRole("link", { name: "Sign in" });
    this.removeReviewButton = page.getByRole("button", { name: "Remove review" });
    this.reviewTextbox = page.getByRole("textbox", { name: "Your review (optional)" });
    this.saveReviewButton = page.getByRole("button", { name: "Save review" });
    this.reviewsHeading = page.getByRole("heading", { name: "Reviews", level: 2 });
    this.noReviewsYet = page.getByText("No written reviews yet.");
  }

  public goto = async (gameId: number | string): Promise<Response | null> => this.page.goto(`/app/games/${gameId}`);

  public heading(name: string): Locator {
    return this.page.getByRole("heading", { name, level: 1 });
  }

  public starButton(stars: number): Locator {
    return this.page.getByRole("button", { name: stars === 1 ? "1 star" : `${stars} stars`, exact: true });
  }

  // One review in the public "Reviews" list, found by the reviewer's name (e.g. "Other Player" or "E2E Tester (you)").
  public publicReview(reviewerName: string): Locator {
    return this.page.getByRole("listitem").filter({ hasText: reviewerName });
  }

  public errorMessage(text: string): Locator {
    return this.page.getByText(`Could not load game: ${text}`);
  }
}
