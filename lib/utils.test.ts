import { describe, expect, it } from 'bun:test'
import { cn } from './utils'

describe('cn', () => {
  it('joins simple class strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('handles conditional (falsy) values without emitting them', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('resolves conflicting Tailwind classes via tailwind-merge (last wins)', () => {
    // tailwind-merge dedupes conflicting utilities, keeping the last one
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('merges object syntax from clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('returns an empty string for no arguments', () => {
    expect(cn()).toBe('')
  })
})
