import React, { Suspense } from 'react';
import Lanyard from './Lanyard';

const About = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-background">

      {/* Left — text info */}
      <div className="relative z-10 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-16 lg:py-0 max-w-xl lg:max-w-none lg:w-1/2 text-center lg:text-left">
        <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#A855F7] mb-4 opacity-80">
          — About Me
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Who am I?
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
          I'm <span className="text-foreground font-semibold">Sanmati Ukhalkar</span>, a Python Developer
          specialising in <span className="text-[#A855F7]">AI, Machine Learning &amp; Data Science</span>.
          I build intelligent, data-driven solutions and futuristic digital experiences — blending
          analytical rigour with clean, performant engineering.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0 mb-8">
          {[
            { label: 'Specialisation', value: 'Python / ML' },
            { label: 'Degree', value: 'B.Tech AI (2026)' },
            { label: 'Experience', value: '2+ Years' },
            { label: 'Projects', value: '7+ Delivered' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-muted-foreground opacity-60">
          ↕ Drag the card &amp; let it swing
        </p>
      </div>

      {/* Right — Interactive Lanyard ID card */}
      <div className="relative w-full lg:w-1/2 h-[60vh] lg:h-screen">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Lanyard
            position={[0, 0, 30]}
            gravity={[0, -40, 0]}
            fov={20}
            transparent
            frontImage="/images/id_card_front.png"
            imageFit="cover"
            lanyardWidth={0.8}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default About;
