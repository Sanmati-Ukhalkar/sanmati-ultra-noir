import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const GLOW_COLOR = '168, 85, 247';
const SPOTLIGHT_RADIUS = 340;

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProjectCard {
  label: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  /** Thumbnail URL shown as fallback (thum.io, screenshot API, etc.) */
  thumbUrl?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const calcSpotlight = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const setGlowProps = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  intensity: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mouseX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((mouseY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', intensity.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// ── Global spotlight ─────────────────────────────────────────────────────────

const GlobalSpotlight = ({ gridRef }: { gridRef: React.RefObject<HTMLDivElement> }) => {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const el = document.createElement('div');
    el.className = 'bento-global-spotlight';
    el.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;
      pointer-events:none;
      background:radial-gradient(circle,
        rgba(${GLOW_COLOR},0.15) 0%,rgba(${GLOW_COLOR},0.08) 15%,
        rgba(${GLOW_COLOR},0.04) 25%,rgba(${GLOW_COLOR},0.02) 40%,
        transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(el);
    spotRef.current = el;

    const onMove = (e: MouseEvent) => {
      if (!gridRef.current || !spotRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll<HTMLElement>('.bento-project-card');
      if (!inside) {
        gsap.to(spotRef.current, { opacity: 0, duration: 0.3 });
        cards.forEach(c => c.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calcSpotlight(SPOTLIGHT_RADIUS);
      let minDist = Infinity;

      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dist = Math.max(0,
          Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2);
        minDist = Math.min(minDist, dist);
        const gi = dist <= proximity ? 1
          : dist <= fadeDistance ? (fadeDistance - dist) / (fadeDistance - proximity)
          : 0;
        setGlowProps(card, e.clientX, e.clientY, gi, SPOTLIGHT_RADIUS);
      });

      gsap.to(spotRef.current, { left: e.clientX, top: e.clientY, duration: 0.1 });
      const targetOpacity =
        minDist <= proximity ? 0.8
        : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8
        : 0;
      gsap.to(spotRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5 });
    };

    const onLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>('.bento-project-card')
        .forEach(c => c.style.setProperty('--glow-intensity', '0'));
      if (spotRef.current) gsap.to(spotRef.current, { opacity: 0, duration: 0.3 });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spotRef.current?.parentNode?.removeChild(spotRef.current);
    };
  }, [gridRef]);

  return null;
};

// ── Single bento project card ────────────────────────────────────────────────

const BentoProjectCard = ({
  project,
  isMobile,
}: {
  project: ProjectCard;
  isMobile: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef(false);

  // Spawn particles on hover
  const spawnParticles = useCallback(() => {
    if (isMobile || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    Array.from({ length: 10 }).forEach((_, i) => {
      const t = setTimeout(() => {
        if (!hoveredRef.current || !cardRef.current) return;
        const p = document.createElement('div');
        p.className = 'bento-particle';
        p.style.cssText = `
          left:${Math.random() * width}px;top:${Math.random() * height}px;
          background:rgba(${GLOW_COLOR},1);
          box-shadow:0 0 6px rgba(${GLOW_COLOR},0.6);`;
        cardRef.current.appendChild(p);
        particlesRef.current.push(p);
        gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(p, { x: (Math.random()-0.5)*80, y: (Math.random()-0.5)*80, rotation: Math.random()*360, duration: 2, ease: 'none', repeat: -1, yoyo: true });
        gsap.to(p, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, i * 80);
      timersRef.current.push(t);
    });
  }, [isMobile]);

  const clearParticles = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    particlesRef.current.forEach(p => {
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => p.remove() });
    });
    particlesRef.current = [];
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || isMobile) return;

    const onEnter = () => { hoveredRef.current = true; spawnParticles(); };
    const onLeave = () => { hoveredRef.current = false; clearParticles(); };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      gsap.to(el, { rotateX: ((y-cy)/cy)*-6, rotateY: ((x-cx)/cx)*6, duration: 0.1, transformPerspective: 1000 });
    };
    const onLeaveReset = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.35 });

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeaveReset);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeaveReset);
      clearParticles();
    };
  }, [isMobile, spawnParticles, clearParticles]);

  // Use thum.io for a reliable screenshot thumbnail
  const thumbSrc = project.thumbUrl
    ?? `https://image.thum.io/get/width/800/crop/500/noanimate/${project.liveUrl}`;

  return (
    <div
      ref={cardRef}
      className="bento-project-card bento-project-card--border-glow"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Live preview area */}
      <div className="bento-preview">
        <img
          src={thumbSrc}
          alt={project.title}
          loading="lazy"
          onError={e => {
            // If thumbnail fails, show gradient placeholder
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Card body */}
      <div className="bento-card-body">
        <p className="bento-card-label">{project.label}</p>
        <h3 className="bento-card-title">{project.title}</h3>
        <p className="bento-card-desc">{project.description}</p>
        <div className="bento-card-tags">
          {project.tags.map(t => (
            <span key={t} className="bento-card-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer with live link */}
      <div className="bento-card-footer">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-live-btn"
          onClick={e => e.stopPropagation()}
        >
          <span className="bento-live-dot" />
          Visit Live
        </a>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
          {new URL(project.liveUrl).hostname.replace('www.', '')}
        </span>
      </div>
    </div>
  );
};

// ── Main export ──────────────────────────────────────────────────────────────

interface MagicBentoProps {
  projects: ProjectCard[];
}

const MagicBento = ({ projects }: MagicBentoProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {!isMobile && <GlobalSpotlight gridRef={gridRef} />}
      <div className="bento-card-grid" ref={gridRef}>
        {projects.map((p, i) => (
          <BentoProjectCard key={i} project={p} isMobile={isMobile} />
        ))}
      </div>
    </>
  );
};

export default MagicBento;
