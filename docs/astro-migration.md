# Astro migration

Static-first portfolio rendering with explicit React islands and a small Cloudflare API.

**Status:** Proposed migration; review the PR's validation results and performance artifacts before merging.
**Baseline:** `a3c43a0abe578513b338ea253c167c9776e89b13` (Next.js/OpenNext).
**Scope:** Portfolio only; no TanStack Start adoption, production deployment, or unrelated application migration.

## Architecture

`src/pages/index.astro` owns document assembly. `src/layouts/Layout.astro` owns metadata, canonical URL, icon links, and self-hosted fonts. The existing content, React UI primitives, and canvas implementation are reused. The `SkillsSection` has no hydration directive; its existing glow is also expressed in CSS so static rendering does not lose the hover effect. Pong/navigation uses `client:load`; the other interactive sections use `client:visible` with a 200px pre-hydration margin. Do not wrap the entire page in one hydrated React root.

Cloudflare serves static output from `dist/`. Only `/api/projects` and its trailing-slash variant invoke the project Worker. The cached feed is public and non-personal: arbitrary request query strings and cookies never change the cache key or GitHub request. The Worker explicitly implements stale-while-revalidate with Cache API storage, one-hour freshness, background refresh, and in-isolate request coalescing. Cache API is per data center, not a global database. Existing HTTPS URL validation and fallback behavior remain in the shared GitHub loader and response module.

Next.js, its font loader, and OpenNext are removed. The existing Bun package manager, React component tests, deployment workflow entry points, Worker identity, and Cloudflare account are preserved. No production credentials are included in tests or fixtures.

## Deliberate behavior change: snapshot freshness

Initial HTML contains build-time repository data. It no longer revalidates hourly via Next ISR. Project refresh remains available through the hourly cached API, and a new deployment updates the search-indexable snapshot. Builds fall back to curated cards when upstream access fails or returns no projects; they do not require a GitHub token.

This is a reasonable default for a mostly static personal portfolio, but it is a review decision. A scheduled rebuild can be added later if hourly search-indexable star counts matter. This PR does not silently create recurring production deployments or reintroduce request-time page rendering.

## Validation and interpretation

Use `bun run test:e2e` for mobile/desktop browser checks against Wrangler: initial HTML without JavaScript, title/canonical/description, section anchors, island hydration, no initial project API waterfall, refresh/error recovery, canvas pause when offscreen, security headers, security.txt, and 404 status. Screenshots and retained failure traces are written under `artifacts/` for human visual review. Screenshots are review artifacts, not a claim of automated pixel-diff equivalence with Next.js.

`bun run performance:compare --base <next-commit> --head <astro-commit> --runs 3` creates disposable worktrees from immutable commits. It injects the same curated project fixture into each copy's loader before building, keeping API availability and changing repository metadata out of the experiment. Installs use each revision's frozen lockfile. Both versions run through their pinned Wrangler on localhost. Lighthouse 13.0.1 runs in a fresh browser profile each time, alternates version order, and saves every raw report, environment information, individual sample, median, and delta. Build timings are informational and should not be treated as a framework benchmark.

`performance:audit` checks median lab budgets through the real Worker preview. `performance:artifacts` checks the new static/Worker outputs against the unchanged byte ceilings under framework-neutral names. Lab and field thresholds are not loosened. Preserve the historical Next baseline as historical evidence; do not overwrite it with an unrelated-machine Astro score.

Navigation Lighthouse cannot produce representative field INP, GPU/gameplay smoothness, or real-user p75 results. Review the interaction tests and screenshots, then compare production and preview on the same device/location. Do not merge solely because a score reaches 100.

## Rollout and rollback

Do not merge until the lockfile, build, type checking, unit tests, browser checks, and Cloudflare preview are validated. Review font metrics, sticky navigation, About tabs, links, mailto behavior, and reduced-motion behavior at mobile and desktop widths.

The production workflow changes only when this PR is merged. Existing OpenNext infrastructure is not deleted by the PR. Roll back by reverting the migration commit(s) and rebuilding the original lockfile/configuration through the established workflow. Do not point the Astro build at `.open-next` or deploy stale artifacts from a previous build.
