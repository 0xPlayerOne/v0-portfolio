import { afterEach, describe, expect, it, mock } from 'bun:test'
import { fetchPinnedRepos } from './github'

const makeResponse = (body: unknown, status = 200, ok = true) =>
  ({
    status,
    ok,
    json: async () => body,
  }) as Response

const repoJson = (name: string, desc: string, url: string) => ({
  name,
  description: desc,
  topics: ['react', 'web3'],
  html_url: url,
  homepage: undefined,
  stargazers_count: 50,
  forks_count: 10,
})

describe('fetchPinnedRepos', () => {
  afterEach(() => mock.restore())

  it('fetches pinned + popular repos and attaches languages', async () => {
    globalThis.fetch = mock(async (url: string) => {
      const u = String(url)
      if (u.includes('/languages')) return makeResponse({ TypeScript: 800, JavaScript: 200 })
      if (u.includes('users/0xPlayerOne/repos')) {
        return makeResponse([
          repoJson('other-repo', 'An open project', 'https://github.com/0xPlayerOne/other-repo'),
        ])
      }
      // specific repo fetches (pinned configs)
      return makeResponse(
        repoJson('nifty-fe', 'The monorepo', 'https://github.com/NiftyLeague/nifty-fe-monorepo')
      )
    }) as any

    const repos = await fetchPinnedRepos()
    expect(repos.length).toBeGreaterThan(0)
    expect(repos.some((r) => r.languages.some((l) => l.name === 'TypeScript'))).toBe(true)
  })

  it('falls back to FALLBACK_PINNED_REPOS when the API request throws', async () => {
    globalThis.fetch = mock(async () => {
      throw new Error('network down')
    }) as any
    const repos = await fetchPinnedRepos()
    // A thrown error is caught and the curated fallback list is returned
    expect(repos.length).toBeGreaterThan(0)
    expect(repos.every((r) => Array.isArray(r.languages))).toBe(true)
  })
})
