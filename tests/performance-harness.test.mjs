import { describe, expect, it } from 'bun:test'
import { runsFrom, summarize } from '../scripts/performance-harness.mjs'

describe('repeatable performance reporting', () => {
  it('requires multiple odd-numbered samples', () => {
    expect(runsFrom()).toBe(3)
    expect(runsFrom('5')).toBe(5)
    for (const invalid of [0, 1, 2, 4, 10, 'not-a-number'])
      expect(() => runsFrom(invalid)).toThrow()
  })
  it('calculates each metric median without mutating the samples', () => {
    const samples = [30, 10, 20].map((n) => ({ measurements: { lcpMs: n, tbtMs: n * 2 } }))
    expect(summarize(samples)).toEqual({ lcpMs: 20, tbtMs: 40 })
    expect(samples[0].measurements.lcpMs).toBe(30)
    expect(() => summarize([])).toThrow()
  })
})
