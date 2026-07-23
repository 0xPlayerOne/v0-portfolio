# v0 Personal Website

_Automatically synced with your [v0.dev](https://v0.dev) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nifty-andy/v0-portfolio)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/UNx27p7EMON)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/nifty-andy/v0-portfolio](https://vercel.com/nifty-andy/v0-portfolio)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/UNx27p7EMON](https://v0.dev/chat/projects/UNx27p7EMON)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Environment Variables

Environment variables are managed in **Vercel** (source of truth). Sync them locally:

```bash
# Link this project to its Vercel project (one-time)
vercel link

# Pull all env vars into .env.local (gitignored)
vercel env pull .env.local
```

To push local changes back to Vercel:

```bash
vercel env push .env.local
# or set them per-environment (Production / Preview) in the Vercel dashboard
```

> Never commit `.env.local` — it is gitignored. For team projects use `vercel --scope niftyleague`.
> // staging sync: reset to main
