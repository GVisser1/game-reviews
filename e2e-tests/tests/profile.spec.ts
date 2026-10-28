import { expect, test } from "../fixtures";
import { TWITCH_DISPLAY_NAME, TWITCH_USERNAME } from "../mocks/testData";

test("opens the signed-in user's own profile from their name in the nav", async ({
  page,
  signIn,
  gamesPage,
  profilePage,
}) => {
  await signIn("/app");

  await gamesPage.navUserName(TWITCH_DISPLAY_NAME).click();

  await expect(page).toHaveURL(`/app/users/${TWITCH_USERNAME}`);
  await expect(profilePage.heading(TWITCH_DISPLAY_NAME)).toBeVisible();
  await expect(profilePage.noReviews).toBeVisible();
  await expect(profilePage.accountSettingsLink).toBeVisible();
  await profilePage.assertMeta(`${TWITCH_DISPLAY_NAME} - Game Reviews`);
  await profilePage.assertPageIsAccessible();
});

test("opens another player's profile from their review", async ({ page, gameDetailsPage, profilePage }) => {
  await gameDetailsPage.goto(72);

  await gameDetailsPage.publicReview("Other Player").getByRole("link", { name: "Other Player" }).click();

  await expect(page).toHaveURL("/app/users/other-player");
  await expect(profilePage.heading("Other Player")).toBeVisible();
  await expect(profilePage.reviewedGame("Portal 2")).toContainText("Best co-op puzzles ever made.");
  await expect(profilePage.reviewedGame("Portal 2")).toContainText("2011");
  await expect(profilePage.rating(5)).toBeVisible();
  await expect(profilePage.accountSettingsLink).toBeHidden();
  await profilePage.assertPageIsAccessible();
});

test("says when a player doesn't exist", async ({ profilePage }) => {
  await profilePage.goto("nobody");

  await expect(profilePage.notFound).toBeVisible();
  await profilePage.assertMeta("Player not found - Game Reviews");
});

test("sends old My reviews links to the user's profile", async ({ page, signIn }) => {
  await signIn("/app");

  await page.goto("/app/my-reviews");

  await expect(page).toHaveURL(`/app/users/${TWITCH_USERNAME}`);
});

test("asks anonymous visitors to sign in on old My reviews links", async ({ page }) => {
  await page.goto("/app/my-reviews");

  await expect(page).toHaveURL("/login?redirect=%2Fapp%2Fmy-reviews");
});
