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
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-primary mb-4 opacity-80">
            — About Me
          </span>
          <h2 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">Who am I?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            I'm <span className="text-foreground font-semibold">Sanmati Ukhalkar</span>, a Python
            Developer specialising in{' '}
            <span className="text-primary">AI, Machine Learning &amp; Data Science</span>.
            I build intelligent, data-driven solutions and futuristic digital experiences —
            blending analytical rigour with clean, performant engineering.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mb-6">
            {[
              { label: 'Specialisation', value: 'Python / ML' },
              { label: 'Degree',         value: 'B.Tech AI (2026)' },
              { label: 'Experience',     value: '2+ Years' },
              { label: 'Projects',       value: '7+ Delivered' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-muted-foreground opacity-50 mb-4">↕ Drag the card &amp; let it swing</p>
        </div>

        {/* Right — full height lanyard */}
        <div className="w-1/2 flex-shrink-0" style={{ height: '100vh' }}>
          <Suspense fallback={<Spinner />}>
            <Lanyard frontImage="/images/id_card_front.png?v=4" />
          </Suspense>
        </div>
      </div>

      {/* ── Mobile: clean stacked layout with dedicated card viewport ── */}
      <div className="lg:hidden flex flex-col items-center pt-4 pb-12 px-4 min-h-screen">
        
        {/* Dedicated 3D Lanyard Card Container */}
        <div className="w-full h-[430px] sm:h-[480px] relative flex items-center justify-center overflow-visible mb-4">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          }>
            <Lanyard frontImage="/images/id_card_front.png?v=4" />
          </Suspense>
        </div>

        {/* Text Content & Stats — cleanly positioned below the ID card */}
        <div className="w-full max-w-md text-center px-4 z-10">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary opacity-80">
            — About Me
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">Who am I?</h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5 max-w-sm mx-auto">
            I'm <span className="text-foreground font-semibold">Sanmati Ukhalkar</span>, a Python
            Developer specialising in{' '}
            <span className="text-primary">AI, ML &amp; Data Science</span>.
            I build intelligent, data-driven solutions and futuristic digital experiences.
          </p>

          {/* Compact stats — 4 in a grid */}
          <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto">
            {[
              { label: 'Role',       value: 'Python / ML' },
              { label: 'Degree',     value: 'B.Tech AI' },
              { label: 'Experience', value: '2+ Years' },
              { label: 'Projects',   value: '7+ Done' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg p-2.5 text-center bg-card border border-border/80 shadow-sm"
              >
                <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-muted-foreground opacity-50 mt-5">
            ↕ Drag the card &amp; let it swing
          </p>
        </div>
      </div>

    </section>
  );
};

const Spinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default About;
