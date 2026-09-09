# Astro architecture

Static-first portfolio rendering with explicit React islands and a small Cloudflare API.

**Status:** Adopted.
**Historical baseline:** `a3c43a0abe578513b338ea253c167c9776e89b13` (Next.js/OpenNext).

## Architecture

`src/pages/index.astro` owns document assembly. `src/layouts/Layout.astro` owns metadata, canonical URL, icon links, and self-hosted fonts. The existing content, React UI primitives, and canvas implementation are reused. The `SkillsSection` has no hydration directive; its existing glow is also expressed in CSS so static rendering does not lose the hover effect. Pong/navigation uses `client:load`; the other interactive sections use `client:visible` with a 200px pre-hydration margin. The page is not wrapped in one hydrated React root.

Cloudflare serves static output from `dist/`. Only `/api/projects` and its trailing-slash variant invoke the project Worker. The cached feed is public and non-personal: arbitrary request query strings and cookies never change the cache key or GitHub request. The Worker explicitly implements stale-while-revalidate with Cache API storage, one-hour freshness, background refresh, and in-isolate request coalescing. Cache API is per data center, not a global database. HTTPS URL validation and fallback behavior remain in the shared GitHub loader and response module.

Astro, React, and the existing Bun package manager are the application toolchain. Cloudflare deployment keeps the existing Worker identity and account. No runtime credentials are included in tests or fixtures.

## Data freshness

Initial HTML contains build-time repository data. It does not revalidate hourly through page rendering. Project refresh remains available through the hourly cached API, and a new deployment updates the crawlable snapshot. Builds fall back to curated cards when upstream access fails or returns no projects; they do not require a GitHub token.

If hourly search-indexable star counts become important, add a deliberate scheduled rebuild rather than silently introducing request-time rendering.

## Validation

Use `bun run test:e2e` for mobile/desktop browser checks against Wrangler: initial HTML without JavaScript, title/canonical/description, section anchors, island hydration, no initial project API waterfall, refresh/error recovery, canvas pause when offscreen, security headers, security.txt, and 404 status. Screenshots and retained failure traces are written under `artifacts/` for human visual review. Screenshots are review artifacts, not a claim of automated pixel-diff equivalence with Next.js.

After `bun run build`, `bun run performance:audit` checks repeated mobile Lighthouse measurements through the real Worker preview and enforces the configured lab budgets. The historical before/after migration measurements are retained in [the comparison record](./astro-performance-comparison.md); navigation Lighthouse cannot produce representative field INP, GPU/gameplay smoothness, or real-user p75 results.

## Operations

Review font metrics, sticky navigation, About tabs, links, mailto behavior, and reduced-motion behavior at mobile and desktop widths when changing the page. The production workflow deploys the Astro build only after the migration is merged. To roll back, revert the migration commit and rebuild the original application from its historical revision through the established workflow; do not point the Astro build at `.open-next` or deploy stale artifacts from a previous build.
