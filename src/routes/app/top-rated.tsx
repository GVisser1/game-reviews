import { createFileRoute } from "@tanstack/react-router";
import { topRatedGamesQueryOptions } from "../../features/reviews/topRatedGamesQuery";
import { TopRatedPage } from "../../features/reviews/TopRatedPage";
import { pageHead } from "../../lib/pageHead";

export const Route = createFileRoute("/app/top-rated")({
  head: () => pageHead("Top rated"),
  loader: ({ context }) => context.queryClient.ensureQueryData(topRatedGamesQueryOptions),
  component: TopRatedPage,
});
