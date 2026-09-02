const SECURITY_TXT = [
  'Canonical: https://andrewmf.com/.well-known/security.txt',
  'Contact: https://github.com/0xPlayerOne/v0-portfolio/security/advisories/new',
  'Expires: 2027-09-02T00:00:00Z',
  'Policy: https://github.com/0xPlayerOne/v0-portfolio/security/policy',
  'Preferred-Languages: en',
  '',
].join('\n')

export const dynamic = 'force-static'

export function GET() {
  return new Response(SECURITY_TXT, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
