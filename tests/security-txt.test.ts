import { describe, expect, it } from 'bun:test'

describe('security.txt', () => {
  it('publishes a valid security contact document', async () => {
    const content = await Bun.file('public/.well-known/security.txt').text()

    expect(content).toContain('Canonical: https://andrewmf.com/.well-known/security.txt')
    expect(content).toContain(
      'Contact: https://github.com/0xPlayerOne/v0-portfolio/security/advisories/new'
    )
    expect(content).toContain('Expires: 2027-09-02T00:00:00Z')
    expect(content).toContain('Policy: https://github.com/0xPlayerOne/v0-portfolio/security/policy')
    expect(content).toContain('Preferred-Languages: en')
  })
})
