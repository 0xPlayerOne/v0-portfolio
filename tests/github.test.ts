import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { fetchPinnedRepos } from '@/lib/github'
import { FALLBACK_PINNED_REPOS } from '@/constants/github'

function githubRepo(name: string, overrides: Record<string, unknown> = {}) {
  return {
    name,
    description: `${name} description`,
    topics: ['typescript', 'web3', 'gaming', 'testing', 'extra'],
    html_url: `https://github.com/example/${name}`,
    homepage: null,
    stargazers_count: 4,
    forks_count: 2,
    ...overrides,
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('GitHub project loading', () => {
  beforeEach(() => {
    spyOn(console, 'error').mockImplementation(() => undefined)
    spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  it('combines pinned and popular repositories and calculates languages', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.endsWith('/repos/NiftyLeague/nifty-fe-monorepo')) {
        return jsonResponse(
          githubRepo('nifty-fe-monorepo', {
            html_url: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
          })
        )
      }
      if (url.endsWith('/repos/NiftyLeague/nifty-smart-contracts')) {
        return jsonResponse(
          githubRepo('nifty-smart-contracts', {
            html_url: 'https://github.com/NiftyLeague/nifty-smart-contracts',
            homepage: 'https://niftyleague.com',
          })
        )
      }
      if (url.includes('/users/0xPlayerOne/repos')) {
        return jsonResponse([
          githubRepo('popular-tool', { stargazers_count: 10 }),
          githubRepo('fork-example'),
          githubRepo('undocumented', { description: null }),
        ])
      }
      if (url.endsWith('/languages')) {
        return jsonResponse({ TypeScript: 900, CSS: 100 })
      }

      return jsonResponse({}, 404)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    expect(projects).toHaveLength(3)
    expect(projects[0]).toMatchObject({
      title: 'Nifty League Frontend',
      isPinned: true,
      languages: [
        { name: 'TypeScript', percentage: 90 },
        { name: 'CSS', percentage: 10 },
      ],
    })
    expect(projects[2]).toMatchObject({
      title: 'Popular Tool',
      isPinned: false,
    })
    expect(fetchMock).toHaveBeenCalledTimes(6)
  })

  it('uses fallback projects when the popular-repository request fails', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.includes('/users/0xPlayerOne/repos')) {
        throw new Error('offline')
      }
      if (url.endsWith('/languages')) {
        return jsonResponse({}, 500)
      }
      return jsonResponse({}, 403)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    expect(projects.length).toBeGreaterThan(0)
    expect(projects[0].languages.length).toBeGreaterThan(0)
    expect(console.warn).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  it('uses curated pinned fallbacks when pinned repository requests fail', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.endsWith('/languages')) return jsonResponse({}, 500)
      if (url.includes('/users/0xPlayerOne/repos')) return jsonResponse([])
      if (url.includes('/repos/NiftyLeague/')) return jsonResponse({}, 503)
      return jsonResponse({}, 404)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    expect(projects).toHaveLength(FALLBACK_PINNED_REPOS.length)
    expect(projects.every((project) => project.isPinned)).toBe(true)
    expect(projects.map((project) => project.url)).toEqual(
      FALLBACK_PINNED_REPOS.map((project) => project.url)
    )
    expect(projects.every((project) => project.languages.length > 0)).toBe(true)
  })

  it('drops unsafe homepage URLs from GitHub metadata', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.endsWith('/repos/NiftyLeague/nifty-fe-monorepo')) {
        return jsonResponse(
          githubRepo('unsafe-homepage', {
            homepage: 'javascript:alert(document.domain)',
            html_url: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
          })
        )
      }
      if (url.endsWith('/repos/NiftyLeague/nifty-smart-contracts')) {
        return jsonResponse(
          githubRepo('nifty-smart-contracts', {
            html_url: 'https://github.com/NiftyLeague/nifty-smart-contracts',
          })
        )
      }
      if (url.endsWith('/languages')) return jsonResponse({ TypeScript: 100 })
      return jsonResponse({}, 403)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    expect(projects).toHaveLength(2)
    expect(projects[0].homepage).toBeUndefined()
  })

  it('returns empty popular repos when the GitHub API rate-limits (403)', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.includes('/users/0xPlayerOne/repos')) {
        return jsonResponse([], 403)
      }
      if (url.endsWith('/repos/NiftyLeague/nifty-fe-monorepo')) {
        return jsonResponse(
          githubRepo('nifty-fe-monorepo', {
            html_url: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
          }),
          200
        )
      }
      if (url.endsWith('/repos/NiftyLeague/nifty-smart-contracts')) {
        return jsonResponse(
          githubRepo('nifty-smart-contracts', {
            html_url: 'https://github.com/NiftyLeague/nifty-smart-contracts',
          }),
          200
        )
      }
      return jsonResponse({}, 403)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    // Popular repos return [] on 403, so only the live pinned repos are included.
    expect(projects.length).toBe(2)
    expect(projects.every((p) => p.isPinned)).toBe(true)
  })

  it('falls back on non-OK non-403 popular-repos responses', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.includes('/users/0xPlayerOne/repos')) {
        return jsonResponse({ message: 'Server error' }, 500)
      }
      if (url.endsWith('/languages')) {
        return jsonResponse({ TypeScript: 100 }, 200)
      }
      return jsonResponse(
        githubRepo('nifty-fe-monorepo', {
          html_url: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
        }),
        200
      )
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    // Throwing on non-OK non-403 triggers the catch -> fallback popular repos
    expect(projects.length).toBeGreaterThan(0)
    expect(projects.some((p) => p.title === 'NowInStock Bot')).toBe(true)
    expect(console.error).toHaveBeenCalled()
  })

  it('sorts popular repos by combined star and fork score descending', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.includes('/users/0xPlayerOne/repos')) {
        return jsonResponse(
          [
            githubRepo('alpha-tool', {
              description: 'Alpha project',
              stargazers_count: 10,
              forks_count: 5,
            }),
            githubRepo('beta-tool', {
              description: 'Beta project',
              stargazers_count: 20,
              forks_count: 3,
            }),
            githubRepo('gamma-tool', {
              description: 'Gamma project',
              stargazers_count: 5,
              forks_count: 1,
            }),
          ],
          200
        )
      }
      if (url.endsWith('/repos/NiftyLeague/nifty-fe-monorepo')) {
        return jsonResponse(
          githubRepo('nifty-fe-monorepo', {
            html_url: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
          })
        )
      }
      if (url.endsWith('/repos/NiftyLeague/nifty-smart-contracts')) {
        return jsonResponse(
          githubRepo('nifty-smart-contracts', {
            html_url: 'https://github.com/NiftyLeague/nifty-smart-contracts',
          })
        )
      }
      if (url.endsWith('/languages')) {
        return jsonResponse({ TypeScript: 100 }, 200)
      }
      return jsonResponse({}, 403)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    // All three pass the filter (no "fork" in name, all have descriptions).
    // The live pinned projects stay first; popular repos sort by score:
    // beta(23) > alpha(15) > gamma(6).
    expect(projects).toHaveLength(5)
    expect(projects.slice(2).map((project) => project.title)).toEqual([
      'Beta Tool',
      'Alpha Tool',
      'Gamma Tool',
    ])
  })

  it('returns empty languages when rate-limited (403) and uses fallback when available', async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)

      if (url.includes('/users/0xPlayerOne/repos')) {
        return jsonResponse(
          [
            githubRepo('unknown-project', {
              description: 'A project without fallback',
              html_url: 'https://github.com/SomeOrg/unknown-project',
            }),
          ],
          200
        )
      }
      if (url.endsWith('/languages')) {
        return jsonResponse({}, 403)
      }
      return jsonResponse({}, 403)
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    // The popular repo has no fallback, so its languages stay empty after 403.
    expect(projects).toHaveLength(FALLBACK_PINNED_REPOS.length + 1)
    const unknownProject = projects.find((project) => project.title === 'Unknown Project')
    expect(unknownProject?.languages).toHaveLength(0)
    expect(projects.filter((project) => project.isPinned)).toHaveLength(
      FALLBACK_PINNED_REPOS.length
    )
    expect(console.warn).toHaveBeenCalled()
  })

  it('returns the curated fallback list when every API request throws', async () => {
    const fetchMock = mock(async () => {
      throw new Error('network down')
    })
    globalThis.fetch = fetchMock as any

    const projects = await fetchPinnedRepos()

    // A thrown error is caught and the curated fallback list is returned
    expect(projects.length).toBeGreaterThan(0)
    expect(projects.every((p) => Array.isArray(p.languages))).toBe(true)
    expect(console.error).toHaveBeenCalled()
  })

  it('initiates pinned and popular repo fetches concurrently', async () => {
    const requested: string[] = []
    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))

    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input)
      requested.push(url)
      if (url.includes('/languages')) return jsonResponse({})
      // Hold every request behind a gate so the test can observe which
      // requests were initiated before any of them resolved.
      await gate
      if (url.includes('/users/0xPlayerOne/repos')) {
        return jsonResponse([githubRepo('other-repo', { description: 'An open project' })])
      }
      return jsonResponse(
        githubRepo('nifty-fe-monorepo', {
          html_url: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
        })
      )
    })
    globalThis.fetch = fetchMock as any

    const pending = fetchPinnedRepos()
    // Let the initial fetches start; nothing has resolved yet.
    await Promise.resolve()

    expect(requested.filter((u) => u.includes('/repos/NiftyLeague/'))).toHaveLength(2)
    expect(requested.some((u) => u.includes('/users/0xPlayerOne/repos'))).toBe(true)

    release()
    const projects = await pending
    expect(projects.length).toBeGreaterThan(0)
  })
})
