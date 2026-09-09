import { readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import budgets from '../performance-budgets.json' with { type: 'json' }
import { checkMaximum } from './performance-budget.mjs'

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const groups = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? filesUnder(path) : [{ path, size: (await stat(path)).size }]
    })
  )
  return groups.flat()
}
const assets = await filesUnder('dist')
const worker = await filesUnder('.worker-build')
const sum = (files) => files.reduce((total, file) => total + file.size, 0)
const measurements = {
  outputBytes: sum(assets) + sum(worker),
  assetBytes: sum(assets),
  javascriptBytes: sum(assets.filter((file) => file.path.endsWith('.js'))),
  workerBytes: sum(worker.filter((file) => /\.(?:js|mjs)$/.test(file.path))),
}
for (const [key, value] of Object.entries(measurements))
  console.log(checkMaximum(key, value, budgets.artifacts[key]))
await mkdir('artifacts/performance', { recursive: true })
await writeFile('artifacts/performance/build.json', JSON.stringify(measurements, null, 2) + '\n')
