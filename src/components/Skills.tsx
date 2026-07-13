import React, { useRef, useEffect, useState } from 'react';
import { 
  Terminal, 
  BrainCircuit, 
  Network, 
  ScanEye, 
  Bot, 
  BarChart3, 
  Server 
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Languages',
    icon: Terminal,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]',
    skills: ['Python', 'SQL', 'JavaScript']
  },
  {
    title: 'ML Frameworks',
    icon: BrainCircuit,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]',
    skills: ['TensorFlow', 'PyTorch']
  },
  {
    title: 'Deep Learning',
    icon: Network,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.2)]',
    skills: ['CNNs', 'Transformers', 'GANs']
  },
  {
    title: 'Computer Vision',
    icon: ScanEye,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]',
    skills: ['Object Detection', 'OpenCV', 'Image Processing']
  },
  {
    title: 'NLP & LLMs',
    icon: Bot,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]',
    skills: ['Transformers', 'HuggingFace']
  },
  {
    title: 'Data Tools',
    icon: BarChart3,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)]',
    skills: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn']
  },
  {
    title: 'APIs & Backend',
    icon: Server,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    shadow: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.2)]',
    skills: ['FastAPI', 'API Integration', 'Docker']
  }
];

const Skills = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(skillCategories.map(() => false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { 
          if (entry.isIntersecting) { 
            setIsVisible(true); 
            obs.disconnect(); 
          } 
        },
        { threshold: 0.2 }
      );
      obs.observe(headingRef.current);
      observers.push(obs);
    }

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
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#020104]">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 
          ref={headingRef}
          className={`text-4xl lg:text-5xl font-bold text-center mb-16 smooth-reveal transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Technical Arsenal
        </h2>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            // Make the 7th item span full width or center it elegantly
            const spanClass = index === 6 ? 'lg:col-span-3 md:col-span-2 max-w-2xl mx-auto w-full' : '';
            
            return (
              <div
                key={index}
                ref={el => { itemsRef.current[index] = el; }}
                className={`group flex flex-col bg-[#0a0812] border border-white/[0.05] p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1.5 ${category.shadow} hover:border-white/[0.1] smooth-reveal transform ${visibleItems[index] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'} ${spanClass}`}
                style={{ transitionDelay: visibleItems[index] ? `${(index % 3) * 100}ms` : '0ms' }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${category.bg} ${category.color} ${category.border} border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {category.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2.5 mt-auto">
                  {category.skills.map(skill => (
                    <span 
                      key={skill}
                      className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-white/80 transition-colors group-hover:bg-white/10 group-hover:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;