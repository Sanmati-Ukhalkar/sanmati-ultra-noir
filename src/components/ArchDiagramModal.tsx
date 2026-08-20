import React from 'react';
import { X, ExternalLink, Layers, Cpu, Database, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProjectData } from '@/data/projects';

interface ArchNode {
  label: string;
  detail: string;
}

interface ExtendedProjectData extends ProjectData {
  architecture?: {
    blueprintAvailable: boolean;
    nodes: ArchNode[];
  };
}

interface ArchDiagramModalProps {
  project: ExtendedProjectData | null;
  onClose: () => void;
}

const ArchDiagramModal: React.FC<ArchDiagramModalProps> = ({ project, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const nodes = project.architecture?.nodes || [
    { label: 'User & Client Layer', detail: 'React UI / API Request' },
    { label: 'Transformation Engine', detail: project.type === 'ai' ? 'PyTorch / Feature Pipeline' : 'Supabase / Node Backend' },
    { label: 'Storage & Cache', detail: 'PostgreSQL / In-Memory State' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in-smooth"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-border bg-background-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              System Architecture Diagram
            </span>
            <span className="text-xs font-mono text-muted-foreground uppercase">
              • {project.label}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            {project.title} Architecture Blueprint
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {project.description}
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="p-6 bg-background-secondary/70 border border-border rounded-xl mb-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Component Flow Diagram ({nodes.length} Nodes)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {nodes.map((node, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-card border border-border hover:border-primary/50 transition-colors rounded-xl p-4 text-center shadow-sm">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 font-mono font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-bold font-mono text-foreground">{node.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{node.detail}</p>
                </div>
                {idx < nodes.length - 1 && (
                  <div className="hidden md:flex justify-center text-primary">
                    <ArrowRight className="w-5 h-5 opacity-60" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Technical Deep Dive Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Key Engineering Challenges Solved
            </h4>
            <ul className="space-y-2">
              {project.caseStudy.approach.map((item, idx) => (
                <li key={idx} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="text-primary font-bold font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-secondary" /> Project Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-muted border border-border text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase text-muted-foreground">Measured Outcome</p>
                <p className="text-xs font-semibold text-foreground">{project.caseStudy.outcome}</p>
              </div>

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchDiagramModal;
