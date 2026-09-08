interface BackgroundContext {
  waitUntil(promise: Promise<unknown>): void
}
type ProjectLoader = () => Promise<Response>
type ProjectCache = Pick<Cache, 'match' | 'put'>

const STORED_AT = 'X-Portfolio-Stored-At'
const FRESH_FOR = 'X-Portfolio-Fresh-For'
const STALE_FOR = 'X-Portfolio-Stale-For'

// Scope single-flight to one Worker isolate. Cache API storage is per data center,
// not a globally consistent database; the public feed does not need one.
export function createProjectsHandler(load: ProjectLoader, now = Date.now) {
  const inFlight = new Map<string, Promise<Response>>()

  function refresh(key: Request, cache: ProjectCache): Promise<Response> {
    const pending = inFlight.get(key.url)
    if (pending) return pending.then((response) => response.clone())

    const task = (async () => {
      const response = await load()
      if (!response.ok) throw new Error(`Project loader returned ${response.status}`)
      const policy = response.headers.get('Cache-Control') || ''
      const freshFor = Number(/s-maxage=(\d+)/.exec(policy)?.[1] || 60)
      const staleFor = Number(/stale-while-revalidate=(\d+)/.exec(policy)?.[1] || 300)
      const headers = new Headers(response.headers)
      headers.set(STORED_AT, String(now()))
      headers.set(FRESH_FOR, String(freshFor))
      headers.set(STALE_FOR, String(staleFor))
      // The stored response survives the freshness window so we can explicitly
      // implement SWR. Cache.put does not implement stale-while-revalidate itself.
      headers.set('Cache-Control', `public, max-age=${freshFor + staleFor}`)
      const stored = new Response(response.body, { status: response.status, headers })
      try {
        await cache.put(key, stored.clone())
      } catch (error) {
        console.warn('Unable to cache projects', error)
      }
      return stored
    })()
    inFlight.set(key.url, task)
    void task.finally(() => inFlight.delete(key.url)).catch(() => {})
    return task.then((response) => response.clone())
  }

  function publicResponse(stored: Response, state: string) {
    const headers = new Headers(stored.headers)
    const age = Math.max(0, Math.floor((now() - Number(headers.get(STORED_AT))) / 1000))
    const freshFor = Number(headers.get(FRESH_FOR))
    const staleFor = Number(headers.get(STALE_FOR))
    headers.delete(STORED_AT)
    headers.delete(FRESH_FOR)
    headers.delete(STALE_FOR)
    headers.set(
      'Cache-Control',
      `public, max-age=0, s-maxage=${freshFor}, stale-while-revalidate=${staleFor}`
    )
    headers.set('Age', String(age))
    headers.set('X-Projects-Cache', state)
    return new Response(stored.body, { status: stored.status, headers })
  }

  return async function handleProjects(
    request: Request,
    cache: ProjectCache,
    context: BackgroundContext
  ) {
    // Do not let arbitrary query strings create unbounded cache entries or
    // separate request cookies/headers influence this public, non-personal feed.
    const key = new Request(new URL('/api/projects', request.url), { method: 'GET' })
    let cached: Response | undefined
    try {
      cached = await cache.match(key)
    } catch (error) {
      console.warn('Unable to read the projects cache', error)
    }
    if (cached) {
      const storedAt = Number(cached.headers.get(STORED_AT))
      const freshFor = Number(cached.headers.get(FRESH_FOR))
      const staleFor = Number(cached.headers.get(STALE_FOR))
      const age = (now() - storedAt) / 1000
      if (storedAt > 0 && freshFor > 0 && age >= 0 && age < freshFor) {
        return publicResponse(cached, 'HIT')
      }
      if (storedAt > 0 && freshFor > 0 && age >= 0 && age < freshFor + staleFor) {
        context.waitUntil(
          refresh(key, cache).catch((error) => {
            // A transient failure must not erase the last good cached response.
            console.warn('Project revalidation failed', error)
          })
        )
        return publicResponse(cached, 'STALE')
      }
    }
    return publicResponse(await refresh(key, cache), 'MISS')
  }
}
