// One-use topic-branch migration; source files are committed normally.
import { readFile, writeFile, mkdir, rm, rename } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('package.json', 'utf8'))
delete manifest.dependencies.next
delete manifest.devDependencies['@opennextjs/cloudflare']
Object.assign(manifest.dependencies, {
  astro: '^6.0.0',
  '@astrojs/react': '^5.0.0',
  '@fontsource-variable/inter': '^5.2.0',
  '@fontsource/press-start-2p': '^5.2.0',
})
Object.assign(manifest.devDependencies, {
  '@astrojs/check': '^0.9.0',
  '@playwright/test': '^1.55.0',
})
Object.assign(manifest.scripts, {
  dev: 'astro dev',
  build: 'bun run cloudflare:build && bun run performance:artifacts',
  start: 'wrangler dev --local',
  'cloudflare:build': 'astro build && wrangler deploy --dry-run --outdir .worker-build',
  'cloudflare:deploy': 'wrangler deploy',
  'cloudflare:upload': 'wrangler versions upload',
  'cloudflare:preview': 'wrangler dev --local',
  typecheck: 'astro check',
  'type:check': 'astro check',
  'test:e2e': 'bun run build && bunx playwright install chromium && playwright test',
  'performance:compare': 'bun scripts/compare-performance.mjs',
})
await writeFile('package.json', JSON.stringify(manifest, null, 2) + '\n')

await mkdir('src/styles', { recursive: true })
let css = await readFile('app/globals.css', 'utf8')
css = css.replace('variable injected by next/font in layout.tsx', 'variable supplied by the Astro layout')
css += `\n/* The document is static; fonts and skill-card hover do not need hydration. */\n.portfolio-document body {\n  font-family: 'Inter Variable', Arial, Helvetica, sans-serif;\n}\n#skills .group:hover,\n#skills .group:focus-within {\n  box-shadow: var(--skill-hover-shadow) !important;\n}\n`
await writeFile('src/styles/globals.css', css)
await rename('app/api/projects/route.ts', 'lib/projects-response.ts')
await rename('app/.well-known/security.txt/route.ts', 'lib/security-text.ts')
let route = await readFile('lib/projects-response.ts', 'utf8')
route = route.replace('export const revalidate = 3600\n\n', '')
await writeFile('lib/projects-response.ts', route)

let github = await readFile('lib/github.ts', 'utf8')
const original = 'RequestInit & { next: { revalidate: number } }'
if (!github.includes(original)) throw new Error('GitHub loader changed; inspect before migrating')
github = github.replace(original, 'RequestInit').replace('  next: { revalidate: 3600 },\n', '')
github = github.replaceAll('GITHUB_FETCH_OPTIONS\n', '{ ...GITHUB_FETCH_OPTIONS, signal: AbortSignal.timeout(5000) }\n')
await writeFile('lib/github.ts', github)

let projects = await readFile('views/projects-section.tsx', 'utf8')
const click = '          onClick={() => loadProjects()}'
if (!projects.includes(click)) throw new Error('Project refresh control changed')
projects = projects.replace(click, '          aria-label="Refresh projects"\n' + click)
await writeFile('views/projects-section.tsx', projects)

for (const path of ['tests/projects-route.test.ts', 'tests/projects-route-fallback.test.ts']) {
  const source = await readFile(path, 'utf8')
  await writeFile(path, source.replaceAll('@/app/api/projects/route', '@/lib/projects-response'))
}
const securityTest = await readFile('tests/security-txt.test.ts', 'utf8')
await writeFile('tests/security-txt.test.ts', securityTest.replaceAll('@/app/.well-known/security.txt/route', '@/lib/security-text'))
// Page assembly is now exercised against Astro's actual output by Playwright,
// including JavaScript-disabled HTML and the full section-anchor contract.
await rm('tests/app-page.test.tsx')
await rm('app', { recursive: true })
for (const path of ['next-env.d.ts', 'next.config.mjs', 'open-next.config.ts']) await rm(path)

for (const path of ['.oxlintrc.json', '.oxfmtrc.json']) {
  const config = JSON.parse(await readFile(path, 'utf8'))
  config.ignorePatterns = [...new Set([...(config.ignorePatterns || []), 'dist/**', '.astro/**', '.worker-build/**', 'artifacts/**'])]
  await writeFile(path, JSON.stringify(config, null, 2) + '\n')
}
let bunfig = await readFile('bunfig.toml', 'utf8')
bunfig = bunfig.replace('exclude = [', 'exclude = ["e2e/**", ".worker-build/**", ".astro/**", "artifacts/**", ')
await writeFile('bunfig.toml', bunfig)
await writeFile('.gitignore', (await readFile('.gitignore', 'utf8')) + '\n# Astro / local Workers / browser and performance reports\n.astro/\ndist/\n.worker-build/\nartifacts/\nplaywright-report/\ntest-results/\n')

// Keep the old ceilings. Only their names change to match the new artifacts.
for (const path of ['performance-budgets.json', 'docs/performance-budgets.schema.json']) {
  let content = await readFile(path, 'utf8')
  for (const [before, after] of Object.entries({
    openNextBytes: 'outputBytes',
    openNextAssetsBytes: 'assetBytes',
    openNextJavaScriptBytes: 'javascriptBytes',
    serverHandlerBytes: 'workerBytes',
  })) content = content.replaceAll(before, after)
  await writeFile(path, content)
}
let components = await readFile('components.json', 'utf8')
components = components.replace('app/globals.css', 'src/styles/globals.css').replace('"rsc": true', '"rsc": false')
await writeFile('components.json', components)

await rm('scripts/migrate-to-astro.mjs')
console.log('Generated Astro source, Worker cache, tests, and performance comparison tooling. Next baseline documentation was not modified.')
