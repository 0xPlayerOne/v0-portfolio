# Performance baseline

This document defines the reproducible release baseline for the Next.js and
OpenNext/Cloudflare application. It was established on 2026-09-08 from commit
`02092d5` using Bun 1.4.0, Next.js 16.3.4, `@opennextjs/cloudflare` 1.20.6,
and Lighthouse 13.0.1.

## Release budgets

The machine-readable source of truth is [`performance-budgets.json`](../performance-budgets.json).
`bun run build` enforces OpenNext artifact budgets and `bun run test:integration`
builds the production application and enforces the mobile Lighthouse budgets.

| Measurement                   |                 Baseline |              Budget | Enforcement               |
| ----------------------------- | -----------------------: | ------------------: | ------------------------- |
| Lighthouse performance score  |                0.81-1.00 |             >= 0.75 | Integration test          |
| TTFB, local production server |                  3-20 ms |           <= 600 ms | Integration test          |
| LCP, Lighthouse mobile        |           1,806-2,473 ms |         <= 3,000 ms | Integration test          |
| CLS, Lighthouse mobile        |                        0 |             <= 0.10 | Integration test          |
| Total blocking time           |                 9-479 ms |           <= 750 ms | Integration test          |
| JavaScript transfer           |            161,989 bytes |    <= 204,800 bytes | Integration test          |
| Total transfer                |            239,138 bytes |    <= 307,200 bytes | Integration test          |
| LCP p75                       | No CrUX sample available |         <= 2,500 ms | Field-data release review |
| CLS p75                       | No CrUX sample available |             <= 0.10 | Field-data release review |
| INP p75                       | No CrUX sample available |           <= 200 ms | Field-data release review |
| OpenNext output               |         21,820,911 bytes | <= 26,214,400 bytes | Build                     |
| OpenNext assets               |          1,032,928 bytes |  <= 1,258,291 bytes | Build                     |
| OpenNext asset JavaScript     |            645,206 bytes |    <= 734,003 bytes | Build                     |
| OpenNext server handler       |          2,972,765 bytes |  <= 3,407,872 bytes | Build                     |

INP requires real-user interaction. A synthetic Lighthouse navigation cannot
produce a representative INP, and the public PageSpeed request made for this
baseline was quota-limited. Release review must use the 28-day CrUX p75 for
LCP, CLS, and INP once the origin has sufficient traffic and API access; it
must not substitute zero or total blocking time as if either were measured
INP. TBT remains a lab responsiveness guardrail. The 3,000 ms synthetic LCP
ceiling includes run-to-run headroom, while the field target remains the Core
Web Vitals threshold of 2,500 ms at p75.

GitHub's shared runner produced a 0.81 score and 479 ms TBT while the same
revision measured 0.98-1.00 and 9-42 ms locally. The synthetic score and TBT
ceilings include runner headroom; they are regression alarms, not claims that
those ceilings are good field performance. The stricter field targets remain
the release-review standard.

## Compiler and bundler comparison

Both supported Next.js 16 production bundlers were run from a cold `.next`
directory on the same machine. Build timings are informational because they
vary with hardware and load; artifact and Lighthouse budgets are the stable
regression gates.

| Bundler             | Command                       | Wall time | Compile time | `.next` disk usage |
| ------------------- | ----------------------------- | --------: | -----------: | -----------------: |
| Turbopack (default) | `bunx next build --turbopack` |    8.11 s |        2.3 s |         41,764 KiB |
| webpack (fallback)  | `bunx next build --webpack`   |   13.58 s |        3.2 s |         74,336 KiB |

Turbopack stays selected. In this cold run it reduced wall time by 40% and
`.next` disk usage by 44% without changing the application or visual output.
Webpack remains a supported diagnostic fallback through Next's `--webpack`
flag, but it is not the release path.

The full OpenNext build (`bun run cloudflare:build`) completed in 11.57 s.
OpenNext used the default Turbopack `next build`, emitted 1,259 files, and
produced the artifact sizes recorded above.

## Route loading and cache behavior

The build prerenders `/`, `/_not-found`, `/.well-known/security.txt`, and
`/api/projects`. The project API revalidates hourly.

Production checks against `https://andrewmf.com` returned:

- `/`: HTTP 200, 72,671-byte HTML, `Cache-Control: s-maxage=31536000`, and
  `x-nextjs-prerender: 1`.
- `/api/projects`: HTTP 200, 2,239-byte JSON, `s-maxage=3600`, and
  `stale-while-revalidate=86400`.
- `/_next/static/*`: one-year immutable browser caching from `public/_headers`.
- Five sequential production navigations had TTFB values of 481, 431, 159,
  182, and 441 ms (median 431 ms). This captures internet and edge variance;
  the deterministic CI budget uses the local production server.

The existing cache policy and Turbopack release path are the selected
optimizations. They improve repeat loading and build performance without any
visual change. Future optimization work should begin only after a budget
regression or a stable field-data signal identifies a bottleneck.

## Reproduction

```sh
bun install --frozen-lockfile
bun run build
bun run test:integration
```

For a cold bundler comparison, remove only generated `.next` output between
the two commands, then run `bunx next build --turbopack` and
`bunx next build --webpack`. Use the same machine, dependency tree, and power
state, and report every sample rather than comparing warm and cold builds.

## References

- [Next.js Turbopack reference](https://nextjs.org/docs/app/api-reference/turbopack)
- [OpenNext Cloudflare performance guidance](https://opennext.js.org/cloudflare/perf)
- [OpenNext Cloudflare caching guidance](https://opennext.js.org/cloudflare/caching)
- [Core Web Vitals thresholds](https://web.dev/articles/vitals)
- [Lab and field data differences](https://web.dev/articles/lab-and-field-data-differences)
