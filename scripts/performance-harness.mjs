import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import budgets from '../performance-budgets.json' with { type: 'json' }
import { checkMaximum, checkMinimum } from './performance-budget.mjs'

export async function command(executable, args, options = {}) {
  const child = spawn(executable, args, { stdio: 'inherit', ...options })
  const timeout = setTimeout(() => child.kill('SIGTERM'), 15 * 60_000)
  try {
    const code = await new Promise((done, fail) => {
      child.once('error', fail)
      child.once('close', done)
    })
    if (code !== 0) throw new Error(`${executable} ${args.join(' ')} exited with ${code}`)
  } finally {
    clearTimeout(timeout)
  }
}

export async function startServer(cwd, port) {
  const url = `http://127.0.0.1:${port}/`
  const server = spawn(
    'bunx',
    ['wrangler', 'dev', '--local', '--ip', '127.0.0.1', '--port', String(port)],
    {
      cwd,
      env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: process.platform !== 'win32',
    }
  )
  let output = ''
  let error
  server.on('error', (cause) => {
    error = cause
  })
  server.stdout.on('data', (chunk) => {
    output = (output + chunk).slice(-24_000)
  })
  server.stderr.on('data', (chunk) => {
    output = (output + chunk).slice(-24_000)
  })
  const close = () => {
    if (!server.pid) return
    try {
      if (process.platform === 'win32') server.kill('SIGTERM')
      else process.kill(-server.pid, 'SIGTERM')
    } catch {
      /* The process already exited. */
    }
  }
  try {
    const deadline = Date.now() + 120_000
    while (Date.now() < deadline) {
      if (error || server.exitCode !== null) throw error || new Error(output)
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(3000) })
        if (response.ok) return { url, close }
      } catch {
        /* The Worker is still starting. */
      }
      await new Promise((done) => setTimeout(done, 250))
    }
    throw new Error(`Timed out waiting for ${url}\n${output}`)
  } catch (cause) {
    close()
    throw cause
  }
}

export function runsFrom(value = 3) {
  const runs = Number(value)
  if (!Number.isInteger(runs) || runs < 3 || runs > 9 || runs % 2 === 0) {
    throw new Error('Use an odd number of runs between 3 and 9')
  }
  return runs
}

export async function measure(url, directory, label, iteration) {
  await mkdir(directory, { recursive: true })
  const path = resolve(directory, `${label}-${iteration}.json`)
  await command('npx', [
    '--yes',
    'lighthouse@13.0.1',
    url,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    '--only-categories=performance',
    '--output=json',
    `--output-path=${path}`,
  ])
  const lhr = JSON.parse(await readFile(path, 'utf8'))
  if (lhr.runtimeError) throw new Error(`Lighthouse runtime error: ${lhr.runtimeError.message}`)
  const audits = lhr.audits
  const requests = audits['network-requests'].details?.items
  if (!Array.isArray(requests)) throw new Error('Lighthouse did not return network request data')
  const measurements = {
    performanceScore: lhr.categories.performance.score,
    ttfbMs: audits['server-response-time'].numericValue,
    lcpMs: audits['largest-contentful-paint'].numericValue,
    cls: audits['cumulative-layout-shift'].numericValue,
    tbtMs: audits['total-blocking-time'].numericValue,
    javascriptTransferBytes: requests
      .filter((r) => r.resourceType === 'Script')
      .reduce((total, r) => total + (r.transferSize || 0), 0),
    totalTransferBytes: requests.reduce((total, r) => total + (r.transferSize || 0), 0),
  }
  if (!Object.values(measurements).every(Number.isFinite))
    throw new Error('Incomplete Lighthouse metrics')
  return {
    iteration,
    measuredAt: lhr.fetchTime,
    measurements,
    lighthouseVersion: lhr.lighthouseVersion,
    userAgent: lhr.userAgent,
    environment: lhr.environment,
  }
}

export function summarize(samples) {
  if (samples.length === 0) throw new Error('Cannot summarize an empty sample')
  return Object.fromEntries(
    Object.keys(samples[0].measurements).map((key) => {
      const values = samples.map((sample) => sample.measurements[key]).toSorted((a, b) => a - b)
      return [key, values[Math.floor(values.length / 2)]]
    })
  )
}

export function enforce(measurements) {
  const failures = []
  for (const [key, maximum] of Object.entries(budgets.lab)) {
    try {
      console.log(
        key === 'performanceScore'
          ? checkMinimum(key, measurements[key], maximum)
          : checkMaximum(key, measurements[key], maximum)
      )
    } catch (error) {
      failures.push(error.message)
    }
  }
  if (failures.length) throw new Error(failures.join('\n'))
}

export async function saveSummary(directory, report, markdown) {
  await mkdir(directory, { recursive: true })
  await writeFile(resolve(directory, 'summary.json'), JSON.stringify(report, null, 2) + '\n')
  if (markdown) await writeFile(resolve(directory, 'summary.md'), markdown)
}
