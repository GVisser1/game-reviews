import { createFileRoute } from "@tanstack/react-router";
import { GamesPage } from "../../features/games/GamesPage";
import { validateGamesSearch } from "../../features/games/routeParams";

export const Route = createFileRoute("/app/")({
  validateSearch: validateGamesSearch,
  component: GamesPage,
});
