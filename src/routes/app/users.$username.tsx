import { createFileRoute } from "@tanstack/react-router";
import { noop } from "lodash-es";
import { ProfilePage } from "../../features/profiles/ProfilePage";
import { profileQueryOptions, profileReviewsQueryOptions } from "../../features/profiles/profileQuery";
import { pageHead } from "../../utils/pageHeadUtil";

const NOT_FOUND_PAGE_NAME = "Player not found";

export const Route = createFileRoute("/app/users/$username")({
  loader: async ({ context, params }) => {
    // The reviews load alongside; the page shows them when they arrive.
    void context.queryClient.query(profileReviewsQueryOptions(params.username)).catch(noop);
    return context.queryClient.query({ ...profileQueryOptions(params.username), staleTime: "static" });
  },
  head: ({ loaderData }) => pageHead(loaderData?.displayName ?? NOT_FOUND_PAGE_NAME),
  component: ProfilePage,
});
