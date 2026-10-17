import { queryOptions } from "@tanstack/react-query";
import { isNil } from "lodash";
import { supabase } from "../../lib/supabase";

const ensureAnonymousSession = async (): Promise<true> => {
  const { data } = await supabase.auth.getSession();
  if (!isNil(data.session)) {
    return true;
  }

  const { error } = await supabase.auth.signInAnonymously();
  if (!isNil(error)) {
    throw error;
  }
  return true;
};

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: ensureAnonymousSession,
  staleTime: Infinity,
  retry: false,
});
