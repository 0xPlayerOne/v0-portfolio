import { describe, expect, it } from 'bun:test'

import { GET as robotsGet } from '@/src/pages/robots.txt'
import { GET as sitemapGet } from '@/src/pages/sitemap.xml'

describe('seo routes', () => {
  it('serves robots.txt with public cache headers', async () => {
    const response = robotsGet()
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400, s-maxage=604800')
    const body = await response.text()
    expect(body).toContain('Sitemap: https://andrewmf.com/sitemap.xml')
  })

  it('serves sitemap.xml with public cache headers', async () => {
    const response = sitemapGet()
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8')
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=86400')
    const body = await response.text()
    expect(body).toContain('<loc>https://andrewmf.com/</loc>')
  })
})
