import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { fetchPinnedRepos } from '@/lib/github'

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
})
