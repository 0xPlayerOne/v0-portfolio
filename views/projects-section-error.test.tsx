import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, mock, spyOn } from 'bun:test'

const fetchPinnedRepos = mock(() => Promise.reject(new Error('network down')))

mock.module('@/lib/github', () => ({ fetchPinnedRepos }))

// Must import AFTER mock.module hoisting (bun hoists mock.module calls)
import { ProjectsSection } from '@/views/projects-section'

describe('ProjectsSection – error handling', () => {
  it('shows fallback error UI when fetchPinnedRepos throws', async () => {
    const errSpy = spyOn(console, 'error').mockImplementation(() => undefined)

    render(<ProjectsSection />)

    // loading skeleton first
    expect(document.querySelector('.animate-pulse')).not.toBeNull()

    await waitFor(() => {
      expect(screen.getByText(/Failed to load projects/)).not.toBeNull()
    })
    expect(errSpy).toHaveBeenCalled()
    expect(fetchPinnedRepos).toHaveBeenCalled()

    errSpy.mockRestore()
  })
})
