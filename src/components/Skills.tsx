import React from 'react';
import { Brain, Code2, Database, LineChart, Network, Terminal, Code, Cpu } from 'lucide-react';

const Skills = () => {
  const skills = [
    { name: 'Python', icon: Code2 },
    { name: 'TensorFlow', icon: Brain },
    { name: 'PyTorch', icon: Cpu },
    { name: 'Pandas', icon: LineChart },
    { name: 'Scikit-learn', icon: Network },
    { name: 'SQL', icon: Database },
    { name: 'Bash / Scripting', icon: Terminal },
    { name: 'Web Dev (React/JS)', icon: Code },
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in-smooth">
          Tech Skills
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border p-8 rounded-lg text-center hover-lift-shadow animate-scale-in flex flex-col items-center justify-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="icon-bounce mb-4 text-primary">
                  <Icon className="w-16 h-16 mx-auto transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {skill.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;