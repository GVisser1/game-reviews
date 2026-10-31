import { expect, test } from "../fixtures";

test("renders the games page", async ({ gamesPage }) => {
  await gamesPage.goto();

  await expect(gamesPage.gameLink("Portal 2")).toBeVisible();
  await expect(gamesPage.gameLink("Elden Ring")).toBeVisible();
  await gamesPage.assertMeta("Games - Game Reviews");
  await gamesPage.assertPageIsAccessible();
});

test("searches for a game and keeps the search in the URL", async ({ page, gamesPage }) => {
  await gamesPage.goto();
  await expect(gamesPage.gameLink("Portal 2")).toBeVisible();

  await gamesPage.searchInput.fill("witcher");

  await expect(page).toHaveURL("/app?q=witcher");
  await expect(gamesPage.gameLink("The Witcher 3: Wild Hunt")).toBeVisible();
  await expect(gamesPage.gameLink("Portal 2")).toBeHidden();
});

test("shows a message when nothing matches", async ({ gamesPage }) => {
  await gamesPage.goto("does not exist");

  await expect(gamesPage.noGamesFound).toBeVisible();
});

test("opens a game and goes back to the same search", async ({ page, gamesPage, gameDetailsPage }) => {
  await gamesPage.goto("portal");

  await gamesPage.gameLink("Portal 2").click();

  await expect(page).toHaveURL("/app/games/72");
  await expect(gameDetailsPage.heading("Portal 2 (2011)")).toBeVisible();

  await gameDetailsPage.backLink.click();

  await expect(page).toHaveURL("/app?q=portal");
  await expect(gamesPage.searchInput).toHaveValue("portal");
});

test("shows community ratings in the list", async ({ gamesPage }) => {
  await gamesPage.goto();

  await expect(gamesPage.gameTile("The Witcher 3: Wild Hunt")).toContainText("4.5 (2)");
  await expect(gamesPage.gameTile("The Witcher 3: Wild Hunt")).toContainText("Community rating: 4.5/5 from 2 ratings");
  await expect(gamesPage.gameTile("Portal 2")).toContainText("5.0 (1)");
  await expect(gamesPage.gameTile("Grand Theft Auto V")).not.toContainText("Community rating");
});

test("sorts the games and keeps the sort and search in the URL", async ({ page, gamesPage }) => {
  await gamesPage.goto();
  await expect(gamesPage.sortSelect).toHaveValue("popular");

  await gamesPage.sortSelect.selectOption({ label: "Newest" });

  await expect(page).toHaveURL("/app?sort=newest");
  await expect(gamesPage.gameNames).toHaveText([
    "Elden Ring",
    "The Witcher 3: Wild Hunt",
    "Grand Theft Auto V",
    "Portal 2",
  ]);

  await gamesPage.searchInput.fill("the");
  await expect(page).toHaveURL("/app?sort=newest&q=the");
  await gamesPage.sortSelect.selectOption({ label: "Name A–Z" });
  await expect(page).toHaveURL("/app?sort=name-asc&q=the");
  await expect(gamesPage.gameNames).toHaveText(["Grand Theft Auto V", "The Witcher 3: Wild Hunt"]);
  await gamesPage.sortSelect.selectOption({ label: "Name Z–A" });
  await expect(page).toHaveURL("/app?sort=name-desc&q=the");
  await expect(gamesPage.gameNames).toHaveText(["The Witcher 3: Wild Hunt", "Grand Theft Auto V"]);
  await gamesPage.sortSelect.selectOption({ label: "Name A–Z" });

  await page.reload();
  await expect(gamesPage.sortSelect).toHaveValue("name-asc");
  await expect(gamesPage.searchInput).toHaveValue("the");

  await gamesPage.sortSelect.selectOption({ label: "Most popular" });
  await expect(page).toHaveURL("/app?q=the");
});

test("sorts by players' ratings, best first, with and without a search", async ({ page, gamesPage }) => {
  await gamesPage.goto();

  await gamesPage.sortSelect.selectOption({ label: "Highest rated" });

  await expect(page).toHaveURL("/app?sort=rating");
  // GTA V has no ratings from players here, so it isn't listed.
  await expect(gamesPage.gameNames).toHaveText(["Portal 2", "The Witcher 3: Wild Hunt", "Elden Ring"]);
  // The same details as the other sorts: release year and community rating.
  await expect(gamesPage.gameTile("The Witcher 3: Wild Hunt")).toContainText("2015");
  await expect(gamesPage.gameTile("The Witcher 3: Wild Hunt")).toContainText("4.5 (2)");

  await gamesPage.searchInput.fill("wit");
  await expect(gamesPage.gameNames).toHaveText(["The Witcher 3: Wild Hunt"]);

  await gamesPage.searchInput.fill("grand");
  await expect(page.getByText("No rated games found.")).toBeVisible();
});

test("includes the user's own rating when sorting by highest rated", async ({
  page,
  signIn,
  gameDetailsPage,
  gamesPage,
}) => {
  await signIn("/app/games/72");

  await gameDetailsPage.starButton(5).click();
  await expect(gameDetailsPage.removeReviewButton).toBeVisible();
  await page.goto("/app?sort=rating");

  await expect(gamesPage.gameTile("Portal 2")).toContainText("5.0 (2)");
});
