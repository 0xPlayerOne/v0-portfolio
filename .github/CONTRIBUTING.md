# Contributing to V0 Portfolio

Welcome! This document is the **single source of truth** for the contribution workflow for the V0 Portfolio repository.  
All agents (Hermes and other automation) must read and follow this document before working on this repo.

It applies to TypeScript, Rust, Python, and mixed-language projects using this template.

Quick links: [Code of Conduct](./CODE_OF_CONDUCT.md) · [Security Policy](./SECURITY.md) · [Pull Request Template](./PULL_REQUEST_TEMPLATE.md)

### Contents

[Agent contract](#agent-operating-contract) · [Branches](#branching-model) · [Setup](#before-you-start) · [Validation](#local-validation) · [Internal](#internal-contribution-workflow) · [External](#external-contribution-workflow) · [Pull requests](#pull-request-standards) · [Reviews](#review-and-merge-protocol) · [Security](#security-and-emergencies)

## Agent operating contract

Agents must follow these rules before changing code:

This is a standalone **Next.js 16** app managed with **Bun** (v1.3.14) and **Node.js** (v24.18.0) via `mise`.

Agents must not:

| Script            | What it does                            |
| ----------------- | --------------------------------------- |
| `bun run dev`     | Start Next.js dev server (Turbopack)    |
| `bun run build`   | Production build (`next build`)         |
| `bun run start`   | Serve production build (`next start`)   |
| `bun run lint`    | ESLint (zero warnings enforced)         |
| `bun run type:check` | TypeScript type checking (`tsc --noEmit`) |
| `bun run format`  | Auto-format with Prettier               |
| `bun run format:check` | Check formatting with Prettier    |
| `bun run test`    | Run all tests (`bun test --dom --isolate`) |

## Branching model

```text
                                      release PR
                                   ┌──────────────┐
                                   │              ▼
feat/*  fix/*  chore/*  ──PR──▶  staging  ──PR──▶  main
docs/*  test/*  refactor/*         │              │
                                   │              └── protected release branch
                                   └── integration branch
```

| Branch                                                         | Purpose                  | Contribution rule                                                         |
| -------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `main`                                                         | Protected release branch | Merge through the `staging` → `main` release PR. No direct pushes.        |
| `staging`                                                      | Integration branch       | Target normal pull requests here. Required checks must pass before merge. |
| `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `docs/*`, `test/*` | Focused work             | Branch from `staging`; keep changes small and reviewable.                 |

The default Git workflow is `staging-release`: topic branches merge into `staging`, then a promotion PR moves validated changes into `main`, followed by the versioned release PR. The default merge strategy is `rebase`, which preserves the linear Conventional Commit history. Configure `merge_strategy` as `squash` or `merge` in `.github/code-foundry.yml` when the repository intentionally uses another policy. Re-align `staging` with `main` after a release when needed.

## Before you start

### Toolchain

1. Run `npx code-foundry init` to detect the repository and enable hooks.
2. Follow `toolchain: auto` in `.github/code-foundry.yml`; install mise only if the repository already uses it or explicitly selects it.
3. Use `npx code-foundry doctor` when setup, lockfiles, or hooks appear out of sync.
4. Use the repository's existing package manager and lockfile. Do not introduce a second package manager.
5. Copy `.env.example` to the appropriate local environment file when provided. Never commit the copy.

### Worktree and branch

---

## 3. Development Setup

### Prerequisites

- `mise` (toolchain version manager) — installs bun and node at pinned versions
- `git` (obviously)

### One-time setup

```bash
# Clone
git clone git@github.com:0xPlayerOne/v0-portfolio.git
cd v0-portfolio

# Install toolchain (reads mise.toml → installs bun 1.3.14 + node 24.18.0)
mise install

# Install dependencies
bun install --frozen-lockfile

# Run everything in dev mode
bun run dev
```

If the worktree is dirty, stop and understand the existing changes before switching branches or editing overlapping files.

```bash
bun run lint           # ESLint (zero warnings)
bun run type:check     # TypeScript type checking (tsc --noEmit)
bun run test           # Run all tests (bun test --dom --isolate)
bun run format:check   # Check formatting (Prettier)
```

> **Note:** Husky + lint-staged are active. Pre-commit hooks run `prettier --write` then `eslint --fix --max-warnings=0` on staged files.  
> Never use `--no-verify` to skip hooks — if a hook fails, fix the issue.

## Internal contribution workflow

For maintainers, trusted contributors, and automation agents:

1. Start from an up-to-date `staging` branch.
2. Create a focused branch with a descriptive prefix.
3. Inspect the relevant code and tests before making changes.
4. Implement the smallest complete change.
5. Add or update tests, documentation, configuration, and migration notes as needed.
6. Run local validation and inspect the final diff.
7. Commit with a clear message, preferably using Conventional Commits:

   ```text
   feat(auth): add passkey recovery
   fix(api): handle expired session tokens
   chore(ci): cache Rust dependencies
   ```

8. Push the branch and open a pull request into `staging`.
9. Address review feedback and failed checks on the same branch.
10. Merge using the repository's configured `merge_strategy` after required checks pass and the change is ready.

### Internal agent handoff

Every agent handoff should state:

```text
Summary: what changed and why
Files: important files changed
Validation: exact commands and pass/fail results
Skipped: checks skipped and why
Risks: known limitations or follow-up work
Branch/PR: branch name and pull request link
```

## External contribution workflow

For contributors who do not have direct write access:

1. Fork the repository on GitHub.
2. Add the upstream repository as `upstream`.
3. Branch from the upstream `staging` branch.
4. Make a focused change and follow the local setup instructions.
5. Add tests and documentation for behavior changes.
6. Run all applicable checks locally.
7. Push to the fork and open a pull request targeting `staging`.
8. Explain the problem, proposed solution, validation, compatibility, and rollout impact.
9. Address maintainer feedback without rewriting unrelated history or scope.

External contributors should never need repository secrets or production access to validate a normal change.

## Pull request standards

Every pull request should make these questions easy to answer:

- What changed?
- Why was it needed?
- How was it tested?
- What could break?
- Does it require migration, deployment, configuration, or rollback work?
- Which files or areas deserve focused review?

Keep pull requests focused and reviewable. Include screenshots or recordings for user-facing changes. Link related issues and use `Closes #123` when appropriate. Complete the [pull request template](./PULL_REQUEST_TEMPLATE.md).

## Workflow and check behavior

| Event                            | Expected automation                      |
| -------------------------------- | ---------------------------------------- |
| Push to `main` or `staging`      | CI, Test, Security, and CodeQL workflows |
| Pull request targeting `staging` | CI, Test, Security, and CodeQL workflows |
| Push to a working branch         | Draft PR workflow                        |
| Push to `staging`                | Release PR workflow                      |
| Version tag such as `v1.2.3`     | Release workflow                         |

The workflows use separate concurrency groups keyed by the commit under test. A newer run for the same commit cancels a duplicate event-triggered run, while newer commits cancel older runs and independent CI, Test, Security, and CodeQL workflows continue in parallel.

Required checks are enforced by branch protection. Do not duplicate their checklists in the pull request description; document validation commands and results instead.

### Release conventions

Use Conventional Commits so the release automation can determine the next version: `fix:` produces a patch release, `feat:` produces a minor release, and `!` or `BREAKING CHANGE:` produces a major release. Add `Release-As: x.y.z` only when a deliberate version override is needed. The release workflow maintains the changelog and GitHub release after changes land on `main`; npm publication is opt-in through `.github/code-foundry.yml`.

Security checks can be skipped when repository visibility or the GitHub plan does not support a feature. A skipped optional check must not be configured as a required status check.

## Review and merge protocol

| Change            | Target    | Merge gate                                                |
| ----------------- | --------- | --------------------------------------------------------- |
| Working branch    | `staging` | All applicable required checks pass                       |
| `staging` release | `main`    | Current staging checks, release review, and rollout notes |

Reviewers focus on correctness, security, maintainability, test coverage, operational impact, and compatibility. Authors remain responsible for responding to feedback and verifying the final commit.

## Security and emergencies

Report vulnerabilities privately using [SECURITY.md](./SECURITY.md), never in a public issue or pull request.

For an urgent production or security issue:

1. Create a focused branch from `staging`.
2. Document the urgency and affected systems without exposing secrets.
3. Open a pull request and run the narrowest complete validation available.
4. Request the appropriate maintainer review.
5. Record follow-up work, remediation, and rollback information.

- **Target:** `staging` (not main).
- **Title:** Conventional commit style.
- **Description:** What does this change? Why? Any screenshots?
- **Link to related issue** if applicable.
- CI runs automatically. Waiting for it to pass is appreciated.

### 5.5 After merge

- Your commits will be squash-merged into `staging`.
- You can delete your feature branch after merge.

---

## 6. CI & Testing Discipline

### What runs when

| Event                                              | CI trigger                                | Reason                                                          |
| -------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| Push to `main` or `staging`                        | `push` trigger → **full CI runs**         | Covers direct pushes to staging, and staging→main merge commits |
| PR opened/synchronized targeting `staging`         | `pull_request` trigger → **full CI runs** | Covers sub-branch→staging PRs                                   |
| Push to a feature branch (`feat/*`, `fix/*`, etc.) | **No CI**                                 | CI only runs when a PR is opened into staging                   |
| Direct push to `main`                              | **Blocked by branch protection**          | Only possible via staging→main merge                            |

### Why no duplicates

CI runs on `push` events (to main/staging) and `pull_request` events (targeting main/staging). These fire on **different refs**:

- `push` trigger fires on commits pushed directly to `main` or `staging` branches
- `pull_request` trigger fires on the **head commit** of a PR (which lives on a feature branch, not main/staging)

Since a commit can never be simultaneously pushed to `main`/`staging` AND be a PR's head commit from a different branch, **no commit ever triggers CI twice**.

| Scenario                            | Push trigger?                | PR trigger?      | Double? |
| ----------------------------------- | ---------------------------- | ---------------- | ------- |
| Push to sub-branch `feat/foo`       | No (wrong branch)            | No (no PR event) | ✅ No   |
| Open PR `feat/foo` → `staging`      | No (commit is on sub-branch) | Yes              | ✅ No   |
| Push to `staging` directly          | Yes                          | No               | ✅ No   |
| Merge staging→main (push to `main`) | Yes                          | No               | ✅ No   |

### CI jobs

| Job                                | What it checks                              |
| ---------------------------------- | ------------------------------------------- |
| `Build, Format, Lint & Type Check` | Compilation, formatting, ESLint, TypeScript |
| `Test`                             | `bun run test` — all unit + integration tests |
| `Vercel Preview Comments`          | Preview deployment verification             |

### If CI fails

- **On your feature branch:** Push a fix, CI re-runs automatically.
- **On staging after merge:** Fix directly on staging (push a fix commit) or revert the failing change.
- **Before staging→main:** CI must be **all green** on the staging branch's latest commit.

---

## 7. Pull Request Guidelines

Every PR must use the [pull request template](./PULL_REQUEST_TEMPLATE.md) — do not delete sections.

The template covers:

- **Description** — what changed and why
- **CI Status** — checkbox for each required check
- **Compliance Checklist** — locking, format, dep hygiene, no generated artifacts
- **Additional Context** — breaking changes, migration steps, related PRs

Since feature branches are already prefixed (`feat/`, `fix/`, `chore/`, etc.) and all PRs target `staging`, the template intentionally omits type-picker and target-branch fields — they are inferred from the branch and CI context.

### Staging→main (release) PRs

Release PRs follow the same template but add a release summary describing the batch.

- Prefer small, focused PRs (under 400 lines changed when possible).
- Large features should be broken into multiple PRs targeting staging.
- If a PR exceeds 1000 lines, consider splitting it.

---

## 8. Code Review Standards

### Internal PRs (sub-branch → staging)

- **No review required.** Self-merge is fine.
- Peer reviews are encouraged but not mandatory.
- If you want feedback, request a review explicitly.

### Staging → Main PRs

- **Only admins can merge into `main`.** The daily review agent picks up PRs once they are approved by an admin on GitHub (via review approval).
- Focused on: does CI pass? Are there breaking changes? Is the release summary complete?
- This is a release gate, not a code-level review (code review happened on sub-branch→staging).

### External PRs (fork → staging)

- **Review is required** from at least one maintainer.
- Focus on: correctness, security, style alignment, test coverage.
- External contributors should expect feedback and iteration.

---

## 9. Merge Protocol

| From                     | To        | Method       | Reviewer                          | Notes                                    |
| ------------------------ | --------- | ------------ | --------------------------------- | ---------------------------------------- |
| Sub-branch               | `staging` | Squash merge | Optional (self-merge OK)          | Delete branch after merge; auto-draft PR |
| Direct push to `staging` | `staging` | Push         | N/A                               | For small fixes or urgent bugs           |
| `staging`                | `main`    | Squash merge | Admin (0xPlayerOne) | Only when all CI passes on staging       |

### Squash merge convention

All merges use **squash merge** — every PR becomes a single commit on the target branch. This keeps history clean and linear.

When squashing, the commit message should be:

```
<type>(<scope>): <summary>

<optional body with details>
```

---

## 10. Workflow Discipline

Branch protections are a safety net, not a workflow definition. The workflow defined in sections 2–9 is authoritative regardless of whether GitHub's API enforces every rule. Always follow the documented process — do not bypass quality gates even when technically possible.

---

## 11. Emergency Procedures

### Urgent hotfix (security / production outage)

1. Create a branch off `staging`: `git checkout staging && git checkout -b hotfix/urgent-fix`
2. Fix the issue, push, open a PR into `staging`.
3. Self-merge once CI passes.
4. Open a staging→main PR and flag as urgent.
5. If staging→main merge is blocked by CI issues unrelated to your change, contact 0xPlayerOne.

### Rollback

If a staging→main merge introduces a production issue:

1. Revert the merge commit on staging: `git revert -m 1 <merge-sha>`
2. Push directly to staging: `git push origin staging`
3. Open a new staging→main PR.
4. Fix the root cause on a sub-branch and re-merge.

### Skip-CI (rare emergencies only)

In genuine emergencies where CI is blocked by infrastructure (not code), you may push with `[skip-ci]` in the commit message.  
This must be followed by a CI-fixing follow-up commit within 24 hours. Abuse of skip-ci will result in access revocation.

---

_Last updated: 2026-07-25_  
_Maintainers: V0 Portfolio engineering team_
