import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class GamesPage extends BasePage {
  public readonly searchInput: Locator;
  public readonly sortSelect: Locator;
  public readonly noGamesFound: Locator;
  // The game names in the list, in the order they're shown.
  public readonly gameNames: Locator;

  public constructor(page: Page) {
    super(page);

    this.searchInput = page.getByRole("searchbox", { name: "Search games" });
    this.sortSelect = page.getByRole("combobox", { name: "Sort games" });
    this.gameNames = page.getByRole("main").getByRole("listitem").getByRole("link");
    this.noGamesFound = page.getByText("No games found.");
  }

  public goto = async (search?: string): Promise<Response | null> =>
    this.page.goto(search ? `/app?q=${encodeURIComponent(search)}` : "/app");

  public gameLink(name: string): Locator {
    return this.page.getByRole("link", { name, exact: true });
  }

  // A game's tile in the list, found by its name.
  public gameTile(name: string): Locator {
    return this.page.getByRole("listitem").filter({ has: this.gameLink(name) });
  }
}
