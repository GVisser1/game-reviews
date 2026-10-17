import { expect, test } from "../fixtures";
import { TWITCH_DISPLAY_NAME } from "../mocks/testData";

test("signs in from a game and returns to it", async ({ page, gameDetailsPage, loginPage }) => {
  await gameDetailsPage.goto(72);
  await gameDetailsPage.signInLink.click();

  await expect(page).toHaveURL("/login?redirect=%2Fapp%2Fgames%2F72");
  await loginPage.continueWithTwitchButton.click();

  await expect(page).toHaveURL("/app/games/72");
  await expect(gameDetailsPage.navUserName(TWITCH_DISPLAY_NAME)).toBeVisible();
  await expect(gameDetailsPage.starButton(5)).toBeVisible();
});

test("rates a game, sees it on My reviews and removes it", async ({
  backend,
  signIn,
  gameDetailsPage,
  myReviewsPage,
}) => {
  await signIn("/app/games/72");

  await gameDetailsPage.starButton(4).click();

  await expect(gameDetailsPage.removeRatingButton).toBeVisible();
  await expect
    .poll(() => backend.reviews)
    .toEqual([{ game_id: 72, game_name: "Portal 2", cover_url: null, rating: 4 }]);

  await myReviewsPage.goto();

  await expect(myReviewsPage.reviewedGame("Portal 2")).toBeVisible();
  await expect(myReviewsPage.rating(4)).toBeVisible();
  await myReviewsPage.assertPageIsAccessible();

  await myReviewsPage.reviewedGame("Portal 2").getByRole("link").click();
  await gameDetailsPage.removeRatingButton.click();

  await expect(gameDetailsPage.removeRatingButton).toBeHidden();
  await expect.poll(() => backend.reviews).toEqual([]);
});

test("signs out back to an anonymous visitor", async ({ signIn, gameDetailsPage }) => {
  await signIn("/app/games/72");

  await gameDetailsPage.navSignOutButton.click();

  await expect(gameDetailsPage.navSignInLink).toBeVisible();
  await expect(gameDetailsPage.signInPrompt).toBeVisible();
});
