import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";

// Deletes the signed-in user together with their profile and reviews (see the delete_own_account migration).
export const deleteAccount = async (): Promise<void> => {
  const { error } = await supabase.rpc("delete_own_account");
  if (!isNil(error)) {
    throw error;
  }
  // The server-side session no longer exists, so only clear the one stored in this browser.
  await supabase.auth.signOut({ scope: "local" });
};
