import { expect, test } from "../fixtures";

test("renders the login page", async ({ loginPage }) => {
  await loginPage.goto("?redirect=%2Fapp%2Fgames%2F72");

  await expect(loginPage.heading).toBeVisible();
  await expect(loginPage.continueWithTwitchButton).toBeVisible();
  await expect(loginPage.backLink).toHaveAttribute("href", "/app/games/72");
  await loginPage.assertMeta("Sign in - Game Reviews");
  await loginPage.assertPageIsAccessible();
});

test("drops a redirect that leads outside the app", async ({ page, loginPage }) => {
  await loginPage.goto("?redirect=https://evil.example");

  await expect(loginPage.heading).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("shows a failed sign-in and removes the error from the URL", async ({ page, loginPage }) => {
  await loginPage.goto("?redirect=%2Fapp&error=access_denied&error_description=The+user+denied+access");

  await expect(loginPage.signInFailed).toBeVisible();
  await expect(page).toHaveURL("/login?redirect=%2Fapp");
});

test("sends signed-in visitors on to where they came from", async ({ page, signIn, loginPage }) => {
  await signIn("/app");

  await loginPage.goto("?redirect=%2Fapp%2Ftop-rated");

  await expect(page).toHaveURL("/app/top-rated");
});
