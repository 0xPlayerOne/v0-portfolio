import { useState, useCallback, type CSSProperties } from 'react'
import { ExternalLink, Star, GitFork, RefreshCw, Pin } from 'lucide-react'
import { Github } from '@/lib/brand-icons'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { GameCreditsCard } from '@/components/game-credits'

import type { PinnedRepo } from '@/types/github'
import { GITHUB_LINK } from '@/constants/links'
import { LANGUAGES_DISPLAYED, MAX_PROJECTS } from '@/constants/github'
import { useCardHover } from '@/lib/card-styles'
import { getLanguageColor } from '@/lib/language-colors'
import { cn } from '@/lib/utils'

interface ProjectsSectionProps {
  initialProjects: PinnedRepo[]
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<PinnedRepo[]>(initialProjects)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/projects', {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`Projects API error: ${response.status}`)
      }

      const repos = (await response.json()) as PinnedRepo[]
      setProjects(repos)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to load projects')
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const { handleMouseEnter, handleMouseLeave } = useCardHover()

  return (
    <Section id="projects">
      <div className="mb-8 flex items-center justify-center gap-4">
        <Typography variant="h2" align="center" color="primary">
          Projects
        </Typography>
        <Button
          variant="site-outline"
          size="sm"
          aria-label="Refresh projects"
          onClick={() => loadProjects()}
          disabled={loading}
          className="hover:scale-105"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      {error && (
        <div className="mb-6 text-center">
          <Typography variant="body2" color="destructive">
            {error} - Showing fallback projects
          </Typography>
        </div>
      )}

      {lastUpdated && (
        <div className="mb-6 text-center">
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {[...Array(MAX_PROJECTS)].map((_, index) => (
              <Card key={index} variant="site" className="animate-pulse">
                <CardContent className="p-6 sm:p-8">
                  <div className="bg-skeleton mb-4 h-6 rounded"></div>
                  <div className="bg-skeleton-deep mb-2 h-4 rounded"></div>
                  <div className="bg-skeleton-deep mb-4 h-4 w-3/4 rounded"></div>
                  <div className="flex gap-2">
                    <div className="bg-skeleton h-6 w-16 rounded"></div>
                    <div className="bg-skeleton h-6 w-20 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {projects.map((project) => (
              <Card
                key={project.url}
                variant="site"
                className="group relative hover:scale-105"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {project.isPinned && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="border-site-btn-40 bg-site-btn-20 text-site-btn flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
                      <Pin size={12} />
                      <span>Pinned</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-6 sm:p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className={cn('flex-1 pr-4', project.isPinned ? 'mt-8' : '')}>
                      <Typography variant="h3" color="secondary" className="mb-2">
                        {project.title}
                      </Typography>
                    </div>

                    {/* Stars and forks display - horizontal, right-aligned */}
                    <div
                      className={cn(
                        'flex min-w-30 items-center justify-end gap-4',
                        project.isPinned ? 'mt-8' : ''
                      )}
                    >
                      {project.forks > 0 && (
                        <div className="flex items-center gap-1">
                          <GitFork size={14} className="text-site-btn" />
                          <Typography variant="caption">{project.forks}</Typography>
                        </div>
                      )}
                      {project.stars > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-site-btn" />
                          <Typography variant="caption">{project.stars}</Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <Typography variant="body1" gutterBottom>
                    {project.description}
                  </Typography>

                  {/* Languages display - horizontal layout */}
                  {project.languages.length > 0 && (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {project.languages.slice(0, LANGUAGES_DISPLAYED).map((lang) => (
                        <div key={lang.name} className="flex items-center gap-1.5 text-sm">
                          <div
                            className="h-3 w-3 flex-shrink-0 rounded-full bg-(--lang-color)"
                            style={{ '--lang-color': getLanguageColor(lang.name) } as CSSProperties}
                          />
                          <span className="text-site-text text-sm">{lang.name}</span>
                          <span className="text-site-text text-xs">({lang.percentage}%)</span>
                        </div>
                      ))}
                      {project.languages.length > LANGUAGES_DISPLAYED && (
                        <span className="text-site-text text-sm">
                          +{project.languages.length - LANGUAGES_DISPLAYED} more
                        </span>
                      )}
                    </div>
                  )}

                  {project.tech.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {project.tech.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="site">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="site-outline"
                      size="sm"
                      asChild
                      className="flex-1 hover:scale-105"
                    >
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Github size={16} className="mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.homepage && (
                      <Button variant="site" size="sm" asChild className="flex-1 hover:scale-105">
                        <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} className="mr-2" />
                          Live
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Button variant="site-outline" asChild className="hover:scale-105">
          <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
            <Github size={16} className="mr-2" />
            View All Projects on GitHub
          </a>
        </Button>
      </div>

      <div className="mt-16 flex justify-center">
        <GameCreditsCard />
      </div>
    </Section>
  )
}
