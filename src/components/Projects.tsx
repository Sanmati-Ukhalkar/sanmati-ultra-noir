import React from 'react';

const Projects = () => {
  const projects = [
    {
      name: 'Arts Studio Website',
      description: 'Creative portfolio for an arts studio',
      tags: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      name: 'Healthcare Chatbot',
      description: 'AI chatbot for medical queries',
      tags: ['React', 'AI', 'Node.js'],
    },
    {
      name: 'Event Management App',
      description: 'Platform for event booking',
      tags: ['React', 'MongoDB', 'Express'],
    },
    {
      name: 'Self Drive Self Data Storing',
      description: 'MongoDB-based self data storage',
      tags: ['MongoDB', 'Node.js'],
    },
  ];

  return (
    <section className="py-20 px-8 bg-background-secondary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in-fast">
          Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-card border border-border p-8 rounded-lg hover:bg-card-hover transition-all duration-300 hover-scale-snap animate-slide-up-fast"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {project.name}
              </h3>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;