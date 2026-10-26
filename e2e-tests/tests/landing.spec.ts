import { expect, test } from "../fixtures";
import { TURNSTILE_TEST_TOKEN } from "../mocks/testData";

const SITE_DESCRIPTION = "Find any game, rate it, and keep track of everything you've played.";

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

test("checks visitors with Turnstile before signing them in anonymously", async ({
  backend,
  landingPage,
  gamesPage,
}) => {
  await landingPage.goto();
  await landingPage.browseGamesLink.click();
  await expect(gamesPage.gameLink("Portal 2")).toBeVisible();

  test.skip(!backend.isTurnstileLoaded, "VITE_TURNSTILE_SITE_KEY isn't set for this run");
  expect(backend.anonymousSignInCaptchaToken).toBe(TURNSTILE_TEST_TOKEN);
});

test("describes the site for search engines and link previews", async ({ page, landingPage }) => {
  await landingPage.goto();

  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", SITE_DESCRIPTION);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Game Reviews");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", SITE_DESCRIPTION);
});
