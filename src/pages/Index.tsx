import React, { useEffect, useRef, useState } from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import PipelineWidget from '@/components/PipelineWidget';
import HowIThink from '@/components/HowIThink';
import GitHubActivity from '@/components/GitHubActivity';
import Education from '@/components/Education';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import LineSidebar from '@/components/LineSidebar';
import AvatarCompanion from '@/components/AvatarCompanion/AvatarCompanion';
import CommandPalette from '@/components/CommandPalette';
import VisionWidget from '@/components/VisionControl/VisionWidget';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useLenis } from '@/hooks/useLenis';

const sections = [
  { id: 'hero',     label: 'Home'     },
  { id: 'about',    label: 'About'    },
  { id: 'projects', label: 'Projects' },
  { id: 'learning', label: 'Activity & Learning'  },
  { id: 'skills',   label: 'Skills'   },
  { id: 'footer',   label: 'Contact'  },
];

const Index = () => {
  // Initialize Lenis smooth scroll (bridges to GSAP ScrollTrigger automatically)
  useLenis();

  const { activeIndex, activeId } = useActiveSection(sections);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Show sidebar ONLY while scrolling — hide 900ms after scroll stops
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setSidebarVisible(true);
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          setSidebarVisible(false);
        }, 280);
      } else {
        setSidebarVisible(false);
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleScrollTo = (index: number) => {
    const sectionId = sections[index]?.id;
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Floating overlay sidebar — visible only while scrolling */}
      <div
        className="fixed left-0 top-0 h-screen flex items-center z-50"
        style={{
          paddingLeft: '14px',
          pointerEvents: sidebarVisible ? 'auto' : 'none',
          opacity: sidebarVisible ? 1 : 0,
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-22px)',
          transition: sidebarVisible
            ? 'opacity 0.32s cubic-bezier(0.4,0,0.2,1), transform 0.32s cubic-bezier(0.4,0,0.2,1)'
            : 'opacity 0.18s cubic-bezier(0.4,0,1,1), transform 0.18s cubic-bezier(0.4,0,1,1)'
        }}
      >
        <LineSidebar
          items={sections.map(s => s.label)}
          accentColor="#FF6B4A"
          textColor="#241E1A"
          markerColor="#8A7A66"
          showIndex
          showMarker
          proximityRadius={110}
          maxShift={52}
          falloff="smooth"
          markerLength={96}
          markerGap={0}
          tickScale={0.28}
          scaleTick
          itemGap={34}
          fontSize={1.65}
          smoothing={120}
          defaultActive={activeIndex}
          onItemClick={(index) => handleScrollTo(index)}
        />
      </div>

      {/* Scroll-reactive illustrated companion — persists across sections */}
      <AvatarCompanion activeId={activeId} />

      {/* Ctrl/Cmd+K quick nav */}
      <CommandPalette />

      {/* AI Vision & Hand Gesture Navigation Control Hub */}
      <VisionWidget />

      {/* Main Content — full width, sidebar overlaps it */}
      <div className="w-full">
        <div id="hero"><Hero /></div>
        <div id="about"><About /></div>
        <div id="projects">
          <Projects />
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <PipelineWidget />
            <HowIThink />
          </div>
        </div>
        <div id="learning">
          <GitHubActivity />
          <Education />
        </div>
        <div id="skills"><Skills /></div>
        <div id="footer"><Footer /></div>
      </div>
    </div>
  );
};

export default Index;
