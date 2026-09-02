import { fetchPinnedRepos } from '@/lib/github'

export const revalidate = 3600

export async function GET() {
  const projects = await fetchPinnedRepos()

  return Response.json(projects, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
