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
Cloudflare Workers Builds. Configure the Worker’s build settings as follows:

| Setting                       | Value                       |
| ----------------------------- | --------------------------- |
| Production branch             | `main`                      |
| Root directory                | `.`                         |
| Build command                 | `bun run cloudflare:build`  |
| Deploy command                | `bun run cloudflare:deploy` |
| Non-production deploy command | `bun run cloudflare:upload` |

The repository’s `bun.lock` and `packageManager` field keep the build on Bun.
For a local Workers-runtime preview, run `bun run preview`; for a production
deployment from an authenticated environment, run `bun run deploy`.

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/UNx27p7EMON](https://v0.dev/chat/projects/UNx27p7EMON)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Cloudflare Workers Builds deploys the latest version from this repository

## Environment Variables

There are currently no required runtime secrets. For local Workers-runtime
development, copy `.dev.vars.example` to `.dev.vars`; the latter is ignored.
Manage future production variables and secrets in the Cloudflare Worker’s
Variables and Secrets settings, or with Wrangler’s secret commands.
