import { createFileRoute } from "@tanstack/react-router";
import { MyReviewsPage } from "../../features/reviews/MyReviewsPage";
import { reviewsQueryOptions } from "../../features/reviews/useReviews";
import { pageHead } from "../../lib/pageHead";

export const Route = createFileRoute("/app/my-reviews")({
  head: () => pageHead("My reviews"),
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQueryOptions),
  component: MyReviewsPage,
});
