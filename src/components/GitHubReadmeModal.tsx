import React, { useEffect, useState } from 'react';
import { X, ExternalLink, FileText, Loader2, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GitHubReadmeModalProps {
  repoName: string | null;
  title: string | null;
  onClose: () => void;
}

export const GitHubReadmeModal: React.FC<GitHubReadmeModalProps> = ({ repoName, title, onClose }) => {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoName) return;

    const fetchReadme = async () => {
      setIsLoading(true);
      setError(null);
      setContent(null);

      // Extract repo name if full URL passed
      const cleanRepo = repoName.replace('https://github.com/', '').replace('Sanmati-Ukhalkar/', '').replace(/\/$/, '');

      try {
        // Try main branch first, then master branch
        let res = await fetch(`https://raw.githubusercontent.com/Sanmati-Ukhalkar/${cleanRepo}/main/README.md`);
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/Sanmati-Ukhalkar/${cleanRepo}/master/README.md`);
        }

        if (res.ok) {
          const text = await res.text();
          setContent(text);
        } else {
          setError(`No public README.md found in repository '${cleanRepo}'.`);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Failed to fetch raw GitHub README:', error);
        setError('Failed to fetch documentation from GitHub.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadme();
  }, [repoName]);

  if (!repoName || !title) return null;

  const cleanRepo = repoName.replace('https://github.com/', '').replace('Sanmati-Ukhalkar/', '').replace(/\/$/, '');
  const githubUrl = `https://github.com/Sanmati-Ukhalkar/${cleanRepo}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-foreground font-mono">{title} — Original README</h3>
              <p className="text-[11px] font-mono text-muted-foreground">
                Sanmati-Ukhalkar/{cleanRepo}/README.md
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono font-semibold text-foreground hover:border-primary transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto font-sans text-sm text-foreground/90 leading-relaxed bg-background/50">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-mono">Fetching raw README.md from GitHub...</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <p className="text-sm text-destructive font-mono">{error}</p>
              <Button
                onClick={() => window.open(githubUrl, '_blank')}
                variant="outline"
                size="sm"
                className="gap-2 text-xs font-mono"
              >
                <span>Open Repository on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs text-foreground/80 bg-card p-5 rounded-xl border border-border/70 overflow-x-auto">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubReadmeModal;
