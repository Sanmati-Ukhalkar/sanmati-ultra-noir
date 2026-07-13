import React, { useRef, useState, useEffect } from 'react';
import { GraduationCap, Code2, Calendar, MapPin } from 'lucide-react';

const educationData = [
  {
    title: 'BE in Artificial Intelligence & Data Science',
    institution: 'Engineering Degree',
    period: '2023 - 2026',
    location: 'Nashik, India',
    description: 'Focusing on advanced mathematics, machine learning algorithms, deep learning, and data analytics to build intelligent, data-driven systems.',
    icon: GraduationCap,
  },
  {
    title: 'Diploma in Computer Technology',
    institution: 'Polytechnic Diploma',
    period: '2020 - 2023',
    location: 'Nashik, India',
    description: 'Built a solid foundation in computer science, software engineering principles, programming languages, and database management.',
    icon: Code2,
  }
];

const Education = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(educationData.map(() => false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Heading observer
    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { 
          if (entry.isIntersecting) { 
            setIsVisible(true); 
            obs.disconnect(); 
          } 
        },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
      );
      obs.observe(headingRef.current);
      observers.push(obs);
    }

    // Item observers
    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => { 
              const next = [...prev]; 
              next[i] = true; 
              return next; 
            });
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
    <section className="py-20 px-8 bg-background relative">
      <div className="max-w-4xl mx-auto">
        <h2 
          ref={headingRef}
          className={`text-3xl lg:text-4xl font-bold text-center mb-16 smooth-reveal transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Education Journey
        </h2>

        <div className="space-y-8">
          {educationData.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div 
                key={index}
                ref={el => { itemsRef.current[index] = el; }}
                className={`bg-card/40 border border-border/50 p-6 md:p-8 rounded-xl hover:bg-card/60 smooth-reveal transform ${visibleItems[index] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                style={{ transitionDelay: visibleItems[index] ? `${index * 100}ms` : '0ms' }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="p-4 bg-primary/10 text-primary rounded-xl shrink-0 w-16 h-16 flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <h4 className="text-lg font-medium text-secondary mb-4">
                      {item.institution}
                    </h4>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        <span>{item.period}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;
