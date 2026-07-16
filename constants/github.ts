<<<<<<< HEAD
import { PinnedRepo, PinnedRepoConfig } from '@/types/github'

export const MAX_LANGUAGES = 5
export const MAX_PROJECTS = 6
=======
import { PinnedRepo, PinnedRepoConfig } from "@/types/github";
>>>>>>> origin/staging

export const LANGUAGES_DISPLAYED = 3
export const PROJECTS_DISPLAYED = MAX_PROJECTS

export const PINNED_REPO_CONFIGS: PinnedRepoConfig[] = [
  {
    owner: "NiftyLeague",
    repo: "nifty-fe-monorepo",
    displayName: "Nifty League Frontend",
  },
  {
    owner: "NiftyLeague",
    repo: "nifty-smart-contracts",
    displayName: "Nifty League Contracts",
  },
]

export const FALLBACK_PINNED_REPOS: PinnedRepo[] = [
  {
    title: "Nifty League Frontend",
    description: "Monorepo for Nifty League frontend applications.",
    tech: ["next.js", "web3", "gaming", "monorepo"],
    url: "https://github.com/NiftyLeague/nifty-fe-monorepo",
    stars: 1,
    forks: 0,
    languages: [
      { name: "TypeScript", percentage: 95 },
      { name: "CSS", percentage: 3 },
      { name: "JavaScript", percentage: 1 },
    ],
    isPinned: true,
  },
  {
    title: "Nifty League Contracts",
    description: "Smart Contract repository for Nifty League.",
    tech: ["smart-contracts", "nft", "gaming", "solidity"],
    url: "https://github.com/NiftyLeague/nifty-smart-contracts",
    stars: 2,
    forks: 0,
    languages: [
      { name: "TypeScript", percentage: 88 },
      { name: "Solidity", percentage: 12 },
    ],
    isPinned: true,
  },
]

export const FALLBACK_POPULAR_REPOS: PinnedRepo[] = [
  {
    title: "NowInStock Bot",
    description: "Bot to alert you when watched items are available in stock.",
    tech: ["scripting", "python"],
    url: "https://github.com/0xPlayerOne/NowInStock-bot",
    stars: 14,
    forks: 2,
    languages: [
      { name: "HTML", percentage: 80 },
      { name: "Python", percentage: 20 },
    ],
    isPinned: false,
  },
  {
    title: "Binance Us Cryptobot",
    description: "Terminal bot for auto trading on binance.us exchange.",
    tech: ["blockchain", "ethereum", "web3", "utilities"],
    url: "https://github.com/0xPlayerOne/binance-us-cryptobot",
    stars: 13,
    forks: 1,
    languages: [
      { name: "JavaScript", percentage: 98 },
      { name: "Dockerfile", percentage: 2 },
    ],
    isPinned: false,
  },
]
