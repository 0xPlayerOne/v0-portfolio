import { describe, expect, it, mock } from 'bun:test'
import { createProjectsHandler } from '../worker/projects-cache'

function fixture() {
  const entries = new Map<string, Response>()
  const cache = {
    async match(request: RequestInfo | URL) { return entries.get(String(request instanceof Request ? request.url : request))?.clone() },
    async put(request: RequestInfo | URL, response: Response) { entries.set(String(request instanceof Request ? request.url : request), response.clone()) },
  }
  const background: Promise<unknown>[] = []
  const context = { waitUntil(promise: Promise<unknown>) { background.push(promise) } }
  const response = () => Response.json([{ title: 'Fixture' }], {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
  })
  const load = mock(async () => response())
  let clock = 1_800_000_000_000
  const handle = createProjectsHandler(load, () => clock)
  const request = new Request('https://andrewmf.com/api/projects?cache-buster=1')
  return { cache, context, background, load, handle, request, advance(seconds: number) { clock += seconds * 1000 } }
}

describe('Cloudflare project cache', () => {
  it('caches a cold request, strips internal headers, and ignores query parameters', async () => {
    const f = fixture()
    const first = await f.handle(f.request, f.cache, f.context)
    expect(first.headers.get('X-Projects-Cache')).toBe('MISS')
    expect(first.headers.get('X-Portfolio-Stored-At')).toBeNull()
    f.advance(10)
    const second = await f.handle(new Request('https://andrewmf.com/api/projects?different=2'), f.cache, f.context)
    expect(second.headers.get('X-Projects-Cache')).toBe('HIT')
    expect(second.headers.get('Age')).toBe('10')
    expect(await first.json()).toEqual(await second.json())
    expect(f.load).toHaveBeenCalledTimes(1)
  })

  it('serves stale content and revalidates without blocking the response', async () => {
    const f = fixture()
    await f.handle(f.request, f.cache, f.context)
    f.advance(3601)
    const stale = await f.handle(f.request, f.cache, f.context)
    expect(stale.headers.get('X-Projects-Cache')).toBe('STALE')
    expect(await stale.json()).toEqual([{ title: 'Fixture' }])
    await Promise.all(f.background)
    expect(f.load).toHaveBeenCalledTimes(2)
    const fresh = await f.handle(f.request, f.cache, f.context)
    expect(fresh.headers.get('X-Projects-Cache')).toBe('HIT')
  })

  it('coalesces concurrent cold requests within an isolate', async () => {
    const f = fixture()
    const results = await Promise.all(Array.from({ length: 5 }, () => f.handle(f.request, f.cache, f.context)))
    expect(f.load).toHaveBeenCalledTimes(1)
    expect(await Promise.all(results.map((response) => response.json()))).toHaveLength(5)
  })

  it('does not serve an entry beyond the stale window', async () => {
    const f = fixture()
    await f.handle(f.request, f.cache, f.context)
    f.advance(3600 + 86400 + 1)
    expect((await f.handle(f.request, f.cache, f.context)).headers.get('X-Projects-Cache')).toBe('MISS')
    expect(f.load).toHaveBeenCalledTimes(2)
  })

  it('retains last good content when background refresh fails', async () => {
    const f = fixture()
    await f.handle(f.request, f.cache, f.context)
    f.advance(3601)
    f.load.mockRejectedValueOnce(new Error('upstream unavailable'))
    const stale = await f.handle(f.request, f.cache, f.context)
    await Promise.all(f.background)
    expect(await stale.json()).toEqual([{ title: 'Fixture' }])
    expect((await f.handle(f.request, f.cache, f.context)).headers.get('X-Projects-Cache')).toBe('STALE')
    await Promise.all(f.background)
  })
})
