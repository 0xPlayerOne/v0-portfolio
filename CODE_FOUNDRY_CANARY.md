# Code Foundry Canary

Performance-lane activation and a repository-owned validation command for runtime upgrades.

**Scope:** Current Astro/React/Cloudflare portfolio.
**Activation:** Existing Foundry script discovery; this rollout pins Foundry to v1.28.2 without adding a new dependency.

`bun run performance:check` is the dedicated Foundry performance entrypoint. It
builds the Astro site and local Worker bundle once, then runs the existing artifact
budgets once. No Lighthouse/browser invocation is added to this deterministic
measurement lane. The build's existing project-data acquisition behavior is not
changed; artifact measurements are not a claim that all build inputs are offline.

`bun run test:integration` independently builds the site/Worker and runs the
existing repeated Lighthouse audit. It no longer repeats the artifact-budget
script. This browser/lab lane retains its existing Chromium, pinned Lighthouse
network acquisition, Wrangler preview, and runner requirements. It must not be
silently moved into a no-browser performance lane.

For a real consumer canary with the locked toolchain already installed:

```sh
bun install --frozen-lockfile
bun run canary:check
```

The canary runs formatting, lint, Astro types, coverage/unit tests, one build,
one artifact-budget check, and one repeated Lighthouse audit. It invokes the lab
audit directly after the checked build instead of calling `test:integration` and
building again. The separate `test:e2e` user-journey suite remains required by its
existing CI lane; this canary does not replace that suite or silently install its
browser. No command deploys/uploads a Worker.

A consumer workspace can use `bun run canary:check` as this repository's validation
command in its reviewed fleet inventory. Run it against the upgraded isolated
worktree, not against an unrelated main checkout. This file is not a fabricated
inventory of the rest of the application fleet and is not evidence of a completed
canary rollout.

The existing `performance-budgets.json`, artifact/lab checks, coverage threshold,
dependencies, lockfile, and production workflows are unchanged; this rollout updates
the Foundry runtime pin to v1.28.2.
Separate CI jobs still build independently because their filesystems are isolated;
this change removes redundant checks within each lane and duplicates in the
combined canary, not necessary builds in independent runners. Existing ordinary
`build` continues to enforce artifact budgets for local validation.

Before merging, run the locked Bun test/format/lint/type/build suites, confirm the
Foundry performance job actually runs on the PR, and exercise `canary:check` with
Chromium available. Retain `artifacts/performance/build.json` and the raw/summary
Lighthouse reports through the existing workflow's artifact configuration. Shared
product-quality profile adoption can follow its released runtime; this change
does not point consumers at an unmerged Foundry branch.
