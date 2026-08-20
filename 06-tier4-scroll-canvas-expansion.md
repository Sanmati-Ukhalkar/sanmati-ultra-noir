# Tier 4 — Scroll-Canvas Expansion

Extends the Hero's `useScrollFrameSequence` + `HeroCanvas` pattern to other sections,
without repeating its memory cost site-wide. This generalizes an existing hook rather
than building new ones per-section.

---

## 1. Where this pattern earns its cost (ranked)

Frame-sequence canvas is expensive (asset weight + decode + RAM). Use it only where
scroll-scrubbed visual storytelling genuinely beats GSAP tweening a few DOM elements.

| Rank | Section | Why | Frame count (suggested) |
|---|---|---|---|
| 1 | **Avatar Companion** | Currently 5 static crossfades (`typing→think→point→celebrate→wave`). Upgrading to a real scrubbed sequence turns 5 hard poses into one continuous performance — this is the single highest-impact upgrade left on the whole site. | 40-50 |
| 2 | **Pipeline Widget** | Replace/augment the SVG travelling-dot with an actual scrubbed data-flow animation (packets moving through ETL stages) when the section enters view and user scrolls through it. | 30 |
| 3 | **Footer/Contact close** | A short closing beat (avatar settling, "let's connect" reveal) as a scroll payoff at the very bottom. Optional — only if 1 and 2 ship clean first. | 15-20 |

Everything else (Projects grid, How I Think, GitHub heatmap, Education, Skills) stays
on GSAP DOM tweening — no canvas needed there, and adding it would be motion for its
own sake, not signal.

---

## 2. Reuse strategy — generalize, don't duplicate

### Hook generalization
`useScrollFrameSequence` currently appears Hero-specific. Refactor its signature to
accept a config object so every section instance shares one implementation:

```ts
useScrollFrameSequence({
  framePathTemplate: string,   // e.g. "/assets/avatar-sequence/frame_%03d.webp"
  frameCount: number,
  pinDistanceVh: number,       // scroll distance the sequence scrubs across
  windowSize: number,          // active frames kept in RAM (default 30, lower for smaller sequences)
  container: RefObject,        // the section's scroll trigger target
  autoStart: "immediate" | "on-enter-viewport"
})
```

- [ ] Extract current Hero-specific logic into this generalized signature.
- [ ] Hero keeps `autoStart: "immediate"` (preload at page load, as now).
- [ ] Avatar and Pipeline instances use `autoStart: "on-enter-viewport"` — only start
      preloading frames once an `IntersectionObserver` confirms the section is within
      ~1 viewport of scroll position. This is the key guardrail that prevents 3x the
      hero's memory cost on page load.

### Concurrency cap
- [ ] Only ONE frame-sequence instance may hold its active RAM window at a time outside
      of Hero. When Pipeline's sequence enters view, evict Avatar's window down to a
      single held frame (its current pose), and vice versa. Hero's own window can evict
      once the user scrolls past it entirely.

### Asset generation
- [ ] Generalize `scripts/generate-hero-sequence.js` → `scripts/generate-sequence.js`
      accepting `--source`, `--outDir`, `--frameCount`, `--quality` flags, so Avatar and
      Pipeline sequences are produced the same way Hero's were, not a new one-off script per section.

---

## 3. Avatar Companion — specific upgrade

- [ ] Replace the 5-pose crossfade map (`avatar-states.json`) with a single continuous
      sequence covering the same narrative beats (wave → think → type/build → point →
      celebrate → settle), scrubbed by overall page scroll % rather than discrete zone
      snapping.
- [ ] Keep `avatar-states.json` as the *authoring* reference (which frame ranges
      correspond to which narrative beat) even though rendering is now continuous —
      useful for QA and for anyone re-scrubbing the timeline later.
- [ ] Fallback: if `prefers-reduced-motion` is set, or on low-end/mobile (use a simple
      device-memory or viewport-width check), fall back to the existing 5-pose static
      crossfade instead of the full sequence. Don't force heavy canvas work on constrained devices.

## 4. Pipeline Widget — specific upgrade

- [ ] Sequence plays once triggered by **Run Pipeline** (not by scroll-scrub, since this
      widget's existing interaction model is click-to-run, not passive scroll) — use
      `useScrollFrameSequence` in a "play-through" mode rather than scroll-linked mode
      here: same frame-window/eviction machinery, different trigger source (button click
      + timeline instead of scroll position).
- [ ] Keep existing stat count-ups and stage-card lighting (already built) running in
      sync alongside the new canvas layer, not replaced by it — canvas is the backdrop,
      cards+stats remain the primary readable data.

---

## 5. Performance guardrails (apply to all new instances)

- [ ] Total simultaneous decoded frames across the whole page, at any scroll position,
      must not exceed roughly the Hero's existing budget alone (~30 frames). The
      concurrency cap in §2 enforces this.
- [ ] All new sequences ship as WebP, same compression settings as Hero's existing 60 frames.
- [ ] Lazy-load: no sequence outside Hero fetches a single frame until its section is
      within 1 viewport of the scroll position.
- [ ] Confirm via browser dev tools memory profiler that scrolling through the full page
      does not show unbounded memory growth — window eviction must actually free
      previous frames, not just stop referencing them.

---

## 6. Acceptance criteria

- Avatar section shows continuous scrubbed motion, not discrete pose jumps, on desktop
  and non-reduced-motion mobile.
- Pipeline sequence plays cleanly on Run without stuttering, and resets cleanly.
- Page memory profile stays flat (no runaway growth) scrolling top to bottom twice in a row.
- Reduced-motion and low-end fallbacks verified to actually engage (not silently skipped).
