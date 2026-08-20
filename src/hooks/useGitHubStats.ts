import { useEffect, useState } from 'react';

interface GitHubStats {
  publicRepos: number;
  followers: number;
  topLanguage: string | null;
}

/**
 * Fetches a couple of derived stats from the public, unauthenticated GitHub
 * REST API (no token needed, rate-limited to 60 req/hr/IP — plenty for a
 * personal site). Fails silently: the stat strip just doesn't render rather
 * than showing an error, since this is a nice-to-have flourish.
 */
export function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');

        const user = await userRes.json();
        const repos: Array<{ language: string | null; fork: boolean }> = await reposRes.json();

        const languageCounts = new Map<string, number>();
        for (const repo of repos) {
          if (repo.fork || !repo.language) continue;
          languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
        }
        let topLanguage: string | null = null;
        let max = 0;
        for (const [lang, count] of languageCounts) {
          if (count > max) { max = count; topLanguage = lang; }
        }

        if (!cancelled) {
          setStats({
            publicRepos: user.public_repos ?? 0,
            followers: user.followers ?? 0,
            topLanguage,
          });
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => { cancelled = true; };
  }, [username]);

  return { stats, error };
}
