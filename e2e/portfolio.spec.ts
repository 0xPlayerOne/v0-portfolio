import { test, expect } from '@playwright/test'

test('renders crawlable content, metadata, and project links without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto(baseURL!)
    await expect(page).toHaveTitle('AndrewMF')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://andrewmf.com/')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Portfolio website for Andrew Mahoney-Fernandes')
    expect(await page.locator('main section[id]').evaluateAll((sections) => sections.map((section) => section.id))).toEqual(['about', 'skills', 'projects', 'contact'])
    expect(await page.locator('#projects a[href^="https://github.com/"]').count()).toBeGreaterThan(1)
    expect(await page.locator('script[src*="/_next/"]').count()).toBe(0)
    await expect(page.locator('#skills').getByText('Web & Full-Stack', { exact: true })).toBeVisible()
  } finally { await context.close() }
})

test('hydrates the interactive islands without an initial projects request', async ({ page }, testInfo) => {
  const errors: string[] = []
  let projectRequests = 0
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => { if (new URL(request.url()).pathname === '/api/projects') projectRequests++ })
  await page.goto('/')
  await expect(page.getByLabel('Retro pong header with pixel art')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: testInfo.outputPath('hero.png') })
  await page.locator('#about').scrollIntoViewIfNeeded()
  // A visible island is hydrated before the user reaches its buttons.
  await expect(page.locator('astro-island[component-export="AboutSection"]')).not.toHaveAttribute('ssr', '')
  await page.getByRole('button', { name: 'Journey', exact: true }).click()
  await expect(page.locator('#about')).toContainText('Journey')
  await page.getByRole('button', { name: 'Overview', exact: true }).click()
  await page.locator('#projects').scrollIntoViewIfNeeded()
  await expect(page.locator('astro-island[component-export="ProjectsSection"]')).not.toHaveAttribute('ssr', '')
  expect(projectRequests).toBe(0)
  await page.screenshot({ path: testInfo.outputPath('projects.png') })
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('astro-island[component-export="ContactSection"]')).not.toHaveAttribute('ssr', '')
  await expect(page.getByRole('button', { name: /Let.s Connect/i })).toBeVisible()
  expect(errors).toEqual([])
})

test('refreshes projects and retains the last good cards after a failed refresh', async ({ page }) => {
  await page.route('**/api/projects', (route) => route.fulfill({ json: [{
    title: 'Refreshed Fixture', description: 'Deterministic browser fixture',
    tech: ['typescript'], url: 'https://github.com/example/fixture',
    stars: 42, forks: 2, languages: [{ name: 'TypeScript', percentage: 100 }], isPinned: true,
  }] }))
  await page.goto('/#projects')
  await expect(page.locator('astro-island[component-export="ProjectsSection"]')).not.toHaveAttribute('ssr', '')
  await page.getByRole('button', { name: 'Refresh projects' }).click()
  await expect(page.getByRole('heading', { name: 'Refreshed Fixture' })).toBeVisible()
  await page.unroute('**/api/projects')
  await page.route('**/api/projects', (route) => route.fulfill({ status: 503, body: 'Unavailable' }))
  await page.getByRole('button', { name: 'Refresh projects' }).click()
  await expect(page.getByText(/Failed to load projects/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Refreshed Fixture' })).toBeVisible()
})

test('preserves the canvas pause behavior when offscreen', async ({ page }) => {
  await page.addInitScript(() => {
    let calls = 0
    const original = CanvasRenderingContext2D.prototype.fillRect
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      calls++
      return original.apply(this, args)
    }
    Object.defineProperty(window, '__pongDrawCalls', { get: () => calls })
  })
  await page.goto('/')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  const before = await page.evaluate(() => (window as unknown as { __pongDrawCalls: number }).__pongDrawCalls)
  await page.waitForTimeout(1000)
  const after = await page.evaluate(() => (window as unknown as { __pongDrawCalls: number }).__pongDrawCalls)
  expect(after - before).toBe(0)
})

test('serves security metadata, security headers, and a genuine 404', async ({ request }) => {
  const home = await request.get('/')
  expect(home.headers()['x-frame-options']).toBe('DENY')
  expect(home.headers()['x-content-type-options']).toBe('nosniff')
  expect((await request.get('/.well-known/security.txt')).status()).toBe(200)
  expect((await request.get('/sitemap.xml')).status()).toBe(200)
  expect((await request.get('/this-route-does-not-exist')).status()).toBe(404)
  const invalidMethod = await request.post('/api/projects')
  expect(invalidMethod.status()).toBe(405)
  expect(invalidMethod.headers().allow).toBe('GET, HEAD')
})
