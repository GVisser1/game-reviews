import { QueryClient } from "@tanstack/react-query";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // IGDB data barely changes, so show cached results without refetching on every visit.
      staleTime: FIVE_MINUTES_MS,
    },
  },
});
