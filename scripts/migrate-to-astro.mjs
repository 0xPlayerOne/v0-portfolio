// One-use branch validation fixes; remove this bootstrap before committing.
import { readFile, writeFile, rename, rm } from 'node:fs/promises'

const types = await readFile('constants/github.ts', 'utf8')
await writeFile('constants/github.ts', types.replace("import { PinnedRepo, PinnedRepoConfig }", "import type { PinnedRepo, PinnedRepoConfig }"))

const layout = await readFile('src/layouts/Layout.astro', 'utf8')
await writeFile('src/layouts/Layout.astro', layout.replace("import '@fontsource-variable/inter/latin.css'\nimport '@fontsource/press-start-2p/latin-400.css'", "import '../styles/fonts.css'"))
await writeFile('src/styles/fonts.css', `/* Latin-only self-hosted assets. The layout preloads these same URLs. */
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2') format('woff2');
}

@font-face {
  font-family: 'Press Start 2P';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url('@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2') format('woff2');
}
`)

// Bun auto-discovers .spec.ts, irrespective of this version's TOML exclusions.
// A dedicated browser suffix keeps the runners separate without skipping units.
await rename('e2e/portfolio.spec.ts', 'e2e/portfolio.e2e.ts')
const playwright = await readFile('playwright.config.ts', 'utf8')
await writeFile('playwright.config.ts', playwright.replace("  testDir: './e2e',", "  testDir: './e2e',\n  testMatch: '**/*.e2e.ts',"))

// Target the current stable Astro and matching React integration major.
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
pkg.dependencies.astro = '^7.3.2'
pkg.dependencies['@astrojs/react'] = '^6.0.5'
await writeFile('package.json', JSON.stringify(pkg, null, 2) + '\n')
await rm('scripts/migrate-to-astro.mjs')
