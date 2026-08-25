import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import Home from '@/app/page'
import type { PinnedRepo } from '@/types/github'

const project: PinnedRepo = {
  title: 'Sentinel Test Repo',
  description: 'A project surfaced through the full page assembly',
  tech: ['bun', 'typescript'],
  url: 'https://github.com/example/sentinel-test-repo',
  homepage: 'https://example.com',
  stars: 42,
  forks: 7,
  languages: [{ name: 'TypeScript', percentage: 100 }],
  isPinned: true,
}

const fetchPinnedRepos = mock<() => Promise<PinnedRepo[]>>()

mock.module('@/lib/github', () => ({ fetchPinnedRepos }))

describe('app/page (Home)', () => {
  beforeEach(() => {
    fetchPinnedRepos.mockClear()
    fetchPinnedRepos.mockResolvedValue([project])
  })

  it('renders the retro pong header canvas', () => {
    render(<Home />)
    expect(screen.getByLabelText('Retro pong header with pixel art')).toBeDefined()
  })

  it('renders every site section inside <main> with its scroll-spy anchor id in order', async () => {
    const { container } = render(<Home />)

    const main = container.querySelector('main')
    expect(main).not.toBeNull()

    const sectionIds = Array.from(main?.querySelectorAll('section[id]') ?? []).map(
      (section) => section.getAttribute('id')
    )
    // The scroll-spy navigation depends on these exact ids and order.
    expect(sectionIds).toEqual(['about', 'skills', 'projects', 'contact'])
  })

  it('composes the projects feed from fetchPinnedRepos through the section tree', async () => {
    render(<Home />)
    await waitFor(() => expect(fetchPinnedRepos).toHaveBeenCalled())
    expect(await screen.findByText('Sentinel Test Repo')).toBeDefined()
  })
})