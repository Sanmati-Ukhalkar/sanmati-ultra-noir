import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Globe, Database } from 'lucide-react';
import { getProjectBySlug } from '@/data/projects';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  const isWeb = project.type === 'web';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="flex items-center gap-2 mb-4">
          {isWeb ? <Globe className="w-4 h-4 text-secondary" /> : <Database className="w-4 h-4 text-secondary" />}
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
            {project.label}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">{project.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-3 py-1 rounded-full border border-border bg-muted text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-14 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Visit Live Site
            <ExternalLink size={15} />
          </a>
        )}

        {(project.image || project.url) && (
          <div className="rounded-xl overflow-hidden border border-border mb-14 bg-card">
            <img
              src={project.image ?? `https://image.thum.io/get/width/1200/crop/800/noanimate/${project.url}`}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="space-y-12">
          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-secondary mb-3">The Problem</h2>
            <p className="text-foreground/85 leading-relaxed">{project.caseStudy.problem}</p>
          </section>

          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-secondary mb-3">Approach</h2>
            <ul className="space-y-3">
              {project.caseStudy.approach.map((step, i) => (
                <li key={i} className="flex gap-3 text-foreground/85 leading-relaxed">
                  <span className="text-primary font-mono text-sm mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-secondary mb-3">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.caseStudy.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-secondary mb-3">Outcome</h2>
            <p className="text-foreground/85 leading-relaxed">{project.caseStudy.outcome}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
