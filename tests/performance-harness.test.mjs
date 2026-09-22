import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test'
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkMaximum, checkMinimum } from '../scripts/performance-budget.mjs'

function writeExecutable(directory, name, source) {
  const path = join(directory, name)
  writeFileSync(path, `#!/usr/bin/env node\n${source}\n`)
  chmodSync(path, 0o755)
  return path
}

describe('checkMaximum', () => {
  it('returns pass message when within budget', () => {
    expect(checkMaximum('lcpMs', 1000, 3000)).toBe('lcpMs: 1000 <= 3000')
  })
  it('throws when exceeding budget', () => {
    expect(() => checkMaximum('lcpMs', 4000, 3000)).toThrow('exceeded its budget')
  })
  it('throws when value is not finite', () => {
    expect(() => checkMaximum('lcpMs', NaN, 3000)).toThrow('was not measured')
  })
})

describe('checkMinimum', () => {
  it('returns pass message when above minimum', () => {
    expect(checkMinimum('performanceScore', 0.9, 0.75)).toBe('performanceScore: 0.9 >= 0.75')
  })
  it('throws when below minimum', () => {
    expect(() => checkMinimum('performanceScore', 0.5, 0.75)).toThrow('missed its budget')
  })
  it('throws when value is not finite', () => {
    expect(() => checkMinimum('performanceScore', NaN, 0.75)).toThrow('was not measured')
  })
})

describe('runsFrom', () => {
  it('accepts the default and supported odd run counts', async () => {
    const { runsFrom } = await import('../scripts/performance-harness.mjs')

    expect(runsFrom()).toBe(3)
    expect(runsFrom('5')).toBe(5)
    expect(runsFrom(9)).toBe(9)
  })

  it('rejects non-integer, even, and out-of-range run counts', async () => {
    const { runsFrom } = await import('../scripts/performance-harness.mjs')

    for (const value of [0, 2, 10, 3.5, 'two']) {
      expect(() => runsFrom(value)).toThrow('Use an odd number of runs between 3 and 9')
    }
  })
})

describe('enforce', () => {
  it('passes when all measurements are within budget', async () => {
    const { enforce } = await import('../scripts/performance-harness.mjs')
    const measurements = {
      performanceScore: 0.9,
      ttfbMs: 300,
      lcpMs: 1000,
      cls: 0.05,
      tbtMs: 200,
      javascriptTransferBytes: 100_000,
      totalTransferBytes: 150_000,
    }
    expect(() => enforce(measurements)).not.toThrow()
  })

  it('throws when a maximum budget is exceeded', async () => {
    const { enforce } = await import('../scripts/performance-harness.mjs')
    const measurements = {
      performanceScore: 0.9,
      ttfbMs: 300,
      lcpMs: 4000,
      cls: 0.05,
      tbtMs: 200,
      javascriptTransferBytes: 100_000,
      totalTransferBytes: 150_000,
    }
    expect(() => enforce(measurements)).toThrow('exceeded its budget')
  })

  it('throws when a minimum budget is missed', async () => {
    const { enforce } = await import('../scripts/performance-harness.mjs')
    const measurements = {
      performanceScore: 0.5,
      ttfbMs: 300,
      lcpMs: 1000,
      cls: 0.05,
      tbtMs: 200,
      javascriptTransferBytes: 150_000,
      totalTransferBytes: 200_000,
    }
    expect(() => enforce(measurements)).toThrow('missed its budget')
  })
})

describe('summarize', () => {
  it('calculates each metric median without mutating the samples', async () => {
    const { summarize } = await import('../scripts/performance-harness.mjs')
    const samples = [30, 10, 20].map((n) => ({ measurements: { lcpMs: n, tbtMs: n * 2 } }))
    expect(summarize(samples)).toEqual({ lcpMs: 20, tbtMs: 40 })
    expect(samples[0].measurements.lcpMs).toBe(30)
    expect(() => summarize([])).toThrow()
  })
})

describe('saveSummary', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'perf-harness-'))
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('writes summary.json', async () => {
    const { saveSummary } = await import('../scripts/performance-harness.mjs')
    const report = { score: 0.95, iterations: 5 }
    await saveSummary(tmpDir, report, false)

    const jsonPath = join(tmpDir, 'summary.json')
    expect(existsSync(jsonPath)).toBe(true)
    const content = JSON.parse(readFileSync(jsonPath, 'utf8'))
    expect(content).toEqual(report)
  })

  it('writes summary.md when markdown content is provided', async () => {
    const { saveSummary } = await import('../scripts/performance-harness.mjs')
    await saveSummary(tmpDir, { score: 0.9 }, '# Performance Summary')

    const mdPath = join(tmpDir, 'summary.md')
    expect(existsSync(mdPath)).toBe(true)
    const content = readFileSync(mdPath, 'utf8')
    expect(content).toContain('Performance Summary')
  })
})

