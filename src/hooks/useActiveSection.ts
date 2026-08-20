import { useEffect, useState } from 'react';

export interface SectionDef {
  id: string;
  label: string;
}

/**
 * Tracks which section is currently in view via IntersectionObserver.
 * Single source of truth shared by LineSidebar (scroll-spy nav) and
 * AvatarCompanion (pose state machine) so both stay in sync off one
 * observer instead of each running their own.
 */
export function useActiveSection(sections: SectionDef[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      {
        rootMargin: '-35% 0px -40% 0px',
        threshold: 0.15,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeIndex, activeId: sections[activeIndex]?.id };
}
