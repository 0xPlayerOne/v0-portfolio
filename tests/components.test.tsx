import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { GameCreditsCard } from '@/components/game-credits'
import { ContactSection } from '@/views/contact-section'
import { SkillsSection } from '@/views/skills-section'
import { Section } from '@/components/ui/section'
import type { PinnedRepo } from '@/types/github'

const project: PinnedRepo = {
  title: 'Test Project',
  description: 'A reliable test project',
  tech: ['bun', 'typescript'],
  url: 'https://github.com/example/test-project',
  homepage: 'https://example.com',
  stars: 12,
  forks: 3,
  languages: [{ name: 'TypeScript', percentage: 100 }],
  isPinned: true,
}

const fetchProjects = mock(
  async () =>
    new Response(JSON.stringify([project]), {
      headers: { 'Content-Type': 'application/json' },
    })
)

describe('portfolio sections', () => {
  beforeEach(() => {
    fetchProjects.mockClear()
    globalThis.fetch = fetchProjects as unknown as typeof fetch
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
      expect(screen.getByRole('link', { name: /github/i })?.getAttribute('href')).toContain(
        'github.com'
      )
    })

    const gameCredits = screen.getByRole('heading', { name: 'Game Credits' }).closest('div')
    if (gameCredits) {
      fireEvent.mouseEnter(gameCredits)
      fireEvent.mouseLeave(gameCredits)
    }

    await waitFor(() => {
      const section = document.querySelector<HTMLElement>('#skills')
      expect(section?.style.minHeight).toBe('max(600px, calc(100dvh - 100px))')
    })
  })

  it('loads and refreshes project data', async () => {
    const { ProjectsSection } = await import('@/views/projects-section')
    render(<ProjectsSection initialProjects={[project]} />)

    expect(await screen.findByRole('heading', { name: 'Test Project' })).not.toBeNull()
    expect(screen.getByText('A reliable test project')).not.toBeNull()
    expect(screen.getByText('TypeScript')).not.toBeNull()

    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(fetchProjects).toHaveBeenCalledTimes(1))
  })

  it('uses CSS viewport sizing without a resize listener', async () => {
    render(
      <Section id="resizable">
        <span>content</span>
      </Section>
    )

    await waitFor(() => expect(document.querySelector('#resizable')).not.toBeNull())
    expect(document.querySelector<HTMLElement>('#resizable')?.style.minHeight).toContain('100dvh')
  })
})