describe('command', () => {
  it('executes a child process successfully', async () => {
    const { command } = await import('../scripts/performance-harness.mjs')
    await command('echo', ['hello'])
  })

  it('throws when child process exits with non-zero code', async () => {
    const { command } = await import('../scripts/performance-harness.mjs')
    await expect(command('false', [])).rejects.toThrow('exited with 1')
  })
})

describe('measure', () => {
  it('parses Lighthouse output and aggregates network transfer sizes', async () => {
    const binDir = mkdtempSync(join(tmpdir(), 'perf-lighthouse-bin-'))
    const reportDir = mkdtempSync(join(tmpdir(), 'perf-lighthouse-report-'))
    const originalPath = process.env.PATH
    const originalMode = process.env.FAKE_LIGHTHOUSE_MODE
    writeExecutable(
      binDir,
      'npx',
      `const { writeFileSync } = require('node:fs')
const outputArg = process.argv.find((arg) => arg.startsWith('--output-path='))
if (!outputArg) process.exit(2)
const lhr = process.env.FAKE_LIGHTHOUSE_MODE === 'runtime'
  ? { runtimeError: { message: 'fixture runtime failure' } }
  : {
      fetchTime: '2026-09-22T07:00:00.000Z',
      lighthouseVersion: '13.0.1',
      userAgent: 'fixture lighthouse',
      environment: { networkUserAgent: 'fixture browser' },
      categories: { performance: { score: 0.95 } },
      audits: {
        'server-response-time': { numericValue: 120 },
        'largest-contentful-paint': { numericValue: 800 },
        'cumulative-layout-shift': { numericValue: 0.02 },
        'total-blocking-time': { numericValue: 40 },
        'network-requests': {
          details: {
            items: [
              { resourceType: 'Script', transferSize: 300 },
              { resourceType: 'Document', transferSize: 50 },
            ],
          },
        },
      },
    }
writeFileSync(outputArg.slice('--output-path='.length), JSON.stringify(lhr))`
    )
    process.env.PATH = `${binDir}:${originalPath ?? ''}`
    delete process.env.FAKE_LIGHTHOUSE_MODE

    try {
      const { measure } = await import('../scripts/performance-harness.mjs')
      const report = await measure('http://127.0.0.1:4317/', reportDir, 'fixture', 1)

      expect(report).toMatchObject({
        iteration: 1,
        measuredAt: '2026-09-22T07:00:00.000Z',
        lighthouseVersion: '13.0.1',
        userAgent: 'fixture lighthouse',
        environment: { networkUserAgent: 'fixture browser' },
        measurements: {
          performanceScore: 0.95,
          ttfbMs: 120,
          lcpMs: 800,
          cls: 0.02,
          tbtMs: 40,
          javascriptTransferBytes: 300,
          totalTransferBytes: 350,
        },
      })

      process.env.FAKE_LIGHTHOUSE_MODE = 'runtime'
      await expect(measure('http://127.0.0.1:4317/', reportDir, 'fixture', 2)).rejects.toThrow(
        'Lighthouse runtime error: fixture runtime failure'
      )
    } finally {
      process.env.PATH = originalPath
      if (originalMode === undefined) delete process.env.FAKE_LIGHTHOUSE_MODE
      else process.env.FAKE_LIGHTHOUSE_MODE = originalMode
      rmSync(binDir, { recursive: true, force: true })
      rmSync(reportDir, { recursive: true, force: true })
    }
  })
})

describe('startServer', () => {
  it('waits through a non-OK response and captures worker output', async () => {
    const binDir = mkdtempSync(join(tmpdir(), 'perf-server-bin-'))
    const originalPath = process.env.PATH
    const originalFetch = globalThis.fetch
    let attempts = 0
    writeExecutable(
      binDir,
      'bunx',
      `process.stdout.write('worker stdout\\n')
process.stderr.write('worker stderr\\n')
setInterval(() => {
  process.stdout.write('worker stdout\\n')
  process.stderr.write('worker stderr\\n')
}, 25)`
    )
    process.env.PATH = `${binDir}:${originalPath ?? ''}`
    globalThis.fetch = mock(async () => {
      attempts += 1
      if (attempts === 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return new Response('starting', { status: 503 })
      }
      return new Response('ready')
    })

    let result
    try {
      const { startServer } = await import('../scripts/performance-harness.mjs')
      result = await startServer('/tmp', 3002)
      expect(result.url).toBe('http://127.0.0.1:3002/')
      expect(attempts).toBe(2)
    } finally {
      result?.close()
      globalThis.fetch = originalFetch
      process.env.PATH = originalPath
      rmSync(binDir, { recursive: true, force: true })
    }
  })

  it('closes and reports a server that fails during startup', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = mock(async () => {
      throw new Error('server is still starting')
    })

    try {
      const { startServer } = await import('../scripts/performance-harness.mjs')
      await expect(
        startServer(join(tmpdir(), 'missing-performance-server-cwd'), 3003)
      ).rejects.toThrow()
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
