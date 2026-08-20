# Tier 3 — Trust & Conversion

Goal: close the loop between "impressed visitor" and "visitor takes action" (recruiter
downloads CV / emails / clicks GitHub), plus prove the site is actively maintained.

---

## 3A. Activity ticker ("actively building" signal)

### Behavior
A small, unobtrusive line (near hero or nav) showing the latest shipped work, e.g.
"🟢 Shipped OpenFlow v0.9 — Aug 14". Pulled from `data/meta.json` (see
`01-architecture.md` §5).

### Build tasks
- [ ] `ActivityTicker.jsx`: reads `meta.json.lastShipped`, renders `text` + relative or
  formatted date. Static render, no animation required (subtlety > flash here).
- [ ] Add a 2-field form (text + date) to `/admin` to update `meta.json` without hand-editing JSON.
- [ ] Placement: small text near hero subtext or in the nav bar — must not compete
  visually with the main headline. Use existing muted-text token.

### Acceptance criteria
- Updating the ticker via `/admin` reflects on the live page without touching component code.

---

## 3B. Contact section upgrade

### Current state
"Let's Connect" heading + 3 icon-only links (GitHub, LinkedIn, Mail) + a "Check
Performance" button. No CTA copy, no CV link at the bottom despite one existing in the hero.

### Build tasks
- [ ] Add one line of CTA copy above the icons, e.g. "Open to Data Engineering & AI/ML
  roles — let's talk." Content to be finalized by Sam; component should accept it as a
  prop/config value, not hardcoded engineering-only copy.
- [ ] Duplicate the existing **Download CV** button (same asset/link as hero) into this
  section — recruiters who scroll to the bottom shouldn't have to scroll back up to convert.
- [ ] Keep icon row and "Check Performance" button as-is; only additive changes here.

### Acceptance criteria
- CV is downloadable from both hero and footer without scrolling back up.
- CTA copy is easily editable (single config value, not buried in markup).

---

## 3C. Mobile pass

### Why this is last but mandatory
None of the current review screenshots are mobile viewport. Scroll-jacking, drag-card
interactions, and fixed-position avatar are the most likely things to break on narrow
screens — this must be verified before calling any tier "done."

### Build tasks
- [ ] Test at 390px width (iPhone-class) for every section: Hero, About/ID-card drag,
  Projects grid, Pipeline demo, How I Think, GitHub heatmap, Education, Skills, Contact.
- [ ] ID-card drag interaction: confirm touch-drag works (not just mouse-drag) or provide
  a tap-to-flip/tap-to-reveal fallback on touch devices.
- [ ] GitHub contribution heatmap: confirm horizontal scroll/swipe works within its
  container without hijacking page scroll.
- [ ] Avatar (Tier 1B): confirm fixed bottom-right position doesn't overlap CTA buttons
  or get cut off at small viewport widths — resize/reposition if needed at breakpoints.
- [ ] Blueprint modal (Tier 2A) and Pipeline demo (Tier 2B): confirm both are usable with
  touch taps, not hover-dependent.
- [ ] Nav ghost-numbers (Tier 1C): confirm they either collapse to a mobile-appropriate
  pattern (e.g. hidden or condensed) or remain legible at narrow widths without overlapping content.

### Acceptance criteria
- Full scroll-through on a real phone or device emulator with no broken/overlapping
  elements and no interaction that silently fails on touch.
