"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  Star,
  GitFork,
  RefreshCw,
  Github,
  Pin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Typography } from "@/components/ui/typography";
import { GameCreditsCard } from "@/components/game-credits";

import type { PinnedRepo } from "@/types/github";
import { GITHUB_LINK } from "@/constants/links";
import { LANGUAGES_DISPLAYED, PROJECTS_DISPLAYED } from "@/constants/github";
import {
  SITE_CARD_COLOR,
  SITE_BORDER_COLOR,
  SITE_BTN_COLOR,
  CANVAS_COLOR,
  SITE_TEXT_COLOR,
} from "@/constants/colors";
import { fetchPinnedRepos } from "@/lib/github";
import { getLanguageColor } from "@/lib/language-colors";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const [projects, setProjects] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const repos = await fetchPinnedRepos();
      setProjects(repos);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <Section id="projects">
      <div className="flex items-center justify-center gap-4 mb-8">
        <Typography variant="h2" align="center" color="primary">
          Projects
        </Typography>
        <Button
          variant="outline"
          size="sm"
          onClick={loadProjects}
          disabled={loading}
          className="border-0 hover:scale-105"
          style={{
            backgroundColor: `${SITE_BTN_COLOR}20`,
            color: SITE_BTN_COLOR,
            borderColor: SITE_BTN_COLOR,
          }}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {error && (
        <div className="text-center mb-6">
          <Typography variant="body2" style={{ color: "#ff6b6b" }}>
            {error} - Showing fallback projects
          </Typography>
        </div>
      )}

      {lastUpdated && (
        <div className="text-center mb-6">
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8")}>
            {[...Array(PROJECTS_DISPLAYED)].map((_, index) => (
              <Card
                key={index}
                className="border-0 animate-pulse"
                style={{
                  backgroundColor: SITE_CARD_COLOR,
                  boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="h-6 bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-600 rounded w-16"></div>
                    <div className="h-6 bg-gray-600 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8")}>
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group transition-all duration-300 hover:scale-105 border-0 relative"
                style={{
                  backgroundColor: SITE_CARD_COLOR,
                  boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 20px ${SITE_BTN_COLOR}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`;
                }}
              >
                {project.isPinned && (
                  <div className="absolute top-3 left-3 z-10">
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${SITE_BTN_COLOR}20`,
                        color: SITE_BTN_COLOR,
                        border: `1px solid ${SITE_BTN_COLOR}40`,
                      }}
                    >
                      <Pin size={12} />
                      <span>Pinned</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "flex-1 pr-4",
                        project.isPinned ? "mt-8" : "",
                      )}
                    >
                      <Typography
                        variant="h3"
                        color="secondary"
                        className="mb-2"
                      >
                        {project.title}
                      </Typography>
                    </div>

                    {/* Stars and forks display - horizontal, right-aligned */}
                    <div
                      className={cn(
                        "flex items-center gap-4 justify-end min-w-[120px]",
                        project.isPinned ? "mt-8" : "",
                      )}
                    >
                      {project.forks > 0 && (
                        <div className="flex items-center gap-1">
                          <GitFork
                            size={14}
                            style={{ color: SITE_BTN_COLOR }}
                          />
                          <Typography
                            variant="caption"
                            style={{ color: SITE_TEXT_COLOR }}
                          >
                            {project.forks}
                          </Typography>
                        </div>
                      )}
                      {project.stars > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={14} style={{ color: SITE_BTN_COLOR }} />
                          <Typography
                            variant="caption"
                            style={{ color: SITE_TEXT_COLOR }}
                          >
                            {project.stars}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <Typography variant="body1" gutterBottom className="mb-4">
                    {project.description}
                  </Typography>

                  {/* Languages display - horizontal layout */}
                  {project.languages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {project.languages
                        .slice(0, LANGUAGES_DISPLAYED)
                        .map((lang, langIndex) => (
                          <div
                            key={langIndex}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: getLanguageColor(lang.name),
                              }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: SITE_TEXT_COLOR }}
                            >
                              {lang.name}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: SITE_TEXT_COLOR }}
                            >
                              ({lang.percentage}%)
                            </span>
                          </div>
                        ))}
                      {project.languages.length > LANGUAGES_DISPLAYED && (
                        <span
                          className="text-sm"
                          style={{ color: SITE_TEXT_COLOR }}
                        >
                          +{project.languages.length - LANGUAGES_DISPLAYED} more
                        </span>
                      )}
                    </div>
                  )}

                  {project.tech.length > 0 && (
                    <div className={cn("flex flex-wrap gap-2 mb-6")}>
                      {project.tech.slice(0, 4).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          style={{
                            backgroundColor: SITE_BTN_COLOR,
                            color: CANVAS_COLOR,
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 border-0 hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundColor: `${SITE_BTN_COLOR}20`,
                        color: SITE_BTN_COLOR,
                        borderColor: SITE_BTN_COLOR,
                      }}
                    >
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={16} className="mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.homepage && (
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="flex-1 hover:scale-105 transition-transform duration-300"
                        style={{
                          backgroundColor: SITE_BTN_COLOR,
                          color: CANVAS_COLOR,
                        }}
                      >
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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

      <div className="text-center mt-8">
        <Button
          variant="outline"
          asChild
          className="border-0 hover:scale-105 transition-transform duration-300"
          style={{
            backgroundColor: `${SITE_BTN_COLOR}20`,
            color: SITE_BTN_COLOR,
            borderColor: SITE_BTN_COLOR,
          }}
        >
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
  );
}
