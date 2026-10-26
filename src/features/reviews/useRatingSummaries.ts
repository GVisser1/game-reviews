import { useQueries } from "@tanstack/react-query";
import { isEmpty } from "lodash-es";
import { ratingSummariesQueryOptions } from "./ratingSummaryQuery";
import type { RatingSummary } from "./types";

// Community ratings for a paged list of games, one request per page. Games nobody rated, and pages that are still
// loading or failed, simply have no entry: the list is useful without them.
export const useRatingSummaries = (gameIdsByPage: number[][]): Map<number, RatingSummary> =>
  useQueries({
    queries: gameIdsByPage
      .filter((gameIds) => !isEmpty(gameIds))
      .map((gameIds) => ratingSummariesQueryOptions(gameIds)),
    combine: (results) => new Map(results.flatMap((result) => [...(result.data ?? [])])),
  });
