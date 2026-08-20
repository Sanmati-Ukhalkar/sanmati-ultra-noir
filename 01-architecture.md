# Architecture

## 1. Assumed current stack
Static/SSG frontend served locally on port 8080 (screenshots show hash-routing:
`localhost:8080/#projects`), with pre-built section components (Hero, About, Projects,
Pipeline Demo, How-I-Think, GitHub Contributions, Education, Skills, Contact).

If the actual stack differs from the assumption below, treat the file/folder paths as
**target structure to reproduce**, not literal existing paths — adapt the same
responsibilities to whatever framework is in place (Next.js / Vite / plain JS).

Assumed stack for this spec: Vite or Next.js (static export) + vanilla/React components +
GSAP ScrollTrigger for scroll-linked animation (already implied by existing pinned-nav
and drag-card behavior).

## 2. High-level data flow

```
GitHub repo URL (pasted by Sam)
        │
        ▼
  /admin panel  ──fetch──▶  GitHub REST API (public, unauthenticated)
        │                         │
        │◀────── repo metadata ───┘
        │  (name, description, topics, language, stars, pushed_at, html_url)
        ▼
  Sam edits: blurb, category tag, tech stack pills, featured (y/n)
        ▼
  Save ──▶ writes/updates entry in  /data/projects.json
        ▼
  Portfolio build/reads  /data/projects.json  at runtime or build time
        ▼
  Projects section + Activity ticker (Tier 3) render from same source
```

Single source of truth: **`/data/projects.json`**. Both the admin panel and the live
site read/write this one file. No database needed at this scale (a handful of curated
projects).

## 3. File/folder structure (target)

```
/data/
  projects.json          # source of truth — see schema below
  meta.json              # site-wide "last updated" timestamp, activity ticker text

/admin/
  index.html              # local-only curation panel (see 02-tier1)
  admin.js                 # fetch + form + save logic
  admin.css                 # reuse existing tokens, minimal extra styling

/src/components/
  Avatar/
    Avatar.jsx (or .js)     # scroll-state controller (see 02-tier1)
    avatar-states.json      # maps section id -> pose asset + trigger range
  Nav/
    SectionNav.jsx           # ghost-number nav, active-state highlight
  Projects/
    ProjectCard.jsx
    BlueprintModal.jsx        # Tier 2
  PipelineDemo/
    PipelineDemo.jsx           # Tier 2 run animation
  HowIThink/
    DecisionCard.jsx            # Tier 2, now supports N entries not just 1
  ActivityTicker/
    ActivityTicker.jsx           # Tier 3
  Contact/
    ContactCTA.jsx                # Tier 3

/scripts/
  fetch-repo-meta.js        # shared GitHub API fetch used by /admin
```

## 4. `projects.json` schema

```json
{
  "projects": [
    {
      "id": "jobpilot",
      "repoUrl": "https://github.com/Sanmati-Ukhalkar/jobpilot",
      "name": "JobPilot",
      "category": "Automation Platform",
      "blurb": "Self-hosted job application automation system with a semi-auto gate for LinkedIn/Indeed to avoid account bans.",
      "stack": ["FastAPI", "Next.js", "PostgreSQL", "pgvector", "n8n"],
      "featured": true,
      "architecture": {
        "blueprintAvailable": true,
        "nodes": [
          { "label": "Job Source Scraper", "detail": "Greenhouse/Lever handlers" },
          { "label": "Semi-Auto Gate", "detail": "Manual approval for LinkedIn/Indeed" },
          { "label": "Apply Orchestrator", "detail": "n8n workflow" },
          { "label": "Application Store", "detail": "PostgreSQL + pgvector" }
        ]
      },
      "githubMeta": {
        "stars": 0,
        "language": "Python",
        "pushedAt": "2026-08-10T00:00:00Z",
        "fetchedAt": "2026-08-19T00:00:00Z"
      },
      "manualOverride": true,
      "order": 1
    }
  ]
}
```

Field rules:
- `manualOverride: true` means Sam edited `blurb`/`architecture` by hand — future
  re-fetches must NOT overwrite these fields, only `githubMeta`.
- `githubMeta` fields ARE safe to auto-refresh on every admin panel load.
- `architecture.nodes` powers the Tier 2 blueprint modal — optional per project.
- `order` controls display order in the Projects section; drag-to-reorder in `/admin`
  is a nice-to-have, manual number edit is the v1 requirement.

## 5. `meta.json` schema (feeds Tier 3 activity ticker)

```json
{
  "lastShipped": {
    "text": "Shipped OpenFlow v0.9",
    "date": "2026-08-14"
  },
  "siteUpdatedAt": "2026-08-19T10:00:00Z"
}
```

Updated manually from `/admin` (a single text field + date picker) — no auto-detection
needed for v1.

## 6. GitHub API contract

```
GET https://api.github.com/repos/{owner}/{repo}
```
Returns (fields actually used):
`name, description, topics[], language, stargazers_count, pushed_at, html_url`

Rate limit: 60 req/hour unauthenticated — acceptable since this only runs when Sam is
actively curating, not on every visitor page load. Live site NEVER calls GitHub API
directly; it only reads the committed `projects.json`.

## 7. Section-to-avatar-state map (referenced by Tier 1)

| Scroll zone | Section | Avatar pose |
|---|---|---|
| 0–15% | Hero | Waving |
| 15–35% | About / ID card | Adjusting glasses / thinking |
| 35–60% | Projects / Pipeline demo | Typing / building |
| 60–80% | Skills / GitHub activity | Pointing at chart / thumbs up |
| 80–100% | Contact | Sitting back, relaxed |

This table is the contract between `avatar-states.json` and the ScrollTrigger config —
implement exactly these five zones for v1, no more.

## 8. Non-goals (explicitly out of scope)
- No CMS, no hosted database, no auth system for `/admin` (it's local-only, not deployed).
- No auto-detection of "what changed" for the ticker — manual entry only.
- No AI-generated blurbs — Sam writes her own; GitHub API only supplies raw metadata.
