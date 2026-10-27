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

test("rates a game, sees it on their profile and removes it", async ({
  backend,
  signIn,
  gameDetailsPage,
  profilePage,
}) => {
  await signIn("/app/games/72");

  await gameDetailsPage.starButton(4).click();

  await expect(gameDetailsPage.removeReviewButton).toBeVisible();
  await expect
    .poll(() => backend.reviews)
    .toEqual([{ game_id: 72, game_name: "Portal 2", cover_url: null, release_year: 2011, rating: 4, body: null }]);

  await gameDetailsPage.navUserName(TWITCH_DISPLAY_NAME).click();

  await expect(profilePage.reviewedGame("Portal 2")).toBeVisible();
  await expect(profilePage.rating(4)).toBeVisible();
  await profilePage.assertPageIsAccessible();

  await profilePage.reviewedGame("Portal 2").getByRole("link").click();
  await gameDetailsPage.removeReviewButton.click();

  await expect(gameDetailsPage.removeReviewButton).toBeHidden();
  await expect.poll(() => backend.reviews).toEqual([]);
});

test("signs out back to an anonymous visitor", async ({ signIn, gameDetailsPage }) => {
  await signIn("/app/games/72");

  await gameDetailsPage.navSignOutButton.click();

  await expect(gameDetailsPage.navSignInLink).toBeVisible();
  await expect(gameDetailsPage.signInPrompt).toBeVisible();
});

test("writes, edits and removes a review", async ({ backend, signIn, gameDetailsPage, profilePage }) => {
  await signIn("/app/games/72");

  await expect(gameDetailsPage.saveReviewButton).toBeDisabled();
  await gameDetailsPage.starButton(5).click();
  await gameDetailsPage.reviewTextbox.fill("  Clever puzzles and a great story.  ");
  await gameDetailsPage.saveReviewButton.click();

  const ownReview = gameDetailsPage.publicReview(`${TWITCH_DISPLAY_NAME} (you)`);
  await expect(ownReview).toContainText("Clever puzzles and a great story.");
  await expect.poll(() => backend.reviews[0]?.body).toBe("Clever puzzles and a great story.");
  await expect(gameDetailsPage.saveReviewButton).toBeDisabled();
  await gameDetailsPage.assertPageIsAccessible();

  // Changing the stars keeps the saved text.
  await gameDetailsPage.starButton(4).click();
  await expect.poll(() => backend.reviews[0]).toMatchObject({ rating: 4, body: "Clever puzzles and a great story." });

  await gameDetailsPage.reviewTextbox.fill("Clever puzzles, but too short.");
  await gameDetailsPage.saveReviewButton.click();
  await expect(ownReview).toContainText("Clever puzzles, but too short.");

  await ownReview.getByRole("link", { name: `${TWITCH_DISPLAY_NAME} (you)` }).click();
  await expect(profilePage.reviewedGame("Portal 2")).toContainText("Clever puzzles, but too short.");

  await profilePage.reviewedGame("Portal 2").getByRole("link").click();
  await gameDetailsPage.removeReviewButton.click();

  await expect(ownReview).toBeHidden();
  await expect.poll(() => backend.reviews).toEqual([]);
});

test("updates the community rating when rating a game", async ({ signIn, gameDetailsPage }) => {
  await signIn("/app/games/72");
  await expect(gameDetailsPage.communityRating("5.0/5 from 1 rating")).toBeVisible();

  await gameDetailsPage.starButton(3).click();

  await expect(gameDetailsPage.communityRating("4.0/5 from 2 ratings")).toBeVisible();

  await gameDetailsPage.removeReviewButton.click();

  await expect(gameDetailsPage.communityRating("5.0/5 from 1 rating")).toBeVisible();
});
