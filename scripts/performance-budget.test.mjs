import { describe, expect, test } from 'bun:test'
import { checkMaximum, checkMinimum } from './performance-budget.mjs'

describe('performance budgets', () => {
  test('accepts measurements at their boundary', () => {
    expect(checkMaximum('bytes', 100, 100)).toBe('bytes: 100 <= 100')
    expect(checkMinimum('score', 0.9, 0.9)).toBe('score: 0.9 >= 0.9')
  })

  test('rejects regressions beyond a boundary', () => {
    expect(() => checkMaximum('bytes', 101, 100)).toThrow('101 > 100')
    expect(() => checkMinimum('score', 0.89, 0.9)).toThrow('0.89 < 0.9')
  })

  test('rejects missing measurements', () => {
    expect(() => checkMaximum('bytes', Number.NaN, 100)).toThrow('was not measured')
    expect(() => checkMinimum('score', Number.NaN, 0.9)).toThrow('was not measured')
  })
})
