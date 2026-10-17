import { expect, test } from "../fixtures";

test("renders the landing page", async ({ landingPage }) => {
  await landingPage.goto();

  await expect(landingPage.heading).toBeVisible();
  await expect(landingPage.browseGamesLink).toBeVisible();
  await expect(landingPage.signInLink).toBeVisible();
  await landingPage.assertMeta();
  await landingPage.assertPageIsAccessible();
});

test("doesn't sign visitors in until they open the app", async ({ backend, landingPage, gamesPage }) => {
  await landingPage.goto();
  await expect(landingPage.heading).toBeVisible();
  expect(backend.anonymousSignInCount).toBe(0);

  await landingPage.browseGamesLink.click();

  await expect(gamesPage.gameLink("Portal 2")).toBeVisible();
  expect(backend.anonymousSignInCount).toBe(1);
});
