import { describe, expect, it, mock } from 'bun:test'

import { FALLBACK_PINNED_REPOS, FALLBACK_POPULAR_REPOS } from '@/constants/github'

mock.module('@/lib/github', () => ({
  fetchPinnedRepos: mock(async () => {
    throw new Error('GitHub runtime unavailable')
  }),
}))

describe('projects API route fallback', () => {
  it('returns fallback projects with a short retry cache after a top-level failure', async () => {
    const { GET } = await import('@/lib/projects-response')
    const response = await GET()

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    )
    expect(await response.json()).toEqual([...FALLBACK_PINNED_REPOS, ...FALLBACK_POPULAR_REPOS])
  })
})
