import React, { useRef, useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { GitBranch, Users, Code2 } from 'lucide-react';
import { useGitHubStats } from '@/hooks/useGitHubStats';

const GitHubActivity = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Defaulting to your name, assuming it's your GitHub username.
  // You can easily change this string!
  const username = "sanmati-ukhalkar";
  const { stats } = useGitHubStats(username);

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
          className={`bg-card/30 backdrop-blur-sm border border-border/50 p-8 rounded-xl flex justify-center items-center overflow-x-auto smooth-reveal transform hover:border-primary/30 transition-colors duration-500 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
          style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
        >
          <div className="min-w-[800px] flex justify-center p-4">
            <GitHubCalendar
              username={username}
              colorScheme="light"
              blockSize={14}
              blockMargin={5}
              fontSize={14}
              theme={{
                light: ['#EDE1CB', '#F2B134', '#FF9D6C', '#FF6B4A', '#E0562F'],
                dark: ['#EDE1CB', '#F2B134', '#FF9D6C', '#FF6B4A', '#E0562F'],
              }}
            />
          </div>
        </div>

        {stats && (
          <div
            className={`flex flex-wrap justify-center gap-3 mt-6 smooth-reveal transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <GitBranch size={15} className="text-secondary" />
              <span className="text-foreground/80">{stats.publicRepos} public repos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <Users size={15} className="text-secondary" />
              <span className="text-foreground/80">{stats.followers} followers</span>
            </div>
            {stats.topLanguage && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
                <Code2 size={15} className="text-secondary" />
                <span className="text-foreground/80">Most active in {stats.topLanguage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubActivity;
