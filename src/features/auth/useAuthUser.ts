import type { User } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { queryClient } from "../../lib/queryClient";
import { supabase } from "../../lib/supabase";
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
    setTimeout(() => void queryClient.invalidateQueries({ queryKey: reviewsQueryOptions.queryKey }));
  }
});

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// null until Supabase has restored the session on page load.
export const useAuthUser = (): User | null => useSyncExternalStore(subscribe, () => currentUser);
