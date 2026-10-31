import { expect, test } from "../fixtures";

// Every page is checked in light and dark mode by the chromium-dark project; these test the theme switch itself.
test.describe("with a dark system setting", () => {
  test.use({ colorScheme: "dark" });

  test("switches to light when the player chooses it", async ({ page, signIn, accountPage }) => {
    await signIn("/app/account");

    await accountPage.themeOption("Light").check();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test("keeps a chosen theme across pages and reloads, until switched back to System", async ({
  page,
  signIn,
  accountPage,
  landingPage,
}) => {
  await signIn("/app/account");
  await expect(accountPage.themeOption("System")).toBeChecked();

  await accountPage.themeOption("Dark").check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(accountPage.themeOption("Dark")).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // The prerendered landing page gets it from the script in <head>.
  await landingPage.goto();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await accountPage.goto();
  await accountPage.themeOption("System").check();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
});
