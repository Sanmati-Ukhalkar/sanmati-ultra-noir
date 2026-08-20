import React, { useState } from 'react';
import { Briefcase, GraduationCap, Rocket, Cpu, Award } from 'lucide-react';

interface TimelineEvent {
  year: string;
  role: string;
  title: string;
  description: string;
  tags: string[];
  icon: React.ElementType;
  color: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2024 - Present',
    role: 'Full-Stack & ML Projects',
    title: 'Production Deployments & AI Models',
    description: 'Built & launched Kalarth Canvas (E-Commerce), Atlaren Services, and real-time computer vision quality control systems.',
    tags: ['React', 'Supabase', 'PyTorch', 'YOLO', 'FastAPI'],
    icon: Rocket,
    color: 'text-primary bg-primary/10 border-primary/30',
  },
  {
    year: '2023 - 2024',
    role: 'Data Science & ML Engineer',
    title: 'Predictive Analytics & Sentiment Research',
    description: 'Developed customer churn prediction model with 92% accuracy and transformer-based review sentiment analyzer.',
    tags: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas'],
    icon: Cpu,
    color: 'text-secondary bg-secondary/10 border-secondary/30',
  },
  {
    year: '2022 - 2026',
    role: 'B.Tech Artificial Intelligence',
    title: 'Degree & Technical Specialization',
    description: 'Core coursework in Machine Learning, Deep Neural Networks, Computer Vision, Data Structures, and Software Architecture.',
    tags: ['B.Tech AI', 'Deep Learning', 'Algorithms'],
    icon: GraduationCap,
    color: 'text-accent-foreground bg-accent/25 border-accent/40',
  },
];

const TimelineBuilds: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm my-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono tracking-widest uppercase text-primary font-semibold">
          Visual Build Journey
        </span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
        Milestones & Technical Evolution
      </h3>

      {/* Timeline Node Selector */}
      <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
        {timelineEvents.map((event, idx) => {
          const Icon = event.icon;
          const isSelected = activeIdx === idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative cursor-pointer group transition-all duration-300 p-4 rounded-xl border ${
                isSelected
                  ? 'bg-background-secondary border-primary shadow-sm translate-x-1'
                  : 'bg-card border-border/60 hover:border-foreground/30 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Node Marker */}
              <div
                className={`absolute -left-[33px] top-5 w-4 h-4 rounded-full border-2 transition-all ${
                  isSelected ? 'bg-primary border-background scale-125' : 'bg-muted border-border'
                }`}
              />

              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${event.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground">{event.role}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                  {event.year}
                </span>
              </div>

              <h4 className="text-base font-bold text-foreground mb-1">{event.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{event.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-card border border-border text-foreground/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineBuilds;
