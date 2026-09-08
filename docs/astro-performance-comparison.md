# Astro performance comparison

Same-runner mobile navigation measurements for the portfolio migration.

**Date:** 2026-09-08
**Baseline:** `a3c43a0abe578513b338ea253c167c9776e89b13` (Next.js/OpenNext)
**Candidate:** `14c3ef7c95ca8f6b12375e6b3ffd98cda9d220d7` (Astro)
**Evidence:** [GitHub Actions run 34289445529](https://github.com/0xPlayerOne/v0-portfolio/actions/runs/34289445529), artifact `astro-migration-validation`

## Method

Three Lighthouse 13.0.1 mobile navigation runs per version on the same Ubuntu runner, served through each revision's pinned local Wrangler. The harness alternated version order and used a fresh Chrome profile for each navigation. Both disposable build worktrees received the same curated project fixture. Dependency installation used each committed frozen lockfile. Headless Chrome reported version 152.0.0.0. These are synthetic localhost results, not field Core Web Vitals or a deployed-CDN comparison.

## Median results

- JavaScript transfer: 160,492 bytes before; 83,198 bytes after; **48.2% lower**.
- Total transfer: 235,152 bytes before; 166,023 bytes after; **29.4% lower**.
- Lighthouse performance score: 97 before; 99 after.
- Largest Contentful Paint: 1,867.14 ms before; 1,821.87 ms after.
- Total Blocking Time: 81 ms before; 0 ms after.
- Cumulative Layout Shift: 0 before and after.
- Local response time: 30 ms before; 5 ms after. Do not extrapolate these localhost timings to production latency.

The strongest result is reduced JavaScript and transfer size. The approximately 45 ms median LCP change is small relative to the observed variation and should not be presented as a reliable real-world loading-speed gain. Zero lab TBT does not establish zero interaction latency or a field INP result.

## Individual samples

Next.js performance scores were 87, 97, and 99; Astro scores were 99, 100, and 99. Next.js LCP samples were 1,867.14, 2,555.78, and 1,834.26 ms; Astro samples were 1,823.41, 1,669.26, and 1,821.87 ms. Next.js TBT samples were 497, 69, and 81 ms; all three Astro samples were 0 ms.

All six raw Lighthouse reports, sample environment information, and JSON/Markdown summaries are retained in the workflow artifact. Build commands took 19.857 seconds for Next/OpenNext and 2.882 seconds for Astro/Worker dry-run in this one run; these one-off timings are informational rather than a controlled build-speed benchmark.

The initial artifact's `metadata.node` field came from Bun's Node-compatibility `process.version`, not the actual Node executable. The harness now queries `node --version` explicitly. This reporting correction does not alter the Lighthouse measurements. The workflow itself provisions Node 24 and Bun 1.4.0.

## Functional validation

Formatting, lint, type checking, 136 unit tests, Astro production build, Worker dry run, artifact-size budgets, and mobile/desktop Playwright checks passed in the same validation run. Unit coverage reported 95.81% lines. Browser checks covered HTML without JavaScript, metadata, section anchors, hydration, no initial project API fetch, refresh and error recovery, offscreen canvas suspension, security metadata/headers, and 404/method handling.

Hero and project screenshots are included for visual review. They are not a pixel-difference comparison against the old application. Review the deployed preview before merge, especially navigation, typography, layout, and reduced-motion behavior.

## Repeat and interpret

```sh
bun run performance:compare --base a3c43a0abe578513b338ea253c167c9776e89b13 --runs 3
```

The read-only `Portfolio Regression Checks` workflow can also be run manually with a baseline ref. To compare deployed URLs, pass both `--base-url` and `--head-url`; keep test location, browser, throttling, and content comparable. The historical Next.js baseline remains unchanged in `performance-baseline.md`.

Initial GitHub cards are a build-time snapshot after this migration, rather than hourly ISR. Explicit refresh still uses the hourly cached API. This freshness tradeoff must be reviewed separately from the performance improvements.
