import React, { useState } from 'react';
import { X, ExternalLink, Monitor, Smartphone, Maximize2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivePreviewModalProps {
  url: string | null;
  title: string | null;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ url, title, onClose }) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeError, setIframeError] = useState(false);

  if (!url || !title) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-foreground font-mono">{title}</h3>
              <p className="text-[11px] font-mono text-muted-foreground truncate max-w-xs sm:max-w-md">
                {url}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2">
            {/* Viewport Toggles */}
            <div className="hidden sm:flex items-center bg-background border border-border rounded-lg p-0.5">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-md text-xs font-mono transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-md text-xs font-mono transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* External Link */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Preview Iframe Container */}
        <div className="flex-1 bg-black/90 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
          {iframeError ? (
            <div className="text-center p-8 max-w-md space-y-4 bg-card border border-border rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-primary mx-auto" />
              <h4 className="text-lg font-bold text-foreground">Live Site Frame Protected</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This external site prohibits iframe embedding due to X-Frame-Options security policies.
              </p>
              <Button
                onClick={() => window.open(url, '_blank')}
                variant="hero"
                className="gap-2 text-xs font-mono"
              >
                <span>Open Direct Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div
              className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-border/40 ${
                viewport === 'mobile' ? 'w-[375px] max-w-full' : 'w-full'
              }`}
            >
              <iframe
                src={url}
                title={`Live Preview - ${title}`}
                className="w-full h-full border-0 bg-white"
                onError={() => setIframeError(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreviewModal;
