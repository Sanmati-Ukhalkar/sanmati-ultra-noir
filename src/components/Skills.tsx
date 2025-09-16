import React from 'react';
import { 
  Code, 
  Palette, 
  Database, 
  Server, 
  FileCode, 
  Globe, 
  Wind,
  Github
} from 'lucide-react';

const Skills = () => {
  const skills = [
    { name: 'HTML5', icon: FileCode },
    { name: 'CSS3', icon: Palette },
    { name: 'JavaScript', icon: Code },
    { name: 'React', icon: Globe },
    { name: 'MongoDB', icon: Database },
    { name: 'Node.js', icon: Server },
    { name: 'Tailwind CSS', icon: Wind },
    { name: 'GitHub', icon: Github },
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in-fast">
          Tech Skills
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border p-6 rounded-lg text-center hover:bg-card-hover transition-all duration-300 hover-scale-snap animate-slide-up-fast"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
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