import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { GET } from '@/app/api/projects/route'

describe('projects API route', () => {
  beforeEach(() => {
    spyOn(console, 'error').mockImplementation(() => undefined)
    spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  it('returns cacheable project data when GitHub is unavailable', async () => {
    globalThis.fetch = mock(async () => {
      throw new Error('GitHub unavailable')
    }) as unknown as typeof fetch

    const response = await GET()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
    )
    expect((await response.json()) as unknown[]).not.toHaveLength(0)
  })
})
