// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { takeAuthRedirectErrorCode } from "../authRedirectError";

const visit = (path: string): void => window.history.replaceState(null, "", path);

describe("takeAuthRedirectErrorCode", () => {
  afterEach(() => visit("/"));

  it("reads the error code from the query string and removes the error params", () => {
    visit(
      "/games/72?error=server_error&error_code=identity_already_exists&error_description=Identity+is+already+linked",
    );

    expect(takeAuthRedirectErrorCode()).toBe("identity_already_exists");
    expect(window.location.pathname + window.location.search).toBe("/games/72");
  });

  it("reads the error code from the hash and keeps unrelated params", () => {
    visit("/?q=zelda#error=server_error&error_code=identity_already_exists");

    expect(takeAuthRedirectErrorCode()).toBe("identity_already_exists");
    expect(window.location.search).toBe("?q=zelda");
    expect(window.location.hash).toBe("");
  });

  it("falls back to the error param when there's no error_code", () => {
    visit("/games/72?error=access_denied&error_description=The+user+denied+access");

    expect(takeAuthRedirectErrorCode()).toBe("access_denied");
    expect(window.location.search).toBe("");
  });

  it("returns null and leaves the URL alone without an error", () => {
    visit("/my-reviews?q=1");

    expect(takeAuthRedirectErrorCode()).toBeNull();
    expect(window.location.pathname + window.location.search).toBe("/my-reviews?q=1");
  });
});
