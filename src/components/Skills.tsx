import React from 'react';
import html5Logo from '@/assets/logos/html5.svg';
import css3Logo from '@/assets/logos/css3.svg';
import jsLogo from '@/assets/logos/javascript.svg';
import reactLogo from '@/assets/logos/react.svg';
import mongoLogo from '@/assets/logos/mongodb.svg';
import nodeLogo from '@/assets/logos/nodejs.svg';
import tailwindLogo from '@/assets/logos/tailwindcss.svg';
import githubLogo from '@/assets/logos/github.svg';

const Skills = () => {
  const skills = [
    { 
      name: 'GitHub', 
      icon: githubLogo, 
      className: 'p-1 invert dark:invert-0' 
    },
    { name: 'HTML5', icon: html5Logo },
    { name: 'CSS3', icon: css3Logo },
    { name: 'JavaScript', icon: jsLogo },
    { name: 'React', icon: reactLogo },
    { name: 'MongoDB', icon: mongoLogo },
    { name: 'Node.js', icon: nodeLogo },
    { name: 'TailwindCSS', icon: tailwindLogo },
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in-smooth">
          Tech Skills
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-card border border-border p-8 rounded-lg text-center hover-lift-shadow animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="icon-bounce mb-4">
                <img 
                  src={skill.icon} 
                  alt={`${skill.name} logo`} 
                  className={`w-16 h-16 mx-auto transition-transform duration-300 ${skill.className || ''}`}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;