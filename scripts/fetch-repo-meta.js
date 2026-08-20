/**
 * Node / JS utility script for fetching GitHub repository metadata
 * Usage: node scripts/fetch-repo-meta.js https://github.com/owner/repo
 */

async function fetchRepoMeta(inputUrl) {
  if (!inputUrl) {
    console.error('Usage: node scripts/fetch-repo-meta.js <github-repo-url>');
    process.exit(1);
  }

  const cleanUrl = inputUrl.trim().replace(/\/$/, '');
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || cleanUrl.match(/^([^/]+)\/([^/]+)$/);

  if (!match) {
    console.error('Invalid GitHub repository URL format. Example: https://github.com/Sanmati-Ukhalkar/jobpilot');
    process.exit(1);
  }

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SanmatiPortfolio-Curator'
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const result = {
      name: data.name || repo,
      description: data.description || '',
      category: data.language ? `${data.language} Application` : 'Software Project',
      stack: [data.language, ...(data.topics || [])].filter(Boolean),
      repoUrl: data.html_url || `https://github.com/${owner}/${repo}`,
      githubMeta: {
        stars: data.stargazers_count || 0,
        language: data.language || 'Python',
        pushedAt: data.pushed_at || new Date().toISOString(),
        fetchedAt: new Date().toISOString()
      }
    };

    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    console.error('Failed to fetch repo metadata:', err.message);
    process.exit(1);
  }
}

if (process.argv[2]) {
  fetchRepoMeta(process.argv[2]);
}

module.exports = { fetchRepoMeta };
