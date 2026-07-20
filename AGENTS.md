## Stack

- Next.js 16.2.10 (App Router, Turbopack) + React 19.2.7
- TypeScript 5.9.3 (pinned: typescript-eslint / eslint-config-next@16 require `<6.1.0`), `strict: true`, path alias `@/*` → `./*`
- Tailwind CSS 4.3.3 (`@import "tailwindcss"` in CSS, theme via `@theme` in `app/globals.css`) + shadcn/ui (Radix primitives) + `lucide-react` icons. **No `tailwind.config.js`** — v4 uses CSS-first config. `tw-animate-css` replaces `tailwindcss-animate`.
- Bun 1.3.14 (frozen lockfile committed). `packageManager: bun@1.3.14` in `package.json`
- Toolchain pinned in `mise.toml`: `node = 24.18.0`, `bun = 1.3.14`. CI installs via `jdx/mise-action` — local devs should `mise use` or match exactly, otherwise `bun.lock` resolution drifts
- Tests: Bun native `bun:test` + `@testing-library/react` v16 + `happy-dom` (registered via `@happy-dom/global-registrator`)
- Lint/format: ESLint 9 flat config (`eslint-config-next` v16 — native flat config, consumed directly in `eslint.config.mjs`, NOT via `FlatCompat`) + Prettier 3.9 with `prettier-plugin-tailwindcss`
- Pre-commit: husky + lint-staged (prettier + eslint on changed files)
- Deploy: Vercel, auto-syncs from v0.dev chats

## Commands

All scripts are real entries in `package.json`. Run via `bun run <name>` unless noted.

| Script       | Command                                                          | Use                                                                                                     |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| install      | `bun install --frozen-lockfile`                                  | always; never `npm i` / `yarn` / `pnpm`. In CI-shaped envs, `--frozen-lockfile` is mandatory            |
| dev          | `bun run dev` (`next dev`)                                       | local dev server                                                                                        |
| build        | `bun run build` (`next build`)                                   | production build                                                                                        |
| start        | `bun run start` (`next start`)                                   | serve production build                                                                                  |
| lint         | `bun run lint` (`eslint . --max-warnings=0`)                     | zero warnings, will fail CI on any                                                                      |
| type-check   | `bun run type:check` (alias of `typecheck`, both `tsc --noEmit`) | either name works — pick one and stick with it                                                          |
| format       | `bun run format` (`prettier --write .`)                          | write fixes                                                                                             |
| format:check | `bun run format:check` (`prettier --check .`)                    | CI uses this, not `format`                                                                              |
| test         | `bun run test` (`bun test --dom --isolate`)                      | **Bun native `bun:test`**, NOT vitest/jest. DOM env via `--dom` flag, hermetic per file via `--isolate` |
| test:watch   | `bun run test:watch` (`bun test --dom --watch`)                  | local TDD                                                                                               |

