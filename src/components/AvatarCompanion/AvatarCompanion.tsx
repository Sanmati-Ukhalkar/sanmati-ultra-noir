import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import PlaceholderAvatar from './PlaceholderAvatar';
import ShapeGrid from '../ShapeGrid';
import { useScrollFrameSequence } from '@/hooks/useScrollFrameSequence';

const TOTAL_AVATAR_FRAMES = 45;

const getAvatarFrameUrl = (index: number) => {
  const paddedIndex = String(index).padStart(3, '0');
  return `/assets/avatar-sequence/frame_${paddedIndex}.webp`;
};

interface AvatarCompanionProps {
  activeId: string | undefined;
}

const AvatarCompanion = ({ activeId }: AvatarCompanionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCanvasSequence, setUseCanvasSequence] = useState(true);

  // Check reduced motion and screen width on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 768;
    if (prefersReducedMotion || isSmallScreen) {
      setUseCanvasSequence(false);
    }
  }, []);

  const {
    currentFrameIndex,
    setCurrentFrameIndex,
    getCurrentImage,
    isPriorityReady,
  } = useScrollFrameSequence({
    sequenceId: 'avatar',
    totalFrames: TOTAL_AVATAR_FRAMES,
    getFrameUrl: getAvatarFrameUrl,
    windowSize: 20,
    priorityCount: 5,
    autoStart: 'on-enter-viewport',
    containerRef,
  });

  // Track global scroll percentage to scrub 45 frames continuously
  useEffect(() => {
    if (!useCanvasSequence) return;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = Math.min(1, Math.max(0, window.scrollY / docHeight));
      const targetFrame = Math.min(
        TOTAL_AVATAR_FRAMES - 1,
        Math.floor(scrollPercent * TOTAL_AVATAR_FRAMES)
      );
      setCurrentFrameIndex(targetFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [useCanvasSequence, setCurrentFrameIndex]);

  // Render continuous frame to canvas
  const renderAvatarFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const dw = 140;
    const dh = 175;

    if (canvas.width !== Math.round(dw * dpr) || canvas.height !== Math.round(dh * dpr)) {
      canvas.width = Math.round(dw * dpr);
      canvas.height = Math.round(dh * dpr);
      ctx.scale(dpr, dpr);
    }

    const img = getCurrentImage();
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, dw, dh);
      ctx.drawImage(img, 0, 0, dw, dh);
    }
  }, [getCurrentImage]);

  useEffect(() => {
    if (useCanvasSequence) {
      renderAvatarFrame();
    }
  }, [useCanvasSequence, currentFrameIndex, isPriorityReady, renderAvatarFrame]);

  // Suppress avatar when About section is active (Lanyard 3D takes visual priority)
  const isSuppressed = activeId === 'about';

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 transition-all duration-500 pointer-events-none ${
        isSuppressed ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      <div className="relative w-[130px] sm:w-[150px] h-[160px] sm:h-[180px] rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 p-2 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <ShapeGrid />
        </div>

        {useCanvasSequence ? (
          <canvas
            ref={canvasRef}
            className="w-[120px] sm:w-[140px] h-[150px] sm:h-[170px] object-contain relative z-10"
          />
        ) : (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <PlaceholderAvatar activeId={activeId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarCompanion;
