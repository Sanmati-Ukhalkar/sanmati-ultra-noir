import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Attaches a subtle "magnetic pull" hover effect to the returned ref's
 * element — it nudges toward the cursor within `strength` px and snaps
 * back on mouseleave. Scoped intentionally to a couple of Hero CTAs, not a
 * full custom-cursor system.
 */
export function useMagnetic<T extends HTMLElement>(strength = 14) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect users who've asked for less motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo((relX / rect.width) * strength * 2);
      yTo((relY / rect.height) * strength * 2);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
