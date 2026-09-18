export function GET() {
  const site = import.meta.env.SITE ?? 'https://andrewmf.com'
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
}
