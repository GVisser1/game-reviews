import { QueryClient } from "@tanstack/react-query";
import { minutes } from "./timeUtil";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // IGDB data barely changes, so show cached results without refetching on every visit.
      staleTime: minutes(5),
    },
  },
});
