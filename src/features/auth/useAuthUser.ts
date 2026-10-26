import type { User } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { queryClient } from "../../lib/queryClient";
import { supabase } from "../../lib/supabase";
import { PROFILE_QUERY_KEY } from "../profiles/profileQuery";
import { reviewsQueryOptions } from "../reviews/useReviews";

let currentUser: User | null = null;
const listeners = new Set<() => void>();

supabase.auth.onAuthStateChange((_event, session) => {
  const nextUser = session?.user ?? null;
  const hasUserChanged = nextUser?.id !== currentUser?.id;
  currentUser = nextUser;
  listeners.forEach((listener) => listener());

  if (hasUserChanged) {
    // Deferred: Supabase warns against calling its client from inside this callback, which can deadlock.
    setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey: reviewsQueryOptions.queryKey });
      // Whether a profile is your own depends on who's signed in.
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    });
  }
});

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getServerUser = (): null => null;

// null until Supabase has restored the session on page load, and while prerendering (nobody is signed in there).
export const useAuthUser = (): User | null => useSyncExternalStore(subscribe, () => currentUser, getServerUser);
