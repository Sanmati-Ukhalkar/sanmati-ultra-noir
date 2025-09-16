import React from 'react';

const Projects = () => {
  const projects = [
    {
      name: 'Arts Studio Website',
      description: 'Creative portfolio for an arts studio.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: '/images/projects/arts-studio.png'
    },
    {
      name: 'Healthcare Chatbot',
      description: 'AI chatbot for medical queries using OpenAI API.',
      tags: ['React', 'AI', 'Node.js'],
      image: '/images/projects/healthcare-chatbot.png'
    },
    {
      name: 'Event Management App',
      description: 'Platform for event booking and management.',
      tags: ['React', 'MongoDB', 'Express'],
      image: '/images/projects/event-management.png'
    },
    {
      name: 'Self Drive Self Data Storing',
      description: 'MongoDB-based self data storage system.',
      tags: ['MongoDB', 'Node.js'],
      image: '/images/projects/self-drive.png'
    },
  ];

  return (
    <section className="py-20 px-8 bg-background-secondary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in-smooth">
          Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden hover-lift-shadow animate-slide-up-delayed"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-8">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;