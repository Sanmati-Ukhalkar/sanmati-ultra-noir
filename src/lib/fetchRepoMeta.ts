/**
 * Helper utility to fetch public repository metadata from GitHub REST API
 * GET https://api.github.com/repos/{owner}/{repo}
 */

export interface GitHubRepoMeta {
  stars: number;
  language: string;
  pushedAt: string;
  fetchedAt: string;
}

export interface FetchedRepoData {
  name: string;
  description: string;
  category: string;
  stack: string[];
  repoUrl: string;
  githubMeta: GitHubRepoMeta;
}

export async function fetchRepoMeta(inputUrl: string): Promise<FetchedRepoData> {
  // Extract owner and repo from URL (e.g., https://github.com/Sanmati-Ukhalkar/jobpilot or Sanmati-Ukhalkar/jobpilot)
  const cleanUrl = inputUrl.trim().replace(/\/$/, '');
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || cleanUrl.match(/^([^/]+)\/([^/]+)$/);

  if (!match) {
    throw new Error('Invalid GitHub repository URL. Format should be: https://github.com/owner/repo or owner/repo');
  }

  const owner = match[1];
  const repo = match[2];

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Repository "${owner}/${repo}" not found on GitHub.`);
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait or edit metadata manually.');
    }
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  const data = await response.json();

  const stackPills: string[] = [];
  if (data.language) stackPills.push(data.language);
  if (Array.isArray(data.topics)) {
    data.topics.forEach((topic: string) => {
      // Clean up topic names for stack pills
      const formatted = topic.charAt(0).toUpperCase() + topic.slice(1);
      if (!stackPills.includes(formatted)) stackPills.push(formatted);
    });
  }

  return {
    name: data.name || repo,
    description: data.description || '',
    category: data.language ? `${data.language} Application` : 'Software Project',
    stack: stackPills.length > 0 ? stackPills : ['Python'],
    repoUrl: data.html_url || `https://github.com/${owner}/${repo}`,
    githubMeta: {
      stars: data.stargazers_count || 0,
      language: data.language || 'Python',
      pushedAt: data.pushed_at || new Date().toISOString(),
      fetchedAt: new Date().toISOString()
    }
  };
}
