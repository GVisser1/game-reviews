import { expect, test } from "../fixtures";
import { TWITCH_DISPLAY_NAME } from "../mocks/testData";

test("asks anonymous visitors to sign in", async ({ accountPage }) => {
  await accountPage.goto();

  await expect(accountPage.signInPrompt).toBeVisible();
  await expect(accountPage.deleteAccountButton).toBeHidden();
});

test("opens the account page from the user's profile", async ({
  page,
  signIn,
  gamesPage,
  profilePage,
  accountPage,
}) => {
  await signIn("/app");

  await gamesPage.navUserName(TWITCH_DISPLAY_NAME).click();
  await profilePage.accountSettingsLink.click();

  await expect(page).toHaveURL("/app/account");
  await expect(accountPage.heading).toBeVisible();
  await expect(accountPage.deleteAccountButton).toBeVisible();
  await accountPage.assertMeta("Account - Game Reviews");
  await accountPage.assertPageIsAccessible();
});

test("can cancel deleting the account", async ({ backend, signIn, accountPage }) => {
  await signIn("/app/account");

  await accountPage.deleteAccountButton.click();
  await accountPage.cancelButton.click();

  await expect(accountPage.deleteAccountButton).toBeVisible();
  expect(backend.isAccountDeleted).toBe(false);
});

test("deletes the account with its reviews and signs out", async ({
  page,
  backend,
  signIn,
  gameDetailsPage,
  accountPage,
  landingPage,
}) => {
  await signIn("/app/games/72");
  await gameDetailsPage.starButton(4).click();
  await expect.poll(() => backend.reviews.length).toBe(1);

  await accountPage.goto();
  await accountPage.deleteAccountButton.click();
  await accountPage.assertPageIsAccessible();
  await accountPage.confirmDeleteButton.click();

  await expect(page).toHaveURL("/");
  await expect(landingPage.heading).toBeVisible();
  expect(backend.isAccountDeleted).toBe(true);
  expect(backend.reviews).toEqual([]);

  await accountPage.goto();
  await expect(accountPage.signInPrompt).toBeVisible();
});
