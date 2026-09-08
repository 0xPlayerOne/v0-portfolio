import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import budgets from '../performance-budgets.json' with { type: 'json' }
import { checkMaximum } from './performance-budget.mjs'

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? filesUnder(path) : [path]
    })
  )
  return files.flat()
}

async function totalBytes(files) {
  const sizes = await Promise.all(files.map(async (file) => (await stat(file)).size))
  return sizes.reduce((total, size) => total + size, 0)
}

const openNextFiles = await filesUnder('.open-next')
const assetFiles = await filesUnder('.open-next/assets')
const measurements = {
  openNextBytes: await totalBytes(openNextFiles),
  openNextAssetsBytes: await totalBytes(assetFiles),
  openNextJavaScriptBytes: await totalBytes(assetFiles.filter((file) => file.endsWith('.js'))),
  serverHandlerBytes: (await stat('.open-next/server-functions/default/handler.mjs')).size,
}

console.log('OpenNext artifact measurements:')
for (const [name, actual] of Object.entries(measurements)) {
  console.log(`  ${checkMaximum(name, actual, budgets.artifacts[name])}`)
}
