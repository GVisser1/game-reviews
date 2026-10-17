import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class GamesPage extends BasePage {
  public readonly searchInput: Locator;
  public readonly noGamesFound: Locator;

  public constructor(page: Page) {
    super(page);

    this.searchInput = page.getByRole("searchbox", { name: "Search games" });
    this.noGamesFound = page.getByText("No games found.");
  }

  public goto = async (search?: string): Promise<Response | null> =>
    this.page.goto(search ? `/app?q=${encodeURIComponent(search)}` : "/app");

  public gameLink(name: string): Locator {
    return this.page.getByRole("link", { name, exact: true });
  }
}
