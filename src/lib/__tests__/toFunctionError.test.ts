import { FunctionsHttpError } from "@supabase/supabase-js";
import { describe, expect, it } from "vite-plus/test";
import { toFunctionError } from "../toFunctionError";

const INTERNAL_SERVER_ERROR = 500;

const createHttpError = (body: string): FunctionsHttpError =>
  new FunctionsHttpError(new Response(body, { status: INTERNAL_SERVER_ERROR }));

describe("toFunctionError", () => {
  it("uses the edge function's own error message", async () => {
    const error = await toFunctionError(createHttpError(JSON.stringify({ error: "Game 999 not found" })));
    expect(error.message).toBe("Game 999 not found");
  });

  it("keeps the original message when the response has no error message", async () => {
    const httpError = createHttpError("not json");
    const error = await toFunctionError(httpError);
    expect(error.message).toBe(httpError.message);
  });

  it("returns other errors unchanged", async () => {
    const networkError = new Error("Failed to fetch");
    expect(await toFunctionError(networkError)).toBe(networkError);
  });
});
