import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollFrameSequence } from '@/hooks/useScrollFrameSequence';
import ActivityTicker from './ActivityTicker';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { useMagnetic } from '@/hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 120;

const getFrameUrl = (index: number) => {
  const paddedIndex = String(index).padStart(3, '0');
  return `/assets/hero-sequence/frame_${paddedIndex}.webp`;
};

// Scroll-state captions mapped to frame ranges
// Each stage maps to what the 3D character is doing in that segment of the video
const SCROLL_STAGES = [
  {
    // Waving hello (frames 0-29)
    minProgress: 0,
    maxProgress: 0.25,
    emoji: '👋',
    label: 'Hey there!',
    caption: "I'm Sanmati — I build AI-driven systems and data pipelines.",
    accent: '#FF6B4A',
  },
  {
    // Working at laptop (frames 30-59)
    minProgress: 0.25,
    maxProgress: 0.50,
    emoji: '💻',
    label: 'In the zone',
    caption: 'Training models, tuning pipelines, shipping production ML at 1,250+ req/sec.',
    accent: '#22C55E',
  },
  {
    // Thinking / leaning back (frames 60-89)
    minProgress: 0.50,
    maxProgress: 0.75,
    emoji: '🧠',
    label: 'Architecting',
    caption: 'Designing scalable ETL flows, computer vision pipelines & LLM-powered features.',
    accent: '#3B82F6',
  },
  {
    // Final pose (frames 90-119)
    minProgress: 0.75,
    maxProgress: 1.0,
    emoji: '🚀',
    label: 'Shipped!',
    caption: 'OpenFlow v0.9 • JobPilot • VisionLine QA — from idea to production.',
    accent: '#A855F7',
  },
];


