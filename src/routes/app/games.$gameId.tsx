import { createFileRoute } from "@tanstack/react-router";
import { GameDetailsError, GameDetailsPage, GameDetailsPending } from "../../features/games/GameDetailsPage";
import { gameDetailsQueryOptions } from "../../features/games/gameDetailsQuery";
import { parseGameId } from "../../features/games/routeParams";
import { pageHead } from "../../lib/pageHead";

const FALLBACK_PAGE_NAME = "Game";

export const Route = createFileRoute("/app/games/$gameId")({
  params: {
    parse: ({ gameId }) => ({ gameId: parseGameId(gameId) }),
    stringify: ({ gameId }) => ({ gameId: String(gameId) }),
  },
  loader: ({ context, params }) =>
    context.queryClient.query({ ...gameDetailsQueryOptions(params.gameId), staleTime: "static" }),
  // No loader data while the game is loading or wasn't found.
  head: ({ loaderData }) => pageHead(loaderData?.name ?? FALLBACK_PAGE_NAME),
  component: GameDetailsPage,
  pendingComponent: GameDetailsPending,
  errorComponent: GameDetailsError,
});
