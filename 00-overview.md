# Portfolio v2 — Overview & Execution Order

## What this is
A task spec set for upgrading Sanmati Ukhalkar's portfolio (`localhost:8080`) from a
static-feeling site into a scroll-driven, self-updating showcase. Existing brand colors,
fonts, and layout system stay untouched — this is a **feature and motion upgrade**, not
a redesign.

## File map (read/execute in this order)

| File | Purpose |
|---|---|
| `01-architecture.md` | System-level architecture: data flow, file/folder structure, tech decisions |
| `02-tier1-content-engine-and-motion.md` | Repo-curation admin (Option B-1) + avatar scroll states + nav/section motion |
| `03-tier2-depth-features.md` | Architecture blueprint modals, pipeline run animation, expanded "How I Think" |
| `04-tier3-trust-and-conversion.md` | Contact CTA, activity ticker, mobile pass |
| `05-task-checklist.md` | Flat, ordered checklist across all tiers — use this as the execution tracker |

## Non-negotiables (apply to every file below)
- **No color/gradient changes.** Reuse existing CSS variables/tokens as-is.
- **No new fonts.** Reuse existing serif display + body font pair.
- **No backend rewrite.** Option B-1 uses a minimal local JSON + small fetch script —
  not a new database or hosted service, unless explicitly stated in `02`.
- Every new animation must degrade gracefully (no motion = still usable site).
- Every new section must work at mobile width (390px) before being marked done.

## Priority logic
Tier 1 is first because the repo-curation engine is what keeps every other tier's
content honest (fresh projects, real "last updated" data feeds Tier 3's activity ticker).
Motion work is bundled into Tier 1 because the avatar/nav states are cheap, high-visibility
wins that should ship alongside the content engine, not after it.

## Definition of done (whole project)
1. Adding a new project = pasting a GitHub URL into `/admin`, editing 2-3 fields, clicking save.
2. Avatar visibly changes pose across at least 4 scroll zones.
3. Blueprint buttons open a real diagram, not a dead link.
4. Pipeline "Run" button animates a sequence, not just static cards.
5. Site passes a manual mobile scroll-through with no broken interactions.
