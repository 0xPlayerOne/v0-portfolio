import { describe, expect, it } from 'bun:test'
import { getLanguageColor } from './language-colors'

// SITE_BTN_COLOR fallback (from @/constants/colors -> LIGHT_PURPLE)
const FALLBACK = '#B19CD9'

describe('getLanguageColor', () => {
  it('returns the exact hex for a known language', () => {
    expect(getLanguageColor('TypeScript')).toBe('#3178c6')
    expect(getLanguageColor('JavaScript')).toBe('#f1e05a')
    expect(getLanguageColor('Python')).toBe('#3572A5')
    expect(getLanguageColor('Solidity')).toBe('#AA6746')
    expect(getLanguageColor('C#')).toBe('#239120')
  })

  it('is case-sensitive and falls back for unknown or differently-cased languages', () => {
    expect(getLanguageColor('typescript')).toBe(FALLBACK)
    expect(getLanguageColor('rust')).toBe(FALLBACK)
    expect(getLanguageColor('COBOL')).toBe(FALLBACK)
    expect(getLanguageColor('')).toBe(FALLBACK)
  })

  it('falls back for languages not in the map', () => {
    expect(getLanguageColor('Brainfuck')).toBe(FALLBACK)
    expect(getLanguageColor('Assembly')).toBe(FALLBACK)
  })

  it('returns the configured fallback color for any unmapped input', () => {
    expect(getLanguageColor('not-a-real-language')).toBe(FALLBACK)
  })
})
