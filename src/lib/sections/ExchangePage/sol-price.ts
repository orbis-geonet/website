let _cached: { price: number; ts: number } | null = null;
const TTL_MS = 60_000;

export async function getSolPriceUsd(): Promise<number> {
  if (_cached && Date.now() - _cached.ts < TTL_MS) return _cached.price;

  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error(`CoinGecko error ${res.status}`);

  const data = (await res.json()) as { solana: { usd: number } };
  const price = data.solana.usd;

  if (!price || !Number.isFinite(price)) throw new Error("Invalid SOL price from CoinGecko");

  _cached = { price, ts: Date.now() };
  return price;
}
