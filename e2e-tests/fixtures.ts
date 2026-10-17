import { expect, test as base } from "@playwright/test";
import { type FakeBackend, installFakeBackend } from "./mocks/fakeBackend";
import { GameDetailsPage } from "./page-objects/pages/gameDetailsPage";
import { GamesPage } from "./page-objects/pages/gamesPage";
import { LandingPage } from "./page-objects/pages/landingPage";
import { LoginPage } from "./page-objects/pages/loginPage";
import { MyReviewsPage } from "./page-objects/pages/myReviewsPage";
import { NotFoundPage } from "./page-objects/pages/notFoundPage";

type Fixtures = {
  backend: FakeBackend;
  landingPage: LandingPage;
  gamesPage: GamesPage;
  gameDetailsPage: GameDetailsPage;
  myReviewsPage: MyReviewsPage;
  loginPage: LoginPage;
  notFoundPage: NotFoundPage;
  // Signs in with (fake) Twitch from the login page and ends up back on `redirectPath`.
  signIn: (redirectPath: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  // Installed for every test, so no test ever talks to the real Supabase or IGDB.
  backend: [async ({ page }, use) => use(await installFakeBackend(page)), { auto: true }],
  landingPage: async ({ page }, use) => use(new LandingPage(page)),
  gamesPage: async ({ page }, use) => use(new GamesPage(page)),
  gameDetailsPage: async ({ page }, use) => use(new GameDetailsPage(page)),
  myReviewsPage: async ({ page }, use) => use(new MyReviewsPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  notFoundPage: async ({ page }, use) => use(new NotFoundPage(page)),
  signIn: async ({ page, loginPage }, use) =>
    use(async (redirectPath) => {
      await loginPage.goto(`?redirect=${encodeURIComponent(redirectPath)}`);
      await loginPage.continueWithTwitchButton.click();
      await expect(page).toHaveURL(redirectPath);
    }),
});

export { expect } from "@playwright/test";
