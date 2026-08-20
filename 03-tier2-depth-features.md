# Tier 2 — Depth Features (Skill-Signaling)

Goal: make the interactive elements that already exist as UI shells (blueprint buttons,
Run Pipeline button) actually pay off with real content/animation, since these are the
strongest differentiators versus a template portfolio.

---

## 2A. Architecture Blueprint modal

### Current state
"Inspect Architecture Blueprint" pills (Kalarth Canvas / Atlaren Services / XroneTech /
Groww Internationals) exist but have no visible destination in current build.

### Behavior
Clicking a blueprint pill opens a modal/overlay showing a simple boxes-and-arrows system
diagram for that project, sourced from `projects.json` → `architecture.nodes` (see
`01-architecture.md` §4).

### Build tasks
- [ ] `BlueprintModal.jsx`: reads `architecture.nodes` array for the selected project,
  renders as a vertical or horizontal flow (box per node, arrow connectors between
  sequential nodes). Pure CSS/SVG — no new charting library needed for this simple case.
- [ ] Nodes render as: label (bold) + detail (muted subtext), reusing existing card
  style tokens already used elsewhere on the site (e.g. the pipeline demo's stage cards).
- [ ] Modal open/close: fade + scale-in, closable via backdrop click, `Esc`, or an ✕ button.
- [ ] If a project has no `architecture.nodes` defined, hide its blueprint pill entirely
  (don't show a dead/empty modal).
- [ ] Add `architecture.nodes` data for at least the 4 projects currently showing pills
  (Kalarth Canvas, Atlaren Services, XroneTech, Groww Internationals) via `/admin`.

### Acceptance criteria
- Every visible blueprint pill opens a populated diagram, not a blank or missing modal.
- Modal is keyboard-dismissible and doesn't trap focus incorrectly.

---

## 2B. Pipeline demo — real run animation

### Current state
"Run Pipeline" button and 4 stage cards (Raw Ingestion → Feature ETL → ML Inference →
API Response) + 4 stat cards (Throughput, Latency, Precision, Container Status) exist
but appear static in current screenshots.

### Behavior
Clicking **Run Pipeline**:
1. Stage cards light up sequentially left-to-right (150-300ms stagger per stage), each
   getting an active-state border/glow using existing accent color.
2. A connecting line/dot travels between stages as each activates (reuse the existing
   dotted connector between cards, animate a filled segment along it).
3. Stat cards count up from 0 (or from a lower baseline) to their final values
   (1292 req/sec, 14.4ms, 92.4%, "Healthy") over ~800ms-1.2s using an ease-out count-up.
4. Reset button (existing circular icon) reverts stages/stats to idle state.

### Build tasks
- [ ] `PipelineDemo.jsx`: add `idle | running | complete` state machine.
- [ ] Stage activation sequence via `setTimeout` stagger or GSAP timeline (prefer GSAP
  timeline if already a dependency, for easier sequencing/reset).
- [ ] Count-up utility for stat cards (simple requestAnimationFrame tween, no new
  library needed — this is a common ~20-line utility).
- [ ] Disable **Run Pipeline** button while `running` to prevent double-trigger; re-enable on complete.
- [ ] Respect `prefers-reduced-motion`: skip stagger/count-up, jump straight to final state.

### Acceptance criteria
- Clicking Run visibly sequences through all 4 stages before stats finish animating.
- Reset returns to a clean idle state, re-runnable without a page refresh.

---

## 2C. Expand "How I Think" to multiple entries

### Current state
One decision case study (sync DB queries + uncompressed PyTorch model → optimized
inference). Strong section, underused.

### Behavior
Support 2-3 entries, tab or accordion-selectable, each following the existing
Optimized-vs-Naive comparison format with its own metrics.

### Build tasks
- [ ] `DecisionCard.jsx`: generalize existing single-case markup to accept an array of
  case objects (title, naive approach description(s), optimized approach description(s),
  metric rows, resulting-impact text).
- [ ] Add a lightweight tab/accordion selector above the existing card if more than 1
  entry exists; hide selector entirely if only 1 (no UI regression for current state).
- [ ] Source 1-2 additional real case studies from Sam's actual project history —
  candidates: JobPilot's semi-auto gate design (avoiding LinkedIn/Indeed bans) framed as
  a trade-off decision, or OpenFlow's node audit process. Content to be supplied by Sam;
  this task only builds the structure to hold it.

### Acceptance criteria
- Switching between case entries doesn't reload the page or lose scroll position.
- Existing single-entry visual design is unchanged if only one case is present.
