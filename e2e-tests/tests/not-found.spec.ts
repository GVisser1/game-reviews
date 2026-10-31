import { expect, test } from "../fixtures";

test("shows a not-found page for unknown URLs", async ({ page, notFoundPage }) => {
  await page.goto("/does-not-exist");

  await expect(notFoundPage.heading).toBeVisible();
  await notFoundPage.assertPageIsAccessible();
  await notFoundPage.homeLink.click();

  await expect(page).toHaveURL("/");
});
