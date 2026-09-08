import {
  startServer,
  runsFrom,
  measure,
  summarize,
  saveSummary,
  enforce,
} from './performance-harness.mjs'

const directory = 'artifacts/performance/audit'
const count = runsFrom(process.env.PERFORMANCE_RUNS || 3)
const server = await startServer(process.cwd(), Number(process.env.PERFORMANCE_PORT || 4317))
try {
  const samples = []
  for (let i = 1; i <= count; i++) samples.push(await measure(server.url, directory, 'astro', i))
  const median = summarize(samples)
  await saveSummary(directory, { url: server.url, samples, median })
  enforce(median)
} finally {
  server.close()
}
