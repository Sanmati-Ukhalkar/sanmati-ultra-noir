import React, { useEffect, useRef, useState } from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Timeline from '@/components/Timeline';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import LineSidebar from '@/components/LineSidebar';

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sections = [
    { id: 'hero',     label: 'Home'     },
    { id: 'about',    label: 'About'    },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Journey'  },
    { id: 'skills',   label: 'Skills'   },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex(s => s.id === entry.target.id);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

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
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleScrollTo = (index: number) => {
    const sectionId = sections[index]?.id;
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
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
          accentColor="#A855F7"
          textColor="#e8e8e8"
          markerColor="#5a5a5a"
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

      {/* Main Content — full width, sidebar overlaps it */}
      <div className="w-full">
        <div id="hero"><Hero /></div>
        <div id="about"><About /></div>
        <div id="projects"><Projects /></div>
        <div id="timeline"><Timeline /></div>
        <div id="skills"><Skills /></div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
