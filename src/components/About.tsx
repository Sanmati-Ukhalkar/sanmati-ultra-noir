import React, { Suspense } from 'react';
import Lanyard from './Lanyard';

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-background overflow-hidden"
      style={{ minHeight: '100svh' }}
    >

      {/* ── Desktop: side-by-side ── */}
      <div className="hidden lg:flex flex-row-reverse min-h-screen items-center">

        {/* Left — text */}
        <div className="flex flex-col justify-center px-16 xl:px-20 py-0 w-1/2 text-left">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#A855F7] mb-4 opacity-80">
            — About Me
          </span>
          <h2 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">Who am I?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            I'm <span className="text-foreground font-semibold">Sanmati Ukhalkar</span>, a Python
            Developer specialising in{' '}
            <span className="text-[#A855F7]">AI, Machine Learning &amp; Data Science</span>.
            I build intelligent, data-driven solutions and futuristic digital experiences —
            blending analytical rigour with clean, performant engineering.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mb-8">
            {[
              { label: 'Specialisation', value: 'Python / ML' },
              { label: 'Degree',         value: 'B.Tech AI (2026)' },
              { label: 'Experience',     value: '2+ Years' },
              { label: 'Projects',       value: '7+ Delivered' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-muted-foreground opacity-50">↕ Drag the card &amp; let it swing</p>
        </div>

        {/* Right — full height lanyard */}
        <div className="w-1/2 flex-shrink-0" style={{ height: '100vh' }}>
          <Suspense fallback={<Spinner />}>
            <Lanyard
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              fov={20}
              transparent
              frontImage="/images/id_card_front.png"
              imageFit="cover"
              lanyardWidth={0.8}
            />
          </Suspense>
        </div>
      </div>

      {/* ── Mobile: lanyard fills full screen, text overlays at bottom ── */}
      <div className="lg:hidden relative" style={{ height: '100svh' }}>

        {/* Canvas — absolute, covers entire section so lace hangs from top */}
        <div className="absolute inset-0">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          }>
            <Lanyard
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              fov={20}
              transparent
              frontImage="/images/id_card_front.png"
              imageFit="cover"
              lanyardWidth={0.8}
            />
          </Suspense>
        </div>

        {/* Text overlay — pinned to bottom, gradient backdrop so card shows above */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 pt-24 text-center"
          style={{
            background: 'linear-gradient(to top, hsl(0 0% 5%) 55%, transparent 100%)',
          }}
        >
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#A855F7] opacity-80">
            — About Me
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">Who am I?</h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5 max-w-sm mx-auto">
            I'm <span className="text-foreground font-semibold">Sanmati Ukhalkar</span>, a Python
            Developer specialising in{' '}
            <span className="text-[#A855F7]">AI, ML &amp; Data Science</span>.
          </p>

          {/* Compact stats — 4 in a row */}
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            {[
              { label: 'Role',       value: 'Python / ML' },
              { label: 'Degree',     value: 'B.Tech AI' },
              { label: 'Experience', value: '2+ Years' },
              { label: 'Projects',   value: '7+ Done' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg p-2 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-[9px] font-mono text-muted-foreground opacity-40 mt-4">
            ↕ Drag the card &amp; let it swing
          </p>
        </div>
      </div>

    </section>
  );
};

const Spinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default About;
