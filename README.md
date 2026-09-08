# v0 Personal Website

_Automatically synced with your [v0.dev](https://v0.dev) deployments_

[![Deployed on Cloudflare Workers](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/UNx27p7EMON)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

This project is deployed to the `v0-portfolio` Cloudflare Worker.

The repository includes the OpenNext adapter and Wrangler configuration used by
the repository-owned GitHub Actions deployment workflows. Configure these
repository secrets before making the workflows ready for production:

- `CLOUDFLARE_API_TOKEN`: a token scoped to deploy the `v0-portfolio` Worker
- `CLOUDFLARE_ACCOUNT_ID`: `d825b2cc4fce823f4243ca8617d1ef9b`

| Workflow                | Trigger                      | Wrangler operation         |
| ----------------------- | ---------------------------- | -------------------------- |
| `Cloudflare Preview`    | Ready or updated PR          | `wrangler versions upload` |
| `Cloudflare Production` | Push to `main` or manual run | `wrangler deploy`          |

The repository’s `bun.lock` and `packageManager` field keep the build on Bun.
For an explicit local Workers-runtime preview, run `bun run preview`; for a
production deployment from an authenticated environment, run `bun run deploy`.

Build artifact and mobile Lighthouse regression budgets are checked as part of
the build and integration suites. See [the performance baseline](docs/performance-baseline.md)
for current measurements, budgets, cache behavior, and the reproducible
Turbopack-versus-webpack comparison.

The projects section is served through the same-origin `/api/projects` route.
The route caches GitHub data for one hour and can serve stale data while it
refreshes, so visitors do not each fan out to the GitHub API. GitHub-provided
repository URLs are restricted to HTTPS before they reach the UI. The public
`/.well-known/security.txt` document points researchers to the repository’s
security policy and advisory form.

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/UNx27p7EMON](https://v0.dev/chat/projects/UNx27p7EMON)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. The repository-owned Cloudflare workflows deploy the latest version from
   this repository

## Environment Variables

There are currently no required runtime secrets. For local Workers-runtime
development, copy `.dev.vars.example` to `.dev.vars`; the latter is ignored.
Manage future production variables and secrets in the Cloudflare Worker’s
Variables and Secrets settings, or with Wrangler’s secret commands.
