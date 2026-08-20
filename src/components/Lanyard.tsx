import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface LanyardProps {
  frontImage?: string | null;
}

export default function Lanyard({ frontImage = '/images/id_card_front.png?v=4' }: LanyardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth Spring Physics for natural swinging feel
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  // 3D Rotation transforms driven by spring drag
  const rotateX = useTransform(springY, [-150, 150], [25, -25]);
  const rotateY = useTransform(springX, [-150, 150], [-25, 25]);
  const strapRotateZ = useTransform(springX, [-150, 150], [-10, 10]);

  const handleDragEnd = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto select-none"
      style={{ perspective: 1200 }}
    >
      {/* ── Realistic Woven Coral Lanyard Strap (Top Anchor to Metal Ring) ── */}
      <motion.div
        className="relative z-10 w-3.5 sm:w-4 h-28 sm:h-36 lg:h-[180px] bg-[#FF6B4A] rounded-t-full shadow-md flex flex-col items-center justify-end"
        style={{
          rotateZ: strapRotateZ,
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 6px)',
        }}
      >
        {/* Black Clip & Metal Ring */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#101820] bg-muted/90 flex items-center justify-center -mb-2.5 sm:-mb-3 shadow-md">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-primary/60 bg-background" />
        </div>
      </motion.div>

      {/* ── 3D Swinging & Draggable ID Badge Card ── */}
      <motion.div
        drag
        dragSnapToOrigin
        dragConstraints={{ top: -100, bottom: 100, left: -120, right: 120 }}
        dragElastic={0.4}
        onDrag={(_, info) => {
          x.set(info.offset.x);
          y.set(info.offset.y);
        }}
        onDragEnd={handleDragEnd}
        style={{
          x: springX,
          y: springY,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.03, cursor: 'grab' }}
        whileTap={{ scale: 0.98, cursor: 'grabbing' }}
        className="relative z-20 w-56 sm:w-64 lg:w-72 rounded-[1.5rem] sm:rounded-[1.8rem] p-1 bg-gradient-to-b from-border/90 to-border/40 shadow-2xl transition-shadow hover:shadow-[0_20px_50px_rgba(255,107,74,0.2)]"
      >
        {/* Card Image Container */}
        <div className="w-full h-full rounded-[1.3rem] sm:rounded-[1.6rem] overflow-hidden bg-card border border-border/80 relative shadow-inner">
          <img
            src={frontImage || '/images/id_card_front.png?v=3'}
            alt="Sanmati Ukhalkar ID Card"
            className="w-full h-auto object-cover pointer-events-none"
            loading="eager"
          />

          {/* Glassmorphism Reflection Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 80%)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
