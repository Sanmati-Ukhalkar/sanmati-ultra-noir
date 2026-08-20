import React from 'react';
import { Github, Linkedin, Mail, Zap } from 'lucide-react';
import DotField from './DotField';

const SITE_URL = 'https://sanmatiukhalkar.com/';
const CONTACT_CTA_COPY = "Open to Data Engineering & AI/ML roles — let's talk.";

const Footer = ({ ctaCopy = CONTACT_CTA_COPY }: { ctaCopy?: string }) => {
  return (
    <footer className="relative bg-background-secondary border-t border-border py-24 px-8 overflow-hidden">
      {/* Background Dots Effect */}
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={2}
          dotSpacing={18}
          bulgeStrength={106}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={700}
          cursorForce={0.68}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center max-w-md">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Let's Connect</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {ctaCopy}
            </p>
          </div>

          {/* Social Links & CV Download */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-4">
              <a 
                href="https://github.com/Sanmati-Ukhalkar" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-background/50 backdrop-blur hover:bg-card border border-border rounded-full transition-all hover-scale-snap hover:border-primary/50"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/sanmati-ukhalkar-2657bb418/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-background/50 backdrop-blur hover:bg-card border border-border rounded-full transition-all hover-scale-snap hover:border-primary/50"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:sanmatiukhalkar2004@gmail.com" 
                className="p-3.5 bg-background/50 backdrop-blur hover:bg-card border border-border rounded-full transition-all hover-scale-snap hover:border-primary/50"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/documents/Sanmati_Ukhalkar_CV.pdf';
                link.download = 'Sanmati_Ukhalkar_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2"
            >
              Download CV 📄
            </button>
          </div>

          {/* Performance flex */}
          <a
            href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest hover:bg-primary/20 transition-colors"
          >
            <Zap size={14} />
            Check Performance ↗
          </a>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm mt-4">
            &copy; 2026 Sanmati Ukhalkar. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;