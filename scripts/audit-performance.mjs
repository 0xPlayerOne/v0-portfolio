import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import budgets from '../performance-budgets.json' with { type: 'json' }
import { checkMaximum, checkMinimum } from './performance-budget.mjs'

const host = '127.0.0.1'
const port = Number(process.env.PERFORMANCE_PORT || 4317)
const url = `http://${host}:${port}/`
const server = spawn('bunx', ['next', 'start', '-H', host, '-p', String(port)], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverOutput = ''
server.stdout.on('data', (chunk) => {
  serverOutput += chunk
})
server.stderr.on('data', (chunk) => {
  serverOutput += chunk
})

async function waitForServer() {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before it became ready:\n${serverOutput}`)
    }

    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Timed out waiting for ${url}\n${serverOutput}`)
}

async function runLighthouse(reportPath) {
  const lighthouse = spawn(
    'npx',
    [
      '--yes',
      'lighthouse@13.0.1',
      url,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--only-categories=performance',
      '--output=json',
      `--output-path=${reportPath}`,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  )
  let output = ''
  lighthouse.stdout.on('data', (chunk) => {
    output += chunk
  })
  lighthouse.stderr.on('data', (chunk) => {
    output += chunk
  })

  const exitCode = await new Promise((resolve, reject) => {
    lighthouse.once('error', reject)
    lighthouse.once('close', resolve)
  })
  if (exitCode !== 0) throw new Error(`Lighthouse failed with exit code ${exitCode}:\n${output}`)
}

try {
  await waitForServer()
  await mkdir('artifacts/performance', { recursive: true })
  const reportPath = 'artifacts/performance/lighthouse.json'
  await runLighthouse(reportPath)
  const lhr = JSON.parse(await readFile(reportPath, 'utf8'))
  const audits = lhr.audits
  const requests = audits['network-requests'].details?.items || []
  const scripts = requests.filter((request) => request.resourceType === 'Script')
  const measurements = {
    performanceScore: lhr.categories.performance.score,
    ttfbMs: audits['server-response-time'].numericValue,
    lcpMs: audits['largest-contentful-paint'].numericValue,
    cls: audits['cumulative-layout-shift'].numericValue,
    tbtMs: audits['total-blocking-time'].numericValue,
    javascriptTransferBytes: scripts.reduce(
      (total, request) => total + (request.transferSize || 0),
      0
    ),
    totalTransferBytes: requests.reduce((total, request) => total + (request.transferSize || 0), 0),
  }

  console.log('Lighthouse mobile measurements:')
  const failures = []
  const report = (check) => {
    try {
      console.log(`  ${check()}`)
    } catch (error) {
      failures.push(error.message)
      console.error(`  ${error.message}`)
    }
  }
  report(() =>
    checkMinimum('performanceScore', measurements.performanceScore, budgets.lab.performanceScore)
  )
  for (const name of [
    'ttfbMs',
    'lcpMs',
    'cls',
    'tbtMs',
    'javascriptTransferBytes',
    'totalTransferBytes',
  ]) {
    report(() => checkMaximum(name, measurements[name], budgets.lab[name]))
  }
  console.log(
    `  Field p75 targets (release review): LCP ${budgets.field.lcpP75Ms} ms, CLS ${budgets.field.clsP75}, INP ${budgets.field.inpP75Ms} ms`
  )

  await writeFile(
    reportPath,
    JSON.stringify({ measuredAt: lhr.fetchTime, url, measurements }, null, 2) + '\n'
  )
  if (failures.length > 0) {
    throw new Error(`Performance budget failed:\n${failures.join('\n')}`)
  }
} finally {
  server.kill('SIGTERM')
}
