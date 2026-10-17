const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_API_URL = "https://api.igdb.com/v4";
const MS_PER_SECOND = 1000;
const TOKEN_REFRESH_MARGIN_MS = 60_000;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AccessToken = {
  value: string;
  expiresAt: number;
};

const clientId = Deno.env.get("TWITCH_CLIENT_ID") ?? "";
const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET") ?? "";

// Twitch tokens last ~60 days, so reuse one per function instance instead of requesting one per call.
let cachedToken: AccessToken | undefined;

const getAccessToken = async (): Promise<string> => {
  if (cachedToken !== undefined && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });
  const response = await fetch(`${TWITCH_TOKEN_URL}?${params}`, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Twitch token request failed: ${response.status}`);
  }

  const { access_token, expires_in } = await response.json();
  cachedToken = {
    value: access_token,
    expiresAt: Date.now() + expires_in * MS_PER_SECOND - TOKEN_REFRESH_MARGIN_MS,
  };
  return cachedToken.value;
};

export const queryIgdb = async <T>(endpoint: string, query: string): Promise<T[]> => {
  const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: query,
  });
  if (!response.ok) {
    throw new Error(`IGDB request failed: ${response.status}`);
  }
  return response.json();
};

export const handleRequest =
  (handler: (request: Request) => Promise<unknown>) =>
  async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") {
      return new Response("ok", { headers: CORS_HEADERS });
    }

    try {
      return Response.json(await handler(request), { headers: CORS_HEADERS });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return Response.json({ error: message }, { status: 500, headers: CORS_HEADERS });
    }
  };