Test runner: `bun test` (Bun's built-in test runner). Do not introduce vitest, jest, or `@swc/jest`.

## Structure

```
app/                    Next.js App Router (layout.tsx, page.tsx, globals.css)
components/             Custom components (header/, game-credits, theme-provider)
  ui/                   shadcn/ui primitives — add via `bunx --bun shadcn@latest add <name>`, do not hand-edit
views/                  Page sections: about, skills, projects, contact
lib/                    Utilities + integrations (utils.ts with `cn()`, github.ts, smooth-scroll, etc.)
  games/pong/           Embedded Pong game
hooks/                  use-mobile, use-scroll-spy, use-toast
constants/              Static content (content, colors, github, links, navigation)
types/                  Shared TypeScript types (github, typography)
tests/                  Bun test setup + colocated *.test.tsx files
public/                 Static assets
```

Home page composition (`app/page.tsx`): `PongHeader` → `AboutSection` → `SkillsSection` → `ProjectsSection` → `ContactSection`.

Test preload order (see `bunfig.toml`): `tests/dom-globals.ts` (registers `document`/`navigator` globally) → `tests/setup.ts` (RTL `cleanup`, `IS_REACT_ACT_ENVIRONMENT`, `requestAnimationFrame` shim, `mock.restore()`). New test files in `tests/` or as `*.test.{ts,tsx}` are picked up automatically — no config changes needed.

## Conventions & Gotchas

- **Bun-only**. `packageManager: bun@1.3.14` is enforced. No `npm` / `yarn` / `pnpm` / `npx` — use `bun` / `bunx --bun <pkg>`. Mismatched toolchains break lockfile resolution.
- **Mise pins are load-bearing**. `mise.toml` pins node 24.18.0 + bun 1.3.14 and CI uses `jdx/mise-action`. If your local node/bun versions differ, `bun install` will silently re-resolve and your `bun.lock` drifts from CI. Run `mise use` or set up shell activation.
- **Husky + lint-staged are active**. Pre-commit runs `prettier --write` then `eslint --fix --max-warnings=0` on staged files via `bun lint-staged`. Never bypass with `--no-verify` — fix the issue or update the lint-staged config with explicit user approval. The hook script is `.husky/pre-commit`.
- **`next.config.mjs`**: Next 16 removed the `eslint` config key (it now warns). Lint/typecheck run as standalone CI gates, not during `next build`. `images.unoptimized: true` is set. Always run `bun run lint` and `bun run type:check` locally before considering work done — never trust a green build alone.
- **No code comments** unless explicitly requested. Existing `// ...` comments are v0.dev leftovers — leave or remove at author discretion, do not add new ones.
- **Prettier config** (implicit via defaults + plugin): no semis, single quotes, trailing comma `es5`, 100-col. `prettier-plugin-tailwindcss` reorders class names — don't hand-order them.
- **ESLint relaxations**: `_`-prefixed unused vars/args are allowed; `any` and unused vars are relaxed in `*.test.{ts,tsx}` and `tests/**`. Don't lint-clean test files by hand — adjust the test or the rule with explicit approval.
- **Client components** need `'use client'` at the very top of the file. Anything with hooks, state, refs, or browser APIs (e.g. `views/about-section.tsx`, all of `components/header/`, `lib/games/pong/`) must declare it. Server components are the default — only opt into client when needed.
- **Imports**: use the `@/...` path alias, never relative paths beyond the same directory. Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for any conditional class composition — never string-template Tailwind classes.
- **shadcn/ui**: components in `components/ui/` are owned by the shadcn CLI. Add new ones with `bunx --bun shadcn@latest add <name>`. Do not edit their internals — modify via the CLI or accept upstream changes. The `components.json` config is the source of truth.
- **External data / fallbacks**: `lib/github.ts` fetches with `revalidate: 3600` and falls back to constants from `constants/github.ts` on failure. Never hardcode fallback data inside components — extend the constants.
- **Tailwind dark mode** is via `next-themes` (see `components/theme-provider.tsx`). Color tokens live in `app/globals.css` (CSS-first `@theme` block, v4) and `constants/colors.ts`. There is **no `tailwind.config.js`** in v4 — theme/animation are declared in `globals.css`. Don't sprinkle raw hex values.
- **Env**: `.env.local` is gitignored. Pull from Vercel: `vercel link && vercel env pull .env.local`. Push back: `vercel env push .env.local`. Never commit tokens. CI doesn't need them.
- **Lockfile**: `bun.lock` is committed. Always `bun install --frozen-lockfile` in CI-shaped runs so the lockfile isn't silently rewritten. If you add a dep, run `bun install` (no flag) once locally, commit `bun.lock` + `package.json`, then return to `--frozen-lockfile`.
- **v0.dev auto-sync**: this repo is regenerated from v0 chats on Vercel. Hand-edits to v0-generated sections can be overwritten on the next sync. Prefer editing in v0.dev for generated content; edit locally only for code that's clearly outside v0's scope (tests, hooks, config, custom logic).
- **Before considering work done**: `bun run format:check && bun run lint && bun run type:check && bun run test`. CI runs the same gates in order. Don't commit unless explicitly asked — and never `--amend` or force-push.
