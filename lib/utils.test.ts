import { describe, expect, it } from 'bun:test'
import { cn } from './utils'

describe('cn', () => {
  it('merges single class strings', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('dedupes conflicting tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles conditional (falsy) values', () => {
    expect(cn('p-4', false, null, undefined, 'm-2')).toBe('p-4 m-2')
  })

  it('merges object syntax from clsx', () => {
    expect(cn('p-4', { 'm-2': true, hidden: false })).toBe('p-4 m-2')
  })
})
