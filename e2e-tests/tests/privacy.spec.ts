import { expect, test } from "../fixtures";

test("renders the privacy page", async ({ privacyPage }) => {
  await privacyPage.goto();

  await expect(privacyPage.heading).toBeVisible();
  await expect(privacyPage.accountPageLink).toHaveAttribute("href", "/app/account");
  await privacyPage.assertMeta("Privacy - Game Reviews");
  await privacyPage.assertPageIsAccessible();
});

test("links to the privacy page from the footer on every page", async ({
  page,
  landingPage,
  gamesPage,
  privacyPage,
}) => {
  await landingPage.goto();
  await landingPage.footerPrivacyLink.click();
  await expect(privacyPage.heading).toBeVisible();

  await gamesPage.goto();
  await expect(gamesPage.gameLink("Portal 2")).toBeVisible();
  await gamesPage.footerPrivacyLink.click();

  await expect(page).toHaveURL("/privacy");
});

test("links to the privacy page from the login page", async ({ page, loginPage }) => {
  await loginPage.goto();

  await page.getByRole("link", { name: "privacy page" }).click();

  await expect(page).toHaveURL("/privacy");
});
