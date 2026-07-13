import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Database, Globe } from 'lucide-react';

type ProjectType = 'ai' | 'web';

interface Project {
  id: string;
  type: ProjectType;
  label: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  image?: string;
}

const allProjects: Project[] = [
  // ── WEB PROJECTS ──
  {
    id: 'web-kalarth',
    type: 'web',
    label: 'E-Commerce Platform',
    title: 'Kalarth Canvas',
    description: 'Premium art e-commerce platform for artwork sales & order management with admin dashboard, Supabase backend, and GSAP animations.',
    tags: ['React.js', 'TypeScript', 'Supabase', 'Framer Motion', 'GSAP', 'Tailwind'],
    url: 'https://kalarthartstudio.com/',
  },
  {
    id: 'web-atlaren',
    type: 'web',
    label: 'Business Website',
    title: 'Atlaren Services',
    description: 'Responsive business website showcasing software development services with SEO-friendly page structure and interactive animations.',
    tags: ['React.js', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion'],
    url: 'https://atlaren.com/',
  },
  {
    id: 'web-xrone',
    type: 'web',
    label: 'Drone Platform',
    title: 'XroneTech',
    description: 'Drone manufacturing & rental services platform with full product catalogue, inquiry system, and company showcase.',
    tags: ['React.js', 'Tailwind', 'Vite'],
    url: 'https://xronetech.com/',
  },
  {
    id: 'web-groww',
    type: 'web',
    label: 'Import / Export',
    title: 'Groww Internationals',
    description: 'Import/export business website with service listings, contact workflows, and professional corporate presentation.',
    tags: ['React.js', 'Tailwind', 'TypeScript'],
    url: 'https://growwinternationals.com/',
  },
  // ── AI PROJECTS ──
  {
    id: 'ai-predictive',
    type: 'ai',
    label: 'Machine Learning',
    title: 'Predictive Analytics Model',
    description: 'Machine learning model for predicting customer churn with 92% accuracy using advanced statistical techniques.',
    tags: ['Python', 'Scikit-learn', 'Pandas'],
    image: '/images/projects/healthcare-chatbot.png',
  },
  {
    id: 'ai-cv',
    type: 'ai',
    label: 'Computer Vision',
    title: 'Computer Vision Pipeline',
    description: 'Real-time object detection and classification system for manufacturing and quality assurance.',
    tags: ['PyTorch', 'OpenCV', 'YOLO'],
    image: '/images/projects/arts-studio.png',
  },
  {
    id: 'ai-nlp',
    type: 'ai',
    label: 'NLP',
    title: 'NLP Sentiment Analyzer',
    description: 'Sentiment analysis on large datasets of customer reviews using state-of-the-art transformer models.',
    tags: ['Transformers', 'TensorFlow', 'Python'],
    image: '/images/projects/event-management.png',
  },
];

// ── Unified Project Card ───────────────────────────────────────────────────────
interface UnifiedCardProps {
  project: Project;
  spanClass: string;
  idx: number;
}

const UnifiedCard = ({ project, spanClass, idx }: UnifiedCardProps) => {
  const isWeb = project.type === 'web';
  const [active, setActive] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Scroll reveal observer
  useEffect(() => {
    if (!cardRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const handleIframeLoad = () => {
    try {
      if (iframeRef.current?.contentDocument === null) setBlocked(true);
    } catch {
      setBlocked(true);
    }
  };

  // Theme definition
  const theme = isWeb
    ? {
        hoverBorder: 'hover:border-purple-500/40',
        shadow: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
        accentText: 'text-purple-400',
        badgeBg: 'bg-purple-500/10',
        badgeBorder: 'border-purple-500/20',
        badgeText: 'text-purple-400/80',
        icon: <Globe className="w-3 h-3 text-emerald-400" />,
        typeLabel: 'Live Client Web',
      }
    : {
        hoverBorder: 'hover:border-cyan-500/40',
        shadow: 'hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]',
        accentText: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10',
        badgeBorder: 'border-cyan-500/20',
        badgeText: 'text-cyan-400/80',
        icon: <Database className="w-3 h-3 text-cyan-400" />,
        typeLabel: 'AI / Data Science',
      };

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col rounded-xl overflow-hidden border border-white/[0.07] bg-[#0a0812] smooth-reveal transform ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      } ${theme.hoverBorder} ${theme.shadow} ${spanClass}`}
      style={{ transitionDelay: visible ? `${(idx % 4) * 80}ms` : '0ms' }}
    >
      {/* ── Preview Area ── */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden bg-[#06040f]">
        {isWeb ? (
          <>
            {!blocked && project.url ? (
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
              <img
                src={`https://image.thum.io/get/width/1200/crop/800/noanimate/${project.url}`}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />
            )}

            {!active && !blocked && (
              <button
                onClick={() => setActive(true)}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 cursor-pointer group/btn"
                style={{ background: 'rgba(6,4,15,0.0)' }}
              >
                <span className="px-4 py-2 rounded-full text-xs font-mono tracking-widest border border-purple-500/30 bg-black/40 text-purple-300 backdrop-blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                  Click to interact
                </span>
              </button>
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-[9px] font-mono uppercase tracking-widest">Open</span>
              </a>
            )}
          </>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Gradient overlay to blend with footer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, #0a0812 100%)', zIndex: 2 }}
        />

        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          {theme.icon}
          <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">
            {theme.typeLabel}
          </span>
        </div>
      </div>

      {/* ── Card Info Footer ── */}
      <div className="flex flex-col flex-1 px-6 pt-2 pb-6 border-t border-white/[0.03]">
        <span className={`block text-[9px] font-mono uppercase tracking-[0.2em] ${theme.accentText} opacity-80 mb-1.5`}>
          {project.label}
        </span>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{project.title}</h3>
          {isWeb && project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={`flex-shrink-0 mt-1 ${theme.accentText} hover:text-white transition-colors`}>
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
        <p className="text-sm text-white/40 leading-relaxed mb-5 line-clamp-2 flex-1">{project.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.map((t) => (
            <span
              key={t}
              className={`text-[9px] font-mono px-2.5 py-1 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Projects Component ────────────────────────────────────────────────────────
const Projects = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setHeadingVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(headingRef.current);
      return () => obs.disconnect();
    }
  }, []);

  // Custom spanning for the bento grid look (7 total items)
  const getSpanClass = (index: number) => {
    switch (index) {
      case 0: return 'md:col-span-7';   // Web 1 (Wide)
      case 1: return 'md:col-span-5';   // Web 2 (Narrow)
      case 2: return 'md:col-span-5';   // Web 3 (Narrow)
      case 3: return 'md:col-span-7';   // Web 4 (Wide)
      case 4: return 'md:col-span-6';   // AI 1 (Half)
      case 5: return 'md:col-span-6';   // AI 2 (Half)
      case 6: return 'md:col-span-12';  // AI 3 (Full width)
      default: return 'md:col-span-6';
    }
  };

  return (
    <section className="py-24 px-4 sm:px-8 bg-[#040208]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2
            ref={headingRef}
            className={`text-4xl lg:text-5xl font-bold text-center mb-4 smooth-reveal transform ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Featured Projects
          </h2>
          <p className={`text-muted-foreground text-lg text-center max-w-2xl smooth-reveal transform ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '100ms' }}>
            A unified showcase of my live web applications and machine learning experiments.
          </p>
        </div>

        {/* ── Unified Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {allProjects.map((project, idx) => (
            <UnifiedCard key={project.id} project={project} spanClass={getSpanClass(idx)} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;