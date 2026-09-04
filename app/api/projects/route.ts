import { FALLBACK_PINNED_REPOS, FALLBACK_POPULAR_REPOS } from '@/constants/github'
import { fetchPinnedRepos } from '@/lib/github'

export const revalidate = 3600

export async function GET() {
  try {
    const projects = await fetchPinnedRepos()

    return Response.json(projects, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    // Defensive fallback — fetchPinnedRepos already handles per-request errors,
    // but a top-level failure (DNS, runtime) should degrade gracefully rather
    // than surface a 500 to the client. Return fallback data with a shorter
    // cache so the next revalidation retries the live fetch quickly.
    const fallback = [...FALLBACK_PINNED_REPOS, ...FALLBACK_POPULAR_REPOS]
    return Response.json(fallback, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      },
    })
  }
}
