import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class GameDetailsPage extends BasePage {
  public readonly backLink: Locator;
  public readonly signInPrompt: Locator;
  public readonly signInLink: Locator;
  public readonly removeRatingButton: Locator;

  public constructor(page: Page) {
    super(page);

    this.backLink = page.getByRole("link", { name: "← All games" });
    this.signInPrompt = page.getByText("Sign in to rate this game.");
    this.signInLink = page.getByRole("main").getByRole("link", { name: "Sign in" });
    this.removeRatingButton = page.getByRole("button", { name: "Remove rating" });
  }

  public goto = async (gameId: number | string): Promise<Response | null> => this.page.goto(`/app/games/${gameId}`);

  public heading(name: string): Locator {
    return this.page.getByRole("heading", { name, level: 1 });
  }

  public starButton(stars: number): Locator {
    return this.page.getByRole("button", { name: stars === 1 ? "1 star" : `${stars} stars`, exact: true });
  }

  public errorMessage(text: string): Locator {
    return this.page.getByText(`Could not load game: ${text}`);
  }
}
