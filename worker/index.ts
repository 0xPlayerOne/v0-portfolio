import { GET } from '../lib/projects-response'
import { createProjectsHandler } from './projects-cache'

interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
interface Context { waitUntil(promise: Promise<unknown>): void }
const projects = createProjectsHandler(GET)
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export default {
  async fetch(request: Request, env: Env, context: Context): Promise<Response> {
    const pathname = new URL(request.url).pathname
    if (pathname !== '/api/projects' && pathname !== '/api/projects/') {
      return env.ASSETS.fetch(request)
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { ...SECURITY_HEADERS, Allow: 'GET, HEAD', 'Cache-Control': 'no-store' },
      })
    }
    const cache = await caches.open('portfolio-projects-v1')
    const response = await projects(request, cache, context)
    const headers = new Headers(response.headers)
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value)
    return new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      headers,
    })
  },
}
