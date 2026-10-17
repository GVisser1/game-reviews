import { createFileRoute } from "@tanstack/react-router";
import { MyReviewsPage } from "../../features/reviews/MyReviewsPage";
import { reviewsQueryOptions } from "../../features/reviews/useReviews";

export const Route = createFileRoute("/app/my-reviews")({
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQueryOptions),
  component: MyReviewsPage,
});
