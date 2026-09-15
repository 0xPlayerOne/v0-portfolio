import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test'
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkMaximum, checkMinimum } from '../scripts/performance-budget.mjs'

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

describe('startServer', () => {
  it('returns url and close function when server starts', async () => {
    const mockFetch = mock(async () => new Response('ok', { status: 200 }))
    const originalFetch = globalThis.fetch
    globalThis.fetch = mockFetch

    try {
      const { startServer } = await import('../scripts/performance-harness.mjs')
      const result = await startServer('/tmp', 3001)
      expect(result.url).toBe('http://127.0.0.1:3001/')
      expect(typeof result.close).toBe('function')
      result.close()
      expect(mockFetch).toHaveBeenCalled()
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
