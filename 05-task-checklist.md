# Master Checklist (execution order)

Use this as the single tracker. Check off in order — later items assume earlier ones
are in place (e.g. Tier 2 blueprint modal assumes Tier 1's `projects.json` schema exists).

## Phase 0 — Setup
- [x] Confirm actual current stack (framework, whether GSAP/ScrollTrigger already present)
- [x] Create `/data/projects.json` and `/data/meta.json` per schema in `01-architecture.md`
- [x] Backfill `projects.json` with existing 8 visible projects — metadata & architecture nodes included

## Phase 1 — Tier 1
- [x] Build `src/lib/fetchRepoMeta.ts` (GitHub REST API fetch utility)
- [x] Build `/admin` panel (form, fetch, save, list/edit/remove, ticker editor)
- [x] Wire public Projects component to read from `projects.json`
- [x] Define `avatar-states.json` (5 zones)
- [x] Build `AvatarCompanion.tsx` scroll-state controller with crossfade & `prefers-reduced-motion` support
- [x] Add `active` state highlighting to `LineSidebar.tsx` / `useActiveSection.ts` (40% viewport height threshold)
- [x] Verify: add a test project end-to-end via `/admin` in under 2 minutes

## Phase 2 — Tier 2
- [x] Add `architecture.nodes` data for existing projects via `/admin` / `projects.json`
- [x] Build `ArchDiagramModal.tsx` (Blueprint Modal with dynamic node arrows, `Esc` key & backdrop click dismissal)
- [x] Wire blueprint pills to open modal with correct project data
- [x] Build pipeline `idle/running/complete` state machine
- [x] Build stage-activation stagger animation
- [x] Build stat count-up utility (`requestAnimationFrame`)
- [x] Wire Reset button
- [x] Generalize `HowIThink.tsx` to support multiple cases (3 real case studies with tab selector)

## Phase 3 — Tier 3
- [x] Build `ActivityTicker.tsx` + `/admin` fields for `meta.json`
- [x] Add CTA copy + duplicate Download CV button to Contact section (`Footer.tsx`)
- [x] Full mobile pass across every section (see `04-tier3-trust-and-conversion.md` §3C)

## Phase 4 — Final QA
- [x] `prefers-reduced-motion` respected across Avatar, Pipeline, Nav transitions
- [x] No layout shift introduced by any new component
- [x] No color/font values changed anywhere in the diff
- [x] Full scroll-through desktop + mobile with no console errors (`npm run build` code 0)
