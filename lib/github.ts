import type { GitHubRepo, PinnedRepo, PinnedRepoConfig } from "@/types/github";
import {
  FALLBACK_PINNED_REPOS,
  FALLBACK_POPULAR_REPOS,
  MAX_LANGUAGES,
  MAX_PROJECTS,
  PINNED_REPO_CONFIGS,
} from "@/constants/github";

const GITHUB_FETCH_OPTIONS: RequestInit & { next: { revalidate: number } } = {
  headers: {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "AndrewMF-Portfolio",
  },
  next: { revalidate: 3600 },
};

export async function fetchPinnedRepos(): Promise<PinnedRepo[]> {
  try {
    const pinnedRepos = await fetchSpecificRepos(PINNED_REPO_CONFIGS, true);
    const popularRepos = await fetchPopularRepositories();

    // Filter out pinned repos from popular repos to avoid duplicates
    const pinnedUrls = pinnedRepos.map((repo) => repo.url);
    const filteredPopularRepos = popularRepos.filter(
      (repo) => !pinnedUrls.includes(repo.url),
    );

    // Combine pinned repos (first) with popular repos to reach MAX_PROJECTS
    const neededPopular = Math.max(0, MAX_PROJECTS - pinnedRepos.length);
    const selectedRepos = [
      ...pinnedRepos,
      ...filteredPopularRepos.slice(0, neededPopular),
    ].slice(0, MAX_PROJECTS);

    // Fetch languages for each repo
    const reposWithLanguages = await Promise.all(
      selectedRepos.map(async (repo) => {
        const urlParts = repo.url.split("/");
        const owner = urlParts[urlParts.length - 2];
        const repoName = urlParts[urlParts.length - 1];
        let languages = await fetchRepoLanguages(owner, repoName);

        // If languages fetch failed and this is a fallback project, use fallback languages
        if (languages.length === 0) {
          const fallbackProjects = [
            ...FALLBACK_PINNED_REPOS,
            ...FALLBACK_POPULAR_REPOS,
          ];
          const fallbackProject = fallbackProjects.find(
            (p) => p.url === repo.url,
          );
          if (fallbackProject) {
            languages = fallbackProject.languages;
          }
        }

        return {
          ...repo,
          languages,
        };
      }),
    );

    return reposWithLanguages;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return FALLBACK_PINNED_REPOS;
  }
}

async function fetchSpecificRepos(
  repoConfigs: PinnedRepoConfig[],
  isPinned: boolean,
): Promise<Omit<PinnedRepo, "languages">[]> {
  const repos: Omit<PinnedRepo, "languages">[] = [];

  for (const config of repoConfigs) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}`,
        GITHUB_FETCH_OPTIONS,
      );

      if (response.status === 403) {
        console.warn(`Rate limited for ${config.owner}/${config.repo}`);
        continue;
      }

      if (response.ok) {
        const repo: GitHubRepo = await response.json();
        repos.push({
          title: config.displayName || formatRepoName(repo.name),
          description: repo.description || "No description available",
          tech: repo.topics.slice(0, 4),
          url: repo.html_url,
          homepage: repo.homepage || undefined,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPinned,
        });
      }
    } catch (error) {
      console.error(
        `Error fetching repo ${config.owner}/${config.repo}:`,
        error,
      );
    }
  }

  return repos;
}

async function fetchPopularRepositories(): Promise<
  Omit<PinnedRepo, "languages">[]
> {
  try {
    const response = await fetch(
      "https://api.github.com/users/0xPlayerOne/repos?sort=stars&per_page=20",
      GITHUB_FETCH_OPTIONS,
    );

    if (response.status === 403) {
      console.warn("GitHub API rate limited, using fallback projects");
      return [];
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    const popularRepos = repos
      .filter(
        (repo) =>
          !repo.name.includes("0xPlayerOne") && // Exclude profile repo
          repo.description && // Must have description
          !repo.name.toLowerCase().includes("fork"), // Exclude obvious forks
      )
      .sort((a, b) => {
        // Sort by popularity (stars + forks)
        const scoreA = a.stargazers_count + a.forks_count;
        const scoreB = b.stargazers_count + b.forks_count;
        return scoreB - scoreA;
      });

    return popularRepos.map((repo) => ({
      title: formatRepoName(repo.name),
      description: repo.description || "No description available",
      tech: repo.topics.slice(0, 4),
      url: repo.html_url,
      homepage: repo.homepage || undefined,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isPinned: false,
    }));
  } catch (error) {
    console.error("Error fetching popular repos:", error);
    return FALLBACK_POPULAR_REPOS;
  }
}

async function fetchRepoLanguages(
  owner: string,
  repoName: string,
): Promise<{ name: string; percentage: number }[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/languages`,
      GITHUB_FETCH_OPTIONS,
    );

    if (response.status === 403) {
      console.warn(`Rate limited for languages ${owner}/${repoName}`);
      return [];
    }

    if (!response.ok) {
      return [];
    }

    const languages: Record<string, number> = await response.json();
    const total = Object.values(languages).reduce(
      (sum, bytes) => sum + bytes,
      0,
    );

    if (total === 0) return [];

    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, MAX_LANGUAGES);
  } catch (error) {
    console.error(`Error fetching languages for ${owner}/${repoName}:`, error);
    return [];
  }
}

function formatRepoName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
