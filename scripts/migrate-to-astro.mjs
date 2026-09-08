import { readFile, writeFile, rm } from 'node:fs/promises'

const config = await readFile('astro.config.mjs', 'utf8')
await writeFile('astro.config.mjs', config
  .replace("import react from '@astrojs/react'", "import react from '@astrojs/react'\nimport tailwindcss from '@tailwindcss/vite'")
  .replace('  vite: {', '  vite: {\n    plugins: [tailwindcss()],'))
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
pkg.devDependencies['@tailwindcss/vite'] = '^4.3.3'
delete pkg.devDependencies['@tailwindcss/postcss']
delete pkg.devDependencies.postcss
await writeFile('package.json', JSON.stringify(pkg, null, 2) + '\n')
await rm('postcss.config.mjs')
await rm('scripts/migrate-to-astro.mjs')
