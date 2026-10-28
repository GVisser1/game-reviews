import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import { toFunctionError } from "../../utils/errorUtil";
import type { GameDetails } from "./types";

const fetchGameDetails = async (id: number): Promise<GameDetails> => {
  const { data, error } = await supabase.functions.invoke<GameDetails>("igdb-game-details", {
    body: { id },
  });
  if (!isNil(error)) {
    throw await toFunctionError(error);
  }
  if (isNil(data)) {
    throw new Error(`Game ${id} not found`);
  }
  return data;
};

export const gameDetailsQueryOptions = (gameId: number) =>
  queryOptions({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameDetails(gameId),
  });
