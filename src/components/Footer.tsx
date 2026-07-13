import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import DotField from './DotField';

const Footer = () => {
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
          <h2 className="text-3xl font-bold tracking-tight mb-2">Let's Connect</h2>
          {/* Social Links */}
          <div className="flex gap-6">
            <a 
              href="https://github.com/Sanmati-Ukhalkar" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-background/50 backdrop-blur hover:bg-card border border-white/5 rounded-full transition-all hover-scale-snap hover:border-purple-500/50"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/sanmati-ukhalkar-2657bb418/" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-background/50 backdrop-blur hover:bg-card border border-white/5 rounded-full transition-all hover-scale-snap hover:border-purple-500/50"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:sanmatiukhalkar2004@gmail.com" 
              className="p-4 bg-background/50 backdrop-blur hover:bg-card border border-white/5 rounded-full transition-all hover-scale-snap hover:border-purple-500/50"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

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