import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter } from "@tanstack/react-router";
import { sessionQueryOptions } from "./features/auth/sessionQuery";
import { GameDetailsError, GameDetailsPage, GameDetailsPending } from "./features/games/GameDetailsPage";
import { gameDetailsQueryOptions } from "./features/games/gameDetailsQuery";
import { GamesPage } from "./features/games/GamesPage";
import { parseGameId, validateGamesSearch } from "./features/games/routeParams";
import { MyReviewsPage } from "./features/reviews/MyReviewsPage";
import { reviewsQueryOptions } from "./features/reviews/useReviews";
import { queryClient } from "./lib/queryClient";
import { RootError, RootLayout } from "./RootLayout";

type RouterContext = {
  queryClient: QueryClient;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  // Every page talks to Supabase as the anonymous user, so sign in before any loader runs.
  beforeLoad: ({ context }) => context.queryClient.ensureQueryData(sessionQueryOptions),
  component: RootLayout,
  errorComponent: RootError,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: validateGamesSearch,
  component: GamesPage,
});

const gameDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/$gameId",
  params: {
    parse: ({ gameId }) => ({ gameId: parseGameId(gameId) }),
    stringify: ({ gameId }) => ({ gameId: String(gameId) }),
  },
  loader: ({ context, params }) => context.queryClient.ensureQueryData(gameDetailsQueryOptions(params.gameId)),
  component: GameDetailsPage,
  pendingComponent: GameDetailsPending,
  errorComponent: GameDetailsError,
});

const myReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-reviews",
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQueryOptions),
  component: MyReviewsPage,
});

const routeTree = rootRoute.addChildren([gamesRoute, gameDetailsRoute, myReviewsRoute]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  // Start loading a page's data when its link is hovered or focused.
  defaultPreload: "intent",
  // Let TanStack Query decide what is fresh instead of the router's own cache.
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  // Module augmentation only works with an interface.
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}
