# AndrewMF portfolio

Personal portfolio at [andrewmf.com](https://andrewmf.com), built with Astro, React islands, Tailwind CSS, and Cloudflare Workers Static Assets.

## Development

Use the existing toolchain: Node 24 and Bun 1.4.0 (see `.mise.toml`).

```sh
bun install --frozen-lockfile
bun run dev
bun run typecheck
bun run test:coverage
bun run build
bun run preview
```

`astro dev` provides the fast UI development loop. For the real `/api/projects` Worker, static-asset headers, caching, and 404 behavior, use `bun run preview`. It builds and runs Wrangler locally. A refresh request in the Astro-only development server does not reach the Worker; use the Workers preview to exercise it.

## Rendering and data freshness

Astro prerenders the page and initial project cards. There is no client-side project fetch on initial navigation. Pong/navigation hydrates immediately; the About tabs, project refresh, and contact control hydrate as they approach the viewport. Skills render as HTML with CSS-only hover effects. Existing React components, responsive styling, and canvas visibility/reduced-motion logic are preserved.

The initial project snapshot changes on deployment, **not hourly through ISR**. The explicit refresh button uses the same-origin `/api/projects` endpoint, cached for one hour with stale-while-revalidate. A new build refreshes the crawlable snapshot. No scheduled production deployment is introduced by this migration. See [the migration notes](docs/astro-migration.md) before choosing a rebuild schedule.

Inter and Press Start 2P are self-hosted, Latin-subset font assets with swap behavior and preload links. No request to Google Fonts is needed at build or runtime.

## Deployment

The existing repository-owned Cloudflare Preview and Production workflows remain the deployment entry points. The Worker name and account are unchanged. They use `cloudflare:build`; the output changes from OpenNext to `dist/` plus the small `worker/index.ts` project API. Static page and asset requests bypass Worker execution. Hashed `/_astro/*` assets retain one-year immutable caching.

Required deployment secrets are unchanged: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. No runtime secrets or additional bindings are required. The production workflow deploys only when changes reach `main` or an authorized maintainer runs it manually.

```sh
bun run preview      # Build and run the actual Worker locally
bun run upload       # Upload a preview version from an authenticated environment
bun run deploy       # Deploy from an authenticated environment
```

Do not overwrite the Astro application with the original v0/Next.js sync output. Use the repository as the source of truth for this implementation.

## Validation and before/after performance

```sh
bun run format:check
bun run lint
bun run typecheck
bun run test:coverage
bun run build
bun run test:e2e
bun run performance:audit
bun run performance:compare --base a3c43a0abe578513b338ea253c167c9776e89b13 --runs 3
```

The comparison command creates disposable worktrees, installs each committed lockfile, builds both versions with identical fixture data, serves both through local Wrangler, alternates three cold-browser mobile Lighthouse samples per version, and writes raw reports and medians under `artifacts/performance/comparison/`. It never resets your working tree. Node, Bun, Git, npm/npx, Chrome, and network access to install dependencies are required. Both refs must be available locally (`git fetch origin` first in a shallow checkout).

For deployed Cloudflare checks, use the same harness with the existing production URL and the PR preview URL:

```sh
bun run performance:compare --base-url https://andrewmf.com --head-url https://YOUR-PREVIEW-URL --runs 3
```

The [historical Next.js baseline](docs/performance-baseline.md) is retained unchanged. Fresh comparisons and browser screenshots are evidence for review, not an assumption that Astro is faster. Navigation Lighthouse does not measure representative field INP.
