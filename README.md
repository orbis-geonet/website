# Orbis Web

The official web client for **Orbis** — a [geo-social network](https://en.wikipedia.org/wiki/Geosocial_networking) where communities claim real-world places and grow their **tribe's** territory on the map. This is the [Next.js](https://nextjs.org/) application behind **[orbis.social](https://orbis.social)**: the live map of tribal territories, tribe / place / user pages, the social feed, the **$ORBIS** exchange, and the [orbis-geonet](https://orbis.social/network) network dashboard.

It is a **thin client** — it talks to an Orbis backend over HTTP and reads on-chain state directly from Solana — so anyone can run their own branded instance and point it at their own deployment.

> **Orbis Web is a read-only, public window into the network.** Its job is to let anyone — signed in or not — **view and share** the web pages of users, tribes, places, and posts, browse the live territory map, and read the [network dashboard](https://orbis.social/network). The interactive parts of Orbis — claiming territory, posting, creating and joining tribes, messaging — happen in the [Android](https://github.com/orbis-geonet/android-app) and iOS apps. The only transactional features on the web are the **$ORBIS exchange** and Stripe **subscription** checkout.

## What it does

Orbis Web renders the public, shareable pages of the network — the map and the profiles behind every claim:


- **Live territory map** — tribal territories rendered as real-time polygons ([Leaflet](https://leafletjs.com/) + [turf](https://turfjs.org/) + `geolib` + `polylabel`), the map primitives from the [territory-fusion research](https://github.com/orbis-geonet/research).
- **Tribes, places & profiles** — browse tribe pages, real-world place pages, and user profiles.
- **Social feed & posts** — posts with threaded comments (App Router parallel routes) and link previews.
- **$ORBIS exchange** — an in-browser SOL ⇄ $ORBIS swap widget using the Solana Wallet Standard and MetaMask's Solana connector.
- **Network dashboard** — [`/network`](https://orbis.social/network), the live orbis-geonet view (program, fees, registered clones).
- **Subscriptions** — Stripe-backed plans and subscribe flows.
- **Referrals & search** — shareable referral links and site-wide search.
- **Internationalization** — 16 languages (`ar, de, en, es, fr, hi, it, ja, ko, nl, pl, pt, ru, tr, zh` + regional), with automatic locale detection by geography and `Accept-Language`.
- **SEO** — dynamic, paginated sitemaps for places and tribes.

## Tech stack

- **Framework:** Next.js 14 (App Router) · React 18 · TypeScript
- **UI:** Tailwind CSS · [shadcn/ui](https://ui.shadcn.com/) · MUI · Embla · Recharts
- **Data:** TanStack Query
- **Auth & media:** Firebase (Authentication, Storage, Realtime Database)
- **Payments:** Stripe
- **Solana:** `@coral-xyz/anchor`, `@solana/web3.js`, `@solana/spl-token`, `@solana/spl-account-compression`, Wallet Standard, MetaMask Solana
- **Maps & geo:** Leaflet, `@turf/turf`, `geolib`, `polylabel`
- **i18n:** `@formatjs/intl-localematcher`, `negotiator`, `countries-list`, `flag-icons`

## How it works

Orbis Web is **operator-run** and holds no application state of its own:

- **Social data** comes from an Orbis **Java backend** at `NEXT_PUBLIC_BACKEND_URL`. Server-side [route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) under `src/app/api/` authenticate to that backend with a **`JAVA_MASTER_KEY`** that lives only on the server — it is never prefixed with `NEXT_PUBLIC_` and never reaches the browser.
- **On-chain data** (the exchange and the network dashboard) is read straight from **Solana** via `NEXT_PUBLIC_RPC_URL` and `NEXT_PUBLIC_PROGRAM_ID`.
- **Auth and media** are handled by Firebase using the public web config.

## Getting started

**Prerequisites:** Node.js 18+, npm, a running Orbis backend URL, and a Firebase web app. Stripe and a dedicated Solana RPC are optional (public RPC is used as a fallback).

```bash
git clone https://github.com/orbis-geonet/website.git
cd website
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Build and run for production:

```bash
npm run build
npm run start
```

Or with Docker (see [`Dockerfile`](./Dockerfile)):

```bash
docker build -t orbis-web .
docker run -p 3000:3000 --env-file .env.local orbis-web
```

## Environment variables

Copy [`.env.example`](./.env.example) to `.env.local` and fill it in. **Any variable prefixed with `NEXT_PUBLIC_` is bundled into the browser** — never put a real secret in one.

| Variable | Scope | Description |
|---|---|---|
| `JAVA_MASTER_KEY` | **Server only** | Master key the API routes use to call the Java backend. Never prefix with `NEXT_PUBLIC_`. |
| `ALLOWED_ORIGINS` | Server only | Comma-separated origins allowed by CORS in `middleware.ts`. |
| `NEXT_PUBLIC_BASE_URL` | Public | Public base URL of this site. |
| `NEXT_PUBLIC_BACKEND_URL` | Public | Base URL of the Orbis backend. |
| `NEXT_PUBLIC_DOMAIN` | Public | Site domain (used for metadata / links). |
| `NEXT_PUBLIC_ENVIRONMENT` | Public | `dev` / `prod`. |
| `NEXT_PUBLIC_FIREBASE_*` | Public | Firebase web app config (API key, auth domain, database URL, project ID, storage bucket, messaging sender ID, app ID, measurement ID). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Google Analytics tag (optional — omit to disable). |
| `NEXT_PUBLIC_RPC_URL` | Public | Solana RPC endpoint (falls back to the public cluster if omitted). |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Public | `mainnet-beta` / `devnet` / `testnet` — must match the RPC URL. |
| `NEXT_PUBLIC_ADMIN_WALLET` | Public | Admin Solana wallet public key shown in the exchange. |
| `NEXT_PUBLIC_ORBIS_MINT` | Public | $ORBIS SPL token mint address. |
| `NEXT_PUBLIC_ORBIS_DECIMALS` | Public | $ORBIS token decimals (default `6`). |
| `NEXT_PUBLIC_ORBIS_RATE` | Public | Display rate, $ORBIS per 1 SOL (admin-set). |
| `NEXT_PUBLIC_PROGRAM_ID` | Public | Orbis Protocol program ID on Solana. |

> Firebase web config, publishable keys, and Solana addresses are public by design (they ship to the browser). The Firebase console keys should still be locked to your domain, and only `JAVA_MASTER_KEY` / `ALLOWED_ORIGINS` are true server secrets.

## Project structure

```
src/
  app/            App Router routes: map, network, exchange, group (tribes),
                  place, user, post, plans, subscribe, referral, search, sitemaps
    api/          Server route handlers: parse-address, preview, swap
  components/     Shared components (components/ui = shadcn/ui)
  context/        React context providers
  hooks/          Custom hooks
  lib/            locales/, sections/, utils/, types/, styles/
  middleware.ts   Locale detection + CORS
public/           Static assets and generated sitemaps
```

## Deployment

The included [`bitbucket-pipelines.yml`](./bitbucket-pipelines.yml) builds `main` and deploys to a production host over SSH (running `scripts/build.sh` on the server). All deploy credentials are injected as pipeline variables — none are committed. The [`Dockerfile`](./Dockerfile) (Node 18 Alpine) builds and serves the app on port 3000.

## For clone operators — rebrand before publishing

"Orbis" and its branding belong to the original project. If you deploy your own instance, **rebrand before shipping** — do not publish it as "Orbis." At minimum:

- **Name & metadata** — site title, descriptions, and Open Graph data.
- **Domain** — set `NEXT_PUBLIC_DOMAIN` / `NEXT_PUBLIC_BASE_URL` to your own.
- **Branding** — replace the logo and assets in [`public/`](./public).
- **Backend & services** — point `NEXT_PUBLIC_BACKEND_URL` at your own Orbis backend, set your own `JAVA_MASTER_KEY`, and use your own Firebase project, Stripe account, and Solana RPC.

---

## License

[AGPL-3.0](./LICENSE).
