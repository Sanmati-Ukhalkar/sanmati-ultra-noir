import React, { useRef, useState, useEffect } from 'react';
import MagicBento, { ProjectCard } from './MagicBento';
import { projects as fallbackProjects, getProjectBySlug, ProjectData } from '@/data/projects';
import ArchDiagramModal from './ArchDiagramModal';
import LivePreviewModal from './LivePreviewModal';
import GitHubReadmeModal from './GitHubReadmeModal';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface JSONProject {
  id: string;
  repoUrl: string;
  name: string;
  category: string;
  blurb: string;
  stack: string[];
  featured: boolean;
  /** Optional screenshot/preview image URL shown in the project card */
  imageUrl?: string;
  architecture?: {
    blueprintAvailable: boolean;
    nodes: { label: string; detail: string }[];
  };
  githubMeta?: {
    stars: number;
    language: string;
    pushedAt: string;
    fetchedAt: string;
  };
  manualOverride?: boolean;
  order?: number;
}

const Projects = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [activeArchProject, setActiveArchProject] = useState<ProjectData | null>(null);
  const [livePreviewTarget, setLivePreviewTarget] = useState<{ url: string; title: string } | null>(null);
  const [readmeTarget, setReadmeTarget] = useState<{ repoUrl: string; title: string } | null>(null);
  const [loadedProjects, setLoadedProjects] = useState<JSONProject[]>([]);
  const [showMoreProjects, setShowMoreProjects] = useState(false);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const localSaved = localStorage.getItem('curated_projects_json');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          setLoadedProjects(parsed);
          return;
        }

        const res = await fetch('/data/projects.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.projects)) {
            setLoadedProjects(data.projects);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic projects.json:', err);
      }
    };
    fetchProjectsData();
  }, []);

  useEffect(() => {
    if (headingRef.current) {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setHeadingVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(headingRef.current);
      return () => obs.disconnect();
    }
  }, []);

  // Filter featured vs unfeatured projects
  const displaySource = loadedProjects.length > 0 ? loadedProjects : fallbackProjects.map(p => ({
    id: p.slug,
    repoUrl: p.url || '',
    name: p.title,
    category: p.label,
    blurb: p.description,
    stack: p.tags,
    featured: true,
    architecture: { blueprintAvailable: true, nodes: [] },
    order: 1
  }));

  const featuredProjects = displaySource.filter(p => p.featured !== false);
  const otherProjects = displaySource.filter(p => p.featured === false);

  const bentoProjects: ProjectCard[] = (showMoreProjects ? displaySource : featuredProjects).map((p) => ({
    label: p.category || 'Project',
    title: p.name,
    description: p.blurb,
    tags: p.stack || [],
    liveUrl: p.repoUrl,
    thumbUrl: p.imageUrl,
    caseStudyPath: `/projects/${p.id}`,
    slug: p.id,
    onPreviewLive: (url, title) => setLivePreviewTarget({ url, title }),
    onViewReadme: (repoUrl, title) => setReadmeTarget({ repoUrl, title }),
  }));

  const handleOpenArch = (slugOrId: string) => {
    const foundJSON = displaySource.find(p => p.id === slugOrId || p.name.toLowerCase() === slugOrId.toLowerCase());
    if (foundJSON) {
      setActiveArchProject({
        slug: foundJSON.id,
        label: foundJSON.category,
        title: foundJSON.name,
        description: foundJSON.blurb,
        tags: foundJSON.stack,
        url: foundJSON.repoUrl,
        type: 'web',
        caseStudy: {
          problem: foundJSON.blurb,
          approach: foundJSON.architecture?.nodes?.map(n => `${n.label}: ${n.detail}`) || ['Production system architecture'],
          stack: foundJSON.stack,
          outcome: 'Live System'
        },
        architecture: foundJSON.architecture
      });
      return;
    }
    const foundFallback = getProjectBySlug(slugOrId);
    if (foundFallback) setActiveArchProject(foundFallback);
  };

  return (
    <section className="py-24 px-4 sm:px-8 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono tracking-widest uppercase text-primary font-semibold">
              Interactive Case Studies &amp; Blueprints
            </span>
          </div>
          <h2
            ref={headingRef}
            className={`text-4xl lg:text-5xl font-bold text-center mb-4 smooth-reveal transform ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Featured Projects &amp; Systems
          </h2>
          <p className={`text-muted-foreground text-lg text-center max-w-2xl smooth-reveal transform ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '100ms' }}>
            A showcase of my live web platforms, computer vision pipelines, and machine learning models. Select any project to view full case study &amp; architecture details.
          </p>

          {/* Architecture Quick Selector Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-mono text-muted-foreground mr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-primary" /> Inspect Architecture Blueprint:
            </span>
            {displaySource
              .filter((p) => p.architecture?.nodes && p.architecture.nodes.length > 0)
              .slice(0, 5)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleOpenArch(p.id)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary hover:text-primary transition-all duration-300 shadow-sm"
                >
                  {p.name} ↗
                </button>
              ))}
          </div>
        </div>

        {/* Bento Grid */}
        <MagicBento projects={bentoProjects} />

        {/* More Projects Collapsed Toggle */}
        {otherProjects.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowMoreProjects(prev => !prev)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card text-xs font-mono font-semibold text-foreground hover:border-primary transition-colors"
            >
              {showMoreProjects ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
              {showMoreProjects ? 'Collapse Additional Projects' : `View ${otherProjects.length} More Projects`}
            </button>
          </div>
        )}

        {/* Architecture Popover Modal */}
        <ArchDiagramModal
          project={activeArchProject}
          onClose={() => setActiveArchProject(null)}
        />

        {/* Live Interactive PIP Site Preview Modal */}
        <LivePreviewModal
          url={livePreviewTarget?.url || null}
          title={livePreviewTarget?.title || null}
          onClose={() => setLivePreviewTarget(null)}
        />

        {/* GitHub Raw README Inspector Modal */}
        <GitHubReadmeModal
          repoName={readmeTarget?.repoUrl || null}
          title={readmeTarget?.title || null}
          onClose={() => setReadmeTarget(null)}
        />
      </div>
    </section>
  );
};

export default Projects;