const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewWorkRef = useMagnetic<HTMLButtonElement>();
  const downloadCvRef = useMagnetic<HTMLButtonElement>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);

  const { currentFrameIndex, setCurrentFrameIndex, getCurrentImage, isPriorityReady } =
    useScrollFrameSequence({
      sequenceId: 'hero',
      totalFrames: TOTAL_FRAMES,
      getFrameUrl,
      windowSize: 30,
      priorityCount: 10,
    });

  // Render frame with cover-fit math
  const renderFrame = React.useCallback((_frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const dw = canvas.clientWidth, dh = canvas.clientHeight;
    if (canvas.width !== Math.round(dw * dpr) || canvas.height !== Math.round(dh * dpr)) {
      canvas.width = Math.round(dw * dpr);
      canvas.height = Math.round(dh * dpr);
      ctx.scale(dpr, dpr);
    }
    const img = getCurrentImage();
    const activeImg = (img && img.complete && img.naturalWidth > 0) ? img : lastDrawnImageRef.current;

    if (activeImg) {
      const imgAspect = activeImg.naturalWidth / activeImg.naturalHeight;
      const canvasAspect = dw / dh;
      let drawW: number, drawH: number, ox: number, oy: number;
      if (imgAspect > canvasAspect) {
        drawH = dh; drawW = drawH * imgAspect; ox = (dw - drawW) / 2; oy = 0;
      } else {
        drawW = dw; drawH = drawW / imgAspect; ox = 0; oy = (dh - drawH) / 2;
      }
      ctx.clearRect(0, 0, dw, dh);
      ctx.drawImage(activeImg, ox, oy, drawW, drawH);
      
      if (activeImg === img) {
        lastDrawnImageRef.current = img;
      }
    } else {
      // Simple ivory fill while frames are preloading — no procedural animation
      ctx.clearRect(0, 0, dw, dh);
      ctx.fillStyle = 'hsl(36, 45%, 94%)';
      ctx.fillRect(0, 0, dw, dh);
    }
  }, [getCurrentImage]);

  useEffect(() => { renderFrame(currentFrameIndex); }, [currentFrameIndex, isPriorityReady, renderFrame]);

  // GSAP ScrollTrigger pin
  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      pin: sticky,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        setCurrentFrameIndex(Math.min(TOTAL_FRAMES - 1, Math.floor(p * TOTAL_FRAMES)));
      },
    });
    return () => st.kill();
  }, [setCurrentFrameIndex]);

  // Resolve current stage based on scroll progress
  const currentStage = [...SCROLL_STAGES].reverse().find(s => scrollProgress >= s.minProgress) ?? SCROLL_STAGES[0];

  // Hero card visible only in first 40% of scroll
  const cardOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const cardTranslateY = scrollProgress * -60;

  // Stage caption band visible from 5% to 95% scroll
  const captionOpacity = scrollProgress > 0.05 && scrollProgress < 0.95
    ? Math.min(1, Math.min(scrollProgress - 0.05, 0.95 - scrollProgress) * 10)
    : 0;

  return (
    <section ref={containerRef} className="relative w-full h-[380vh] bg-background">
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden z-10 flex items-center">
        {/* Canvas Engine */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(16,24,32,0.35) 100%)',
          }}
        />

        {/* ── LEFT SIDE: Hero card (fades out as user scrolls) ── */}
        <div
          className="relative z-20 flex flex-col justify-center px-6 sm:px-10 md:px-16 w-full max-w-lg ml-0 md:ml-6 pointer-events-auto transition-all duration-200"
          style={{
            opacity: cardOpacity,
            transform: `translateY(${cardTranslateY}px)`,
          }}
        >
          <div className="bg-background/80 backdrop-blur-2xl border border-border/80 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-5">
            <div className="flex justify-start">
              <ActivityTicker />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Sanmati Ukhalkar
            </h1>

            <p className="text-base sm:text-lg text-primary font-bold tracking-wide">
              Python Developer | AI, ML &amp; Data Science
            </p>

            <p className="text-sm text-foreground/75 leading-relaxed font-medium max-w-sm">
              I build intelligent, data-driven solutions and futuristic digital experiences with a focus on machine learning and performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                ref={viewWorkRef}
                variant="hero-outline"
                size="default"
                className="text-sm px-6 bg-background border-border hover:border-primary font-semibold shadow-sm"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Work
              </Button>
              <Button
                ref={downloadCvRef}
                variant="hero"
                size="default"
                className="text-sm px-6 shadow-md font-semibold"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/documents/Sanmati_Ukhalkar_CV.pdf';
                  link.download = 'Sanmati_Ukhalkar_CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download CV 📄
              </Button>
            </div>

            <div className="flex gap-3 pt-1">
              <a href="https://www.linkedin.com/in/sanmati-ukhalkar-2657bb418/" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-background/90 border border-border hover:border-primary transition-all rounded-lg shadow-sm" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 text-foreground" />
              </a>
              <a href="https://github.com/Sanmati-Ukhalkar" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-background/90 border border-border hover:border-primary transition-all rounded-lg shadow-sm" aria-label="GitHub">
                <Github className="w-4 h-4 text-foreground" />
              </a>
              <a href="mailto:sanmatiukhalkar2004@gmail.com"
                className="p-2 bg-background/90 border border-border hover:border-primary transition-all rounded-lg shadow-sm" aria-label="Email">
                <Mail className="w-4 h-4 text-foreground" />
              </a>
            </div>

            <div className="flex flex-col items-start gap-1 animate-bounce pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                Scroll to explore
              </span>
              <ArrowDown className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>

        {/* ── SCROLL-STATE CAPTION BAND (appears after card fades) ── */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-500"
          style={{ opacity: captionOpacity }}
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-xl border border-white/20"
            style={{ background: 'rgba(16,24,32,0.65)' }}
          >
            <span className="text-2xl leading-none">{currentStage.emoji}</span>
            <div className="flex flex-col">
              <span
                className="text-xs font-mono font-bold uppercase tracking-widest"
                style={{ color: currentStage.accent }}
              >
                {currentStage.label}
              </span>
              <span className="text-sm text-white/90 font-medium max-w-xs">
                {currentStage.caption}
              </span>
            </div>
          </div>
        </div>

        {/* ── PROGRESS DOTS (right side) ── */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-none">
          {SCROLL_STAGES.map((s, i) => {
            const isActive = currentStage === s;
            return (
              <div
                key={i}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: isActive ? 8 : 5,
                  height: isActive ? 8 : 5,
                  background: isActive ? s.accent : 'rgba(255,255,255,0.3)',
                  boxShadow: isActive ? `0 0 8px ${s.accent}` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroCanvas;
