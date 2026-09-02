import { describe, expect, it } from 'bun:test'

import { GET } from '@/app/.well-known/security.txt/route'

describe('security.txt', () => {
  it('publishes a valid security contact document', async () => {
    const response = GET()
    const content = await response.text()

    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8')
    expect(content).toContain('Canonical: https://andrewmf.com/.well-known/security.txt')
    expect(content).toContain(
      'Contact: https://github.com/0xPlayerOne/v0-portfolio/security/advisories/new'
    )
    expect(content).toContain('Expires: 2027-09-02T00:00:00Z')
    expect(content).toContain('Policy: https://github.com/0xPlayerOne/v0-portfolio/security/policy')
    expect(content).toContain('Preferred-Languages: en')
  })
})
