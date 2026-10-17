import { createFileRoute } from "@tanstack/react-router";
import { GameDetailsError, GameDetailsPage, GameDetailsPending } from "../../features/games/GameDetailsPage";
import { gameDetailsQueryOptions } from "../../features/games/gameDetailsQuery";
import { parseGameId } from "../../features/games/routeParams";

export const Route = createFileRoute("/app/games/$gameId")({
  params: {
    parse: ({ gameId }) => ({ gameId: parseGameId(gameId) }),
    stringify: ({ gameId }) => ({ gameId: String(gameId) }),
  },
  loader: ({ context, params }) => context.queryClient.ensureQueryData(gameDetailsQueryOptions(params.gameId)),
  component: GameDetailsPage,
  pendingComponent: GameDetailsPending,
  errorComponent: GameDetailsError,
});
