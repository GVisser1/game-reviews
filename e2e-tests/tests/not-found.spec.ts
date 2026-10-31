import { expect, test } from "../fixtures";

test("renders the not-found page", async ({ page, notFoundPage }) => {
  await page.goto("/does-not-exist");

  await expect(notFoundPage.heading).toBeVisible();
  await notFoundPage.assertMeta();
  await notFoundPage.assertPageIsAccessible();
});

test("links back to the home page from the not-found page", async ({ page, notFoundPage }) => {
  await page.goto("/does-not-exist");

  await notFoundPage.homeLink.click();

  await expect(page).toHaveURL("/");
});
