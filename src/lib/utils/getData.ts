import { BASE_URL } from "../ts";

const isServer = typeof window === "undefined";

export const getData = async (endpoint: string, cache: boolean = true) => {
  const url = isServer
    ? `${BASE_URL}/api/${endpoint}`
    : `/api/${endpoint}`;

  const headers: Record<string, string> = {};
  if (isServer) {
    const masterKey = process.env.JAVA_MASTER_KEY;
    if (!masterKey) {
      throw new Error(
        "Missing required environment variable: JAVA_MASTER_KEY. Set it in your .env file."
      );
    }
    headers["X-Master-Key"] = masterKey;
  }

  try {
    const res = cache
      ? await fetch(url, { cache: "force-cache", headers })
      : await fetch(url, { cache: "no-cache", headers });

    if (!res.ok) {
      return { error: true };
    }

    return await res.json();
  } catch {
    return { error: true };
  }
};
