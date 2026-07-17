import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { GameCreditsCard } from '@/components/game-credits'
import { ContactSection } from '@/views/contact-section'
import { SkillsSection } from '@/views/skills-section'
import type { PinnedRepo } from '@/types/github'

const project: PinnedRepo = {
  title: 'Test Project',
  description: 'A reliable test project',
  tech: ['vitest', 'typescript'],
  url: 'https://github.com/example/test-project',
  homepage: 'https://example.com',
  stars: 12,
  forks: 3,
  languages: [{ name: 'TypeScript', percentage: 100 }],
  isPinned: true,
}

const fetchPinnedRepos = mock<() => Promise<PinnedRepo[]>>()

mock.module('@/lib/github', () => ({ fetchPinnedRepos }))

describe('portfolio sections', () => {
  beforeEach(() => {
    fetchPinnedRepos.mockClear()
    fetchPinnedRepos.mockResolvedValue([project])
  })

  it('renders skill groups, contact links, and game credits', async () => {
    render(
      <>
        <SkillsSection />
        <ContactSection />
        <GameCreditsCard />
      </>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Skills & Expertise' })).not.toBeNull()
      expect(screen.getByRole('heading', { name: 'Game Credits' })).not.toBeNull()
      expect(screen.getByRole('link', { name: /github/i })?.getAttribute('href')).toContain('github.com')
    })

    const gameCredits = screen.getByRole('heading', { name: 'Game Credits' }).closest('div')
    if (gameCredits) {
      fireEvent.mouseEnter(gameCredits)
      fireEvent.mouseLeave(gameCredits)
    }

    await waitFor(() => {
      const section = document.querySelector<HTMLElement>('#skills')
      expect(Number.parseInt(section?.style.minHeight ?? '0', 10)).toBeGreaterThanOrEqual(600)
    })
  })

  it('loads and refreshes project data', async () => {
    const { ProjectsSection } = await import('@/views/projects-section')
    render(<ProjectsSection />)

    expect(await screen.findByRole('heading', { name: 'Test Project' })).not.toBeNull()
    expect(screen.getByText('A reliable test project')).not.toBeNull()
    expect(screen.getByText('TypeScript')).not.toBeNull()

    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(fetchPinnedRepos).toHaveBeenCalledTimes(2))
  })
})
