import React, { useEffect, useRef, useState } from 'react';

const aiProjects = [
  {
    name: 'Predictive Analytics Model',
    description: 'Machine learning model for predicting customer churn with 92% accuracy.',
    tags: ['Python', 'Scikit-learn', 'Pandas'],
    image: '/images/projects/healthcare-chatbot.png'
  },
  {
    name: 'Computer Vision Pipeline',
    description: 'Real-time object detection and classification system for manufacturing.',
    tags: ['PyTorch', 'OpenCV', 'YOLO'],
    image: '/images/projects/arts-studio.png'
  },
  {
    name: 'NLP Sentiment Analyzer',
    description: 'Sentiment analysis on large datasets of customer reviews using transformer models.',
    tags: ['Transformers', 'TensorFlow', 'Python'],
    image: '/images/projects/event-management.png'
  }
];

const webProjects = [
  {
    name: 'Arts Studio Website',
    description: 'Creative portfolio for an arts studio. (Live Client Project)',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: '/images/projects/arts-studio.png'
  },
  {
    name: 'Healthcare Chatbot',
    description: 'AI chatbot for medical queries using OpenAI API. (Live Client Project)',
    tags: ['React', 'AI', 'Node.js'],
    image: '/images/projects/healthcare-chatbot.png'
  },
  {
    name: 'Event Management App',
    description: 'Platform for event booking and management. (Live Client Project)',
    tags: ['React', 'MongoDB', 'Express'],
    image: '/images/projects/event-management.png'
  },
  {
    name: 'Self Drive Self Data Storing',
    description: 'MongoDB-based self data storage system. (Live Client Project)',
    tags: ['MongoDB', 'Node.js'],
    image: '/images/projects/self-drive.png'
  }
];

const Projects = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'web'>('ai');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [tabsVisible, setTabsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  const currentProjects = activeTab === 'ai' ? aiProjects : webProjects;

  // Reset card visibility when switching tabs so they re-animate
  useEffect(() => {
    setVisibleCards(currentProjects.map(() => false));
    // Small delay so DOM updates before observer fires
    const t = setTimeout(() => {
      cardRefsArr.current.forEach((el, i) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards(prev => { const next = [...prev]; next[i] = true; return next; });
              obs.disconnect();
            }
          },
          { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );
        obs.observe(el);
      });
    }, 60);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Heading + tabs one-time reveal
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setHeadingVisible(true); obs.disconnect(); } },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
      );
      obs.observe(headingRef.current);
      observers.push(obs);
    }
    if (tabsRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setTabsVisible(true); obs.disconnect(); } },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
      );
      obs.observe(tabsRef.current);
      observers.push(obs);
    }
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="py-20 px-8 bg-background-secondary">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className={`text-4xl lg:text-5xl font-bold text-center mb-10 reveal${headingVisible ? ' reveal-visible' : ''}`}
        >
          Projects
        </h2>

        {/* Tabs */}
        <div
          ref={tabsRef}
          className={`flex justify-center gap-4 mb-12 reveal reveal-delay-1${tabsVisible ? ' reveal-visible' : ''}`}
        >
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'ai'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            AI &amp; Data Science
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'web'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Live Web Clients
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentProjects.map((project, index) => {
            const delayClass = `reveal-delay-${Math.min(index + 1, 8)}`;
            return (
              <div
                key={`${activeTab}-${index}`}
                ref={el => { cardRefsArr.current[index] = el; }}
                className={`bg-card border border-border rounded-lg overflow-hidden hover-lift-shadow group reveal-scale ${delayClass}${visibleCards[index] ? ' reveal-visible' : ''}`}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;