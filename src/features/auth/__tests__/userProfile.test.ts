import type { User, UserIdentity } from "@supabase/supabase-js";
import { describe, expect, it } from "vite-plus/test";
import { getAvatarUrl, getDisplayName } from "../userProfile";

const createUser = (userMetadata: Record<string, unknown>, identities: UserIdentity[] = []): User => ({
  id: "user-id",
  app_metadata: {},
  user_metadata: userMetadata,
  identities,
  aud: "authenticated",
  created_at: "2026-10-17T00:00:00Z",
});

const createIdentity = (provider: string, identityData: Record<string, unknown>): UserIdentity => ({
  id: `${provider}-identity`,
  user_id: "user-id",
  identity_id: `${provider}-identity-id`,
  provider,
  identity_data: identityData,
});

describe("profile from a linked Twitch identity", () => {
  it("reads the name and avatar from the Twitch identity when user_metadata is empty", () => {
    const user = createUser({}, [
      createIdentity("twitch", { nickname: "GameFan", avatar_url: "https://example.com/t.png" }),
    ]);

    expect(getDisplayName(user)).toBe("GameFan");
    expect(getAvatarUrl(user)).toBe("https://example.com/t.png");
  });

  it("prefers the Twitch identity over user_metadata", () => {
    const user = createUser({ name: "old name" }, [createIdentity("twitch", { name: "twitch name" })]);

    expect(getDisplayName(user)).toBe("twitch name");
  });

  it("ignores identities from other providers", () => {
    const user = createUser({ name: "metadata name" }, [createIdentity("anonymous", { name: "other" })]);

    expect(getDisplayName(user)).toBe("metadata name");
  });
});

describe("getDisplayName", () => {
  it("prefers the nickname", () => {
    expect(getDisplayName(createUser({ nickname: "GameFan", name: "gamefan" }))).toBe("GameFan");
  });

  it("falls back through the other name fields", () => {
    expect(getDisplayName(createUser({ full_name: "Game Fan" }))).toBe("Game Fan");
    expect(getDisplayName(createUser({ preferred_username: "gamefan" }))).toBe("gamefan");
  });

  it("skips empty values", () => {
    expect(getDisplayName(createUser({ nickname: "", name: "gamefan" }))).toBe("gamefan");
  });

  it("uses a generic name when the provider sent none", () => {
    expect(getDisplayName(createUser({}))).toBe("Twitch user");
  });
});

describe("getAvatarUrl", () => {
  it("reads avatar_url or picture", () => {
    expect(getAvatarUrl(createUser({ avatar_url: "https://example.com/a.png" }))).toBe("https://example.com/a.png");
    expect(getAvatarUrl(createUser({ picture: "https://example.com/p.png" }))).toBe("https://example.com/p.png");
  });

  it("returns null without an avatar", () => {
    expect(getAvatarUrl(createUser({}))).toBeNull();
  });
});
