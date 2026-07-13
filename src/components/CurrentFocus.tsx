import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Database, LineChart } from 'lucide-react';

const focusAreas = [
  {
    title: 'Machine Learning',
    description: 'Deep diving into complex algorithms, predictive modeling, and understanding the mathematics behind neural networks.',
    icon: BrainCircuit,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Data Science',
    description: 'Mastering data manipulation, statistical analysis, and creating meaningful visualizations using Python and Pandas.',
    icon: Database,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    title: 'Applied AI & NLP',
    description: 'Exploring Large Language Models (LLMs), RAG architectures, and agentic workflows to build intelligent applications.',
    icon: LineChart,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  }
];

const CurrentFocus = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>Currently Learning</span>
          </div>
          <h2 className={`text-3xl lg:text-4xl font-bold text-foreground smooth-reveal transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Current Focus
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            I believe in continuous learning. Here are the technologies and concepts I'm currently exploring to level up my skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {focusAreas.map((area, index) => {
            const Icon = area.icon;
            
            return (
              <div 
                key={index}
                className={`group bg-card/40 border border-border/50 rounded-xl p-6 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/30 smooth-reveal transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${area.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{area.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CurrentFocus;
