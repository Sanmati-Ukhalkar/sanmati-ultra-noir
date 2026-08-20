# Tier 1 — Content Engine + Core Motion

Goal: fix the two biggest gaps — stale/manual project data, and a static avatar/nav
that don't react to scroll. Ship together; both are foundational to everything else.

---

## 1A. Repo curation admin panel (Option B-1)

### User flow
1. Sam opens `/admin` locally (not linked from public nav, not deployed publicly).
2. Pastes a GitHub repo URL into a text field, clicks **Fetch**.
3. Panel calls GitHub API (`scripts/fetch-repo-meta.js`), auto-fills:
   `name`, `description` (as draft blurb), `language`, `topics` (as draft stack pills),
   `stargazers_count`, `pushed_at`.
4. Sam edits: blurb (required, overwrite the draft), category tag, stack pills
   (add/remove), `featured` toggle, optional architecture nodes (label + detail pairs,
   add/remove rows).
5. Click **Save** → panel writes/updates the entry in `data/projects.json`
   (`manualOverride: true`, `order` = next available integer).
6. List view at top of `/admin` shows all existing projects with **Edit** / **Remove**
   / **Re-fetch metadata only** actions.

### Build tasks
- [ ] `scripts/fetch-repo-meta.js`: takes a repo URL, parses `owner/repo`, calls
  `GET https://api.github.com/repos/{owner}/{repo}`, returns normalized object matching
  the `githubMeta` + draft fields shape in `01-architecture.md` §4.
- [ ] `admin/index.html` + `admin.js`: form UI (plain HTML/JS is fine — this is a tool,
  not a showcase page). Reuse existing CSS variables for consistency but no need for
  polish equal to the public site.
- [ ] Save logic: since this is a static site with no server, implement save as either:
  - **(a) File System Access API** (`window.showSaveFilePicker` / direct write if run
    locally via a tiny Node script) to write `data/projects.json` directly, OR
  - **(b) Clipboard fallback**: generate the updated JSON, copy to clipboard, Sam pastes
    into `data/projects.json` manually and commits.
  Default to (a) if running the admin panel via a local Node dev server; fall back to
  (b) if truly static-only.
- [ ] "Re-fetch metadata only" action: re-runs the GitHub call, updates only
  `githubMeta.*` fields, leaves `blurb`/`architecture`/`stack` untouched.
- [ ] Validation: block save if `blurb` is empty or `name` is empty. Everything else optional.
- [ ] Public Projects component reads `data/projects.json` and renders in `order`,
  filtering to `featured: true` for the main grid, all others in an optional
  "More projects" collapsed list.

### Acceptance criteria
- Adding a new project end-to-end takes under 2 minutes.
- Removing a project from `/admin` removes it from the live Projects section on next build/refresh.
- Re-running fetch on an existing project never wipes a hand-written blurb.

---

## 1B. Avatar scroll-state controller

### Behavior
Avatar swaps pose across 5 scroll zones defined in `01-architecture.md` §7. Two
acceptable implementation levels — pick based on available assets:

**Level 1 (asset-light, ship first):** 5 static pose images, swapped via opacity
crossfade when scroll % crosses each zone boundary. No new illustration work needed if
frame variants of the existing avatar can be produced (even simple recolors of
expression/prop are enough — glasses angle, laptop vs no laptop, arm position).

**Level 2 (if assets available later):** Rive/Lottie state machine scrubbed by scroll
position for smoother in-between motion. Not required for v1.

### Build tasks
- [ ] Create `avatar-states.json` mapping each of the 5 zones to an asset path and
  scroll-percentage trigger range (values from `01-architecture.md` §7 table).
- [ ] `Avatar.jsx`: subscribes to scroll position (reuse existing ScrollTrigger instance
  if one already drives the nav ghost-numbers; don't create a second scroll listener).
- [ ] Crossfade transition (200-300ms opacity) between pose swaps — no hard cuts.
- [ ] Avatar position: keep existing fixed bottom-right placement; only the pose image
  changes, not layout/position, to avoid destabilizing existing CSS.
- [ ] Respect `prefers-reduced-motion`: if set, skip crossfade, hard-swap instantly or
  freeze on hero pose.

### Acceptance criteria
- Scrolling from top to bottom of the page visibly changes the avatar at least 4 times.
- No layout shift when pose changes (fixed container size, image swap only).

---

## 1C. Section nav — active-state highlight

### Current problem
The `01 Home / 02 About / 03 Projects...` ghost numbers sit static behind content —
decorative, not functional.

### Behavior
As the user scrolls past each section's trigger point, that section's nav number
transitions from ghosted (existing low-opacity style) to solid/highlighted (use
existing accent color token — no new color). Previous sections dim back down.

### Build tasks
- [ ] `SectionNav.jsx`: reuse the same ScrollTrigger markers already implied by the
  existing pinned side-nav; add an `active` class toggle per section based on
  intersection/scroll-progress threshold (section is "active" once its top crosses
  ~40% viewport height).
- [ ] Transition: opacity + font-weight change, 200ms ease — consistent with existing
  motion feel, no new animation library needed if GSAP is already present.
- [ ] Clicking a nav number still scrolls to that section (existing behavior — do not break it).

### Acceptance criteria
- Only one nav number is "active" at a time during scroll (no two simultaneously highlighted
  except during the transition frame).
- Clicking any nav number still jump-scrolls correctly.
