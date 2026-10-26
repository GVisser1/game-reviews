import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../features/profiles/ProfilePage";
import { profileQueryOptions, profileReviewsQueryOptions } from "../../features/profiles/profileQuery";
import { pageHead } from "../../lib/pageHead";

const NOT_FOUND_PAGE_NAME = "Player not found";

export const Route = createFileRoute("/app/users/$username")({
  loader: async ({ context, params }) => {
    // The reviews load alongside; the page shows them when they arrive.
    void context.queryClient.prefetchQuery(profileReviewsQueryOptions(params.username));
    return context.queryClient.ensureQueryData(profileQueryOptions(params.username));
  },
  head: ({ loaderData }) => pageHead(loaderData?.displayName ?? NOT_FOUND_PAGE_NAME),
  component: ProfilePage,
});
