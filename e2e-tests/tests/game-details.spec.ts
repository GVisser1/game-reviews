import { expect, test } from "../fixtures";

test("asks anonymous visitors to sign in before rating", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(72);

  await expect(gameDetailsPage.heading("Portal 2 (2011)")).toBeVisible();
  await expect(gameDetailsPage.signInPrompt).toBeVisible();
  await expect(gameDetailsPage.starButton(1)).toBeHidden();
  await expect(gameDetailsPage.signInLink).toHaveAttribute("href", "/login?redirect=%2Fapp%2Fgames%2F72");
  await gameDetailsPage.assertMeta("Portal 2 - Game Reviews");
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

test("shows other players' written reviews to anonymous visitors", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(72);

  await expect(gameDetailsPage.reviewsHeading).toBeVisible();
  await expect(gameDetailsPage.publicReview("Other Player")).toContainText("Best co-op puzzles ever made.");
  await expect(
    gameDetailsPage.publicReview("Other Player").getByRole("img", { name: "Rated 5 out of 5" }),
  ).toBeVisible();
});

test("says when a game has no written reviews yet", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(1020);

  await expect(gameDetailsPage.heading("Grand Theft Auto V (2013)")).toBeVisible();
  await expect(gameDetailsPage.noReviewsYet).toBeVisible();
});

test("shows the community rating", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(72);

  await expect(gameDetailsPage.communityRating("5.0/5 from 1 rating")).toBeVisible();
});

test("says when a game has no community ratings yet", async ({ gameDetailsPage }) => {
  await gameDetailsPage.goto(1020);

  await expect(gameDetailsPage.communityRating("No ratings yet")).toBeVisible();
});
