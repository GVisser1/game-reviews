import { expect, test } from "../fixtures";

test("lists games", async ({ gamesPage }) => {
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
