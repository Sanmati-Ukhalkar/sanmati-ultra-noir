import React, { useRef, useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

const GitHubActivity = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Defaulting to your name, assuming it's your GitHub username. 
  // You can easily change this string!
  const username = "sanmati-ukhalkar"; 

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
    <section className="py-20 px-8 bg-background relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10" ref={containerRef}>
        <h2 className={`text-3xl lg:text-4xl font-bold text-center mb-12 smooth-reveal transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          GitHub Contributions
        </h2>
        
        <div 
          className={`bg-card/30 backdrop-blur-sm border border-border/50 p-8 rounded-2xl flex justify-center items-center overflow-x-auto smooth-reveal transform hover:border-primary/30 transition-colors duration-500 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
          style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
        >
          <div className="min-w-[800px] flex justify-center p-4">
            <GitHubCalendar 
              username={username} 
              colorScheme="dark"
              blockSize={14}
              blockMargin={5}
              fontSize={14}
              theme={{
                light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                dark: ['#1e1e20', '#39d35340', '#39d35370', '#39d353a0', '#39d353'],
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubActivity;
