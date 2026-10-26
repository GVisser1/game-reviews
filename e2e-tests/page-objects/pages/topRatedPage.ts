import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class TopRatedPage extends BasePage {
  public readonly heading: Locator;
  public readonly games: Locator;
  public readonly noGamesYet: Locator;

  public constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Top rated" });
    this.games = page.getByRole("main").getByRole("listitem");
    this.noGamesYet = page.getByText("No games have enough ratings yet.");
  }

  public goto = async (): Promise<Response | null> => this.page.goto("/app/top-rated");
}
