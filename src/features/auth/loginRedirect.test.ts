import { describe, expect, it } from "vite-plus/test";
import { toSafeRedirectPath, validateLoginSearch } from "./loginRedirect";

describe("toSafeRedirectPath", () => {
  it.each(["/", "/games/72", "/my-reviews", "/?q=zelda", "/games/72#reviews"])("keeps the app path %j", (path) => {
    expect(toSafeRedirectPath(path)).toBe(path);
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "games/72", ""])(
    "rejects %j, which could lead outside the app",
    (value) => {
      expect(toSafeRedirectPath(value)).toBeUndefined();
    },
  );

  it("rejects the login page itself, to avoid a redirect loop", () => {
    expect(toSafeRedirectPath("/login?redirect=/games/72")).toBeUndefined();
  });

  it("rejects values that aren't text", () => {
    expect(toSafeRedirectPath(72)).toBeUndefined();
    expect(toSafeRedirectPath(undefined)).toBeUndefined();
  });
});

describe("validateLoginSearch", () => {
  it("keeps a safe redirect", () => {
    expect(validateLoginSearch({ redirect: "/games/72" })).toEqual({ redirect: "/games/72" });
  });

  it("drops an unsafe redirect", () => {
    expect(validateLoginSearch({ redirect: "https://evil.example" })).toEqual({ redirect: undefined });
  });
});
