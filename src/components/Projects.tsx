import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

// ── AI / Data Science projects ───────────────────────────────────────────────
const aiProjects = [
  {
    name: 'Predictive Analytics Model',
    description: 'Machine learning model for predicting customer churn with 92% accuracy.',
    tags: ['Python', 'Scikit-learn', 'Pandas'],
    image: '/images/projects/healthcare-chatbot.png',
  },
  {
    name: 'Computer Vision Pipeline',
    description: 'Real-time object detection and classification system for manufacturing.',
    tags: ['PyTorch', 'OpenCV', 'YOLO'],
    image: '/images/projects/arts-studio.png',
  },
  {
    name: 'NLP Sentiment Analyzer',
    description: 'Sentiment analysis on large datasets of customer reviews using transformer models.',
    tags: ['Transformers', 'TensorFlow', 'Python'],
    image: '/images/projects/event-management.png',
  },
];

// ── Live client web projects ──────────────────────────────────────────────────
const liveProjects = [
  {
    label: 'E-Commerce Platform',
    title: 'Kalarth Canvas',
    description: 'Premium art e-commerce platform for artwork sales & order management with admin dashboard, Supabase backend, and GSAP animations.',
    tags: ['React.js', 'TypeScript', 'Supabase', 'Framer Motion', 'GSAP', 'Tailwind'],
    url: 'https://kalarthartstudio.com/',
  },
  {
    label: 'Business Website',
    title: 'Atlaren Services',
    description: 'Responsive business website showcasing software development services with SEO-friendly page structure and interactive animations.',
    tags: ['React.js', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion'],
    url: 'https://atlaren.com/',
  },
  {
    label: 'Drone Platform',
    title: 'XroneTech',
    description: 'Drone manufacturing & rental services platform with full product catalogue, inquiry system, and company showcase.',
    tags: ['React.js', 'Tailwind', 'Vite'],
    url: 'https://xronetech.com/',
  },
  {
    label: 'Import / Export',
    title: 'Groww Internationals',
    description: 'Import/export business website with service listings, contact workflows, and professional corporate presentation.',
    tags: ['React.js', 'Tailwind', 'TypeScript'],
    url: 'https://growwinternationals.com/',
  },
];

// ── Live preview card ─────────────────────────────────────────────────────────
interface LiveCardProps {
  project: typeof liveProjects[0];
  /** tall = bigger card, normal = shorter card */
  size: 'tall' | 'normal';
}

const LiveCard = ({ project, size }: LiveCardProps) => {
  const [active, setActive] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detect if the iframe was blocked (most sites set X-Frame-Options)
  const handleIframeLoad = () => {
    try {
      // If we can access contentDocument it loaded; if null the browser blocked it
      const doc = iframeRef.current?.contentDocument;
      if (doc === null) setBlocked(true);
    } catch {
      setBlocked(true);
    }
  };

  const previewHeight = size === 'tall' ? 520 : 380;

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0a0812] transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.25)]"
      style={{ height: previewHeight }}
    >
      {/* ── iframe live preview ── */}
      <div className="relative flex-1 overflow-hidden bg-[#06040f]">
        {/* Scale trick: render iframe at 2× dimensions, scale down to 50% */}
        {!blocked ? (
          <iframe
            ref={iframeRef}
            src={project.url}
            title={project.title}
            onLoad={handleIframeLoad}
            onError={() => setBlocked(true)}
            style={{
              width: '200%',
              height: '200%',
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
              border: 'none',
              pointerEvents: active ? 'auto' : 'none',
              display: 'block',
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          /* Fallback: thum.io screenshot */
          <img
            src={`https://image.thum.io/get/width/1200/crop/800/noanimate/${project.url}`}
            alt={project.title}
            className="w-full h-full object-cover object-top"
          />
        )}

        {/* Gradient overlay (fades at bottom to merge with card body) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 55%, #0a0812 100%)',
            zIndex: 2,
          }}
        />

        {/* "Click to interact" overlay — removed once user clicks */}
        {!active && !blocked && (
          <button
            onClick={() => setActive(true)}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 cursor-pointer group/btn"
            style={{ background: 'rgba(6,4,15,0.0)' }}
            aria-label="Enable interaction"
          >
            <span
              className="px-4 py-2 rounded-full text-xs font-mono tracking-widest border border-purple-500/30 bg-black/40 text-purple-300 backdrop-blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            >
              Click to interact
            </span>
          </button>
        )}

        {/* Live dot badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">Live</span>
        </div>

        {/* Visit button (top right) */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/60 transition-all duration-200"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          <span className="text-[9px] font-mono uppercase tracking-widest">Open</span>
        </a>
      </div>

      {/* ── Card info footer ── */}
      <div className="flex-shrink-0 px-5 pt-3 pb-4 border-t border-white/[0.05]">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-0.5">
              {project.label}
            </span>
            <h3 className="text-base font-bold text-white leading-tight">{project.title}</h3>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 mt-1 text-purple-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-white/40 leading-relaxed mb-2.5 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(t => (
            <span
              key={t}
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-purple-500/20 bg-purple-500/8 text-purple-400/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Projects component ────────────────────────────────────────────────────────
const Projects = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'web'>('ai');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [tabsVisible, setTabsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [liveVisible, setLiveVisible] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  // AI card scroll reveal
  useEffect(() => {
    if (activeTab !== 'ai') return;
    setVisibleCards(aiProjects.map(() => false));
    const t = setTimeout(() => {
      cardRefsArr.current.forEach((el, i) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards(prev => { const next = [...prev]; next[i] = true; return next; });
              obs.disconnect();
            }
          },
          { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );
        obs.observe(el);
      });
    }, 60);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Live section reveal
  useEffect(() => {
    if (activeTab !== 'web' || !liveRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLiveVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(liveRef.current);
    return () => obs.disconnect();
  }, [activeTab]);

  // Heading + tabs one-time reveal
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setHeadingVisible(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      obs.observe(headingRef.current);
      observers.push(obs);
    }
    if (tabsRef.current) {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setTabsVisible(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      obs.observe(tabsRef.current);
      observers.push(obs);
    }
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="py-20 px-4 sm:px-8 bg-background-secondary">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`text-4xl lg:text-5xl font-bold text-center mb-10 reveal${headingVisible ? ' reveal-visible' : ''}`}
        >
          Projects
        </h2>

        {/* Tabs */}
        <div
          ref={tabsRef}
          className={`flex justify-center gap-4 mb-12 reveal reveal-delay-1${tabsVisible ? ' reveal-visible' : ''}`}
        >
          {(['ai', 'web'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab === 'ai' ? 'AI & Data Science' : 'Live Client Projects'}
            </button>
          ))}
        </div>

        {/* ── AI tab ── */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiProjects.map((project, index) => (
              <div
                key={index}
                ref={el => { cardRefsArr.current[index] = el; }}
                className={`bg-card border border-border rounded-lg overflow-hidden hover-lift-shadow group reveal-scale reveal-delay-${Math.min(index + 1, 8)}${visibleCards[index] ? ' reveal-visible' : ''}`}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, ti) => (
                      <span key={ti} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Live Web tab — iframe previews ── */}
        {activeTab === 'web' && (
          <div
            ref={liveRef}
            className={`reveal${liveVisible ? ' reveal-visible' : ''}`}
          >
            {/* Row 1: Big (left 58%) + Normal (right 40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-5 mb-5">
              <LiveCard project={liveProjects[0]} size="tall" />
              <LiveCard project={liveProjects[1]} size="normal" />
            </div>
            {/* Row 2: Normal (left 40%) + Big (right 58%) — alternated */}
            <div className="grid grid-cols-1 lg:grid-cols-[42fr_58fr] gap-5">
              <LiveCard project={liveProjects[2]} size="normal" />
              <LiveCard project={liveProjects[3]} size="tall" />
            </div>

            <p className="text-center text-xs font-mono text-muted-foreground/40 mt-6">
              ↑ Hover a card and click "Click to interact" to browse the live site inline
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;