import { expect, test } from "../fixtures";

test("asks anonymous visitors to sign in before rating", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(72);

  await expect(gameDetailsPage.heading("Portal 2 (2011)")).toBeVisible();
  await expect(gameDetailsPage.signInPrompt).toBeVisible();
  await expect(gameDetailsPage.starButton(1)).toBeHidden();
  await expect(gameDetailsPage.signInLink).toHaveAttribute("href", "/login?redirect=%2Fapp%2Fgames%2F72");
  await gameDetailsPage.assertPageIsAccessible();
});

test("shows an error for a game that doesn't exist", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(999999);

  await expect(gameDetailsPage.errorMessage("Game 999999 not found")).toBeVisible();
});

test("shows an error for an invalid game id", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto("abc");

  await expect(gameDetailsPage.errorMessage("Invalid game id")).toBeVisible();
});
