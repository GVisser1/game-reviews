import { expect, test } from "../fixtures";

test("asks anonymous visitors to sign in", async ({ myReviewsPage }) => {
  await myReviewsPage.goto();

  await expect(myReviewsPage.signInPrompt).toBeVisible();
  await myReviewsPage.assertPageIsAccessible();
});

test("shows an empty state for a signed-in user without reviews", async ({ signIn, myReviewsPage }) => {
  await signIn("/app/my-reviews");

  await expect(myReviewsPage.noReviews).toBeVisible();
});
