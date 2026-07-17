import { describe, expect, it } from 'bun:test';
import { getLanguageColor } from './language-colors';

describe('getLanguageColor', () => {
  it('returns the known color for a mapped language', () => {
    expect(getLanguageColor('TypeScript')).toBe('#3178c6');
    expect(getLanguageColor('Python')).toBe('#3572A5');
    expect(getLanguageColor('Rust')).toBe('#dea584');
  });

  it('is case-sensitive on the exact key', () => {
    expect(getLanguageColor('typescript')).not.toBe('#3178c6');
  });

  it('falls back to the site button color for unknown languages', () => {
    const fallback = getLanguageColor('SomeUnknownLang');
    expect(typeof fallback).toBe('string');
    expect(fallback.length).toBeGreaterThan(0);
  });
});
