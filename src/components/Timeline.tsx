import React from 'react';

const Timeline = () => {
  const timelineEvents = [
    { year: '2021', event: 'Frontend Developer at Cars24' },
    { year: '2023', event: 'Explored AI & Data Science' },
    { year: '2024', event: 'Hackathon Projects & Healthcare Chatbot' },
    { year: '2025', event: 'Professional Portfolio & Startup Projects' },
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in-fast">
          Journey
        </h2>
        
        <div className="relative timeline-line py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timelineEvents.map((item, index) => (
              <div 
                key={index}
                className="relative z-10 animate-slide-up-fast"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-card border border-border p-6 rounded-lg hover:bg-card-hover transition-colors hover-scale-snap">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-background"></div>
                  <div className="text-center pt-4">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {item.year}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;