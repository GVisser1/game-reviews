const ERROR_PARAMS = ["error", "error_code", "error_description"];

// Supabase reports a failed OAuth redirect (e.g. the user declined on Twitch) in the URL's query or hash.
// Read it once and strip it, so the error doesn't stay in the address bar or get handled twice.
export const takeAuthRedirectErrorCode = (): string | null => {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.slice(1));
  // Not every failure has an error_code (a declined Twitch login only sends error=access_denied).
  const errorCode =
    url.searchParams.get("error_code") ??
    hashParams.get("error_code") ??
    url.searchParams.get("error") ??
    hashParams.get("error");
  if (errorCode === null) {
    return null;
  }

  ERROR_PARAMS.forEach((param) => {
    url.searchParams.delete(param);
    hashParams.delete(param);
  });
  url.hash = hashParams.toString();
  window.history.replaceState(window.history.state, "", url);
  return errorCode;
};
