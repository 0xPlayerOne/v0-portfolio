export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

export interface PinnedRepo {
  title: string
  description: string
  tech: string[]
  url: string
  homepage?: string
  stars: number
  forks: number
  languages: { name: string; percentage: number }[]
  isPinned: boolean
}

export interface PinnedRepoConfig {
  owner: string
  repo: string
  displayName?: string // Optional custom display name
}
