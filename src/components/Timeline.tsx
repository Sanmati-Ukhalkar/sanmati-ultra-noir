import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

const timelineData = [
  {
    year: '2024 - Present',
    title: 'Machine Learning Engineer',
    organization: 'Tech Innovations Inc.',
    description: 'Developing predictive models and NLP pipelines for enterprise clients.',
    icon: Briefcase,
  },
  {
    year: '2023 - 2024',
    title: 'Data Science Intern',
    organization: 'DataCorp',
    description: 'Worked on data cleaning, visualization, and building basic classification models.',
    icon: Briefcase,
  },
  {
    year: '2022 - 2026',
    title: 'B.Tech in Artificial Intelligence',
    organization: 'University of Technology',
    description: 'Focusing on advanced mathematics, machine learning algorithms, and software engineering.',
    icon: GraduationCap,
  },
  {
    year: '2022',
    title: 'First Place - AI Hackathon',
    organization: 'Global Tech Summit',
    description: 'Built a real-time computer vision application for accessibility.',
    icon: Award,
  }
];

const Timeline = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(timelineData.map(() => false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Heading observer
    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setHeadingVisible(true); obs.disconnect(); } },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
      );
      obs.observe(headingRef.current);
      observers.push(obs);
    }

    // Item observers
    itemRefsArr.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => { const next = [...prev]; next[i] = true; return next; });
            obs.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h2
          ref={headingRef}
          className={`text-4xl lg:text-5xl font-bold text-center mb-16 reveal${headingVisible ? ' reveal-visible' : ''}`}
        >
          Journey &amp; Milestones
        </h2>

        <div className="relative border-l border-border ml-3 md:ml-6">
          {timelineData.map((item, index) => {
            const Icon = item.icon;
            const delayClass = `reveal-delay-${Math.min(index + 1, 8)}`;
            return (
              <div
                key={index}
                ref={el => { itemRefsArr.current[index] = el; }}
                className={`mb-10 ml-8 md:ml-12 relative reveal ${delayClass}${visibleItems[index] ? ' reveal-visible' : ''}`}
              >
                {/* Timeline dot/icon */}
                <span className="absolute flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full -left-12 md:-left-16 ring-4 ring-background text-primary">
                  <Icon size={20} />
                </span>

                {/* Content Card */}
                <div className="bg-card border border-border p-6 rounded-lg hover-lift-shadow transition-all duration-300">
                  <span className="text-sm font-medium text-primary mb-2 block">{item.year}</span>
                  <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                  <h4 className="text-md font-medium text-secondary mb-3">{item.organization}</h4>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
