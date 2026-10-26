import { expect, test } from "../fixtures";

test("lists games with enough ratings, best first", async ({ topRatedPage }) => {
  await topRatedPage.goto();

  await expect(topRatedPage.heading).toBeVisible();
  // Portal 2 has only one rating, so it isn't listed yet.
  await expect(topRatedPage.games).toHaveText([
    "The Witcher 3: Wild Hunt4.5/5 from 2 ratings",
    "Elden Ring3.5/5 from 2 ratings",
  ]);
  await topRatedPage.assertMeta("Top rated - Game Reviews");
  await topRatedPage.assertPageIsAccessible();
});

test("opens Top rated from the nav", async ({ page, gamesPage, topRatedPage }) => {
  await gamesPage.goto();

  await gamesPage.navTopRatedLink.click();

  await expect(page).toHaveURL("/app/top-rated");
  await expect(topRatedPage.heading).toBeVisible();
});

test("includes the user's own rating", async ({ signIn, gameDetailsPage, topRatedPage }) => {
  await signIn("/app/games/72");

  await gameDetailsPage.starButton(5).click();
  await expect(gameDetailsPage.removeReviewButton).toBeVisible();
  await gameDetailsPage.navTopRatedLink.click();

  await expect(topRatedPage.games.first()).toHaveText("Portal 25.0/5 from 2 ratings");
});
