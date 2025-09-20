import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-border py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Links */}
          <div className="flex gap-6">
            <a 
              href="https://github.com/Sanmati-Ukhalkar" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-card rounded-lg transition-colors hover-scale-snap"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/sanmati-ukhalkar" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-card rounded-lg transition-colors hover-scale-snap"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:sanmatiukhalkar2004@gmail.com" 
              className="p-3 hover:bg-card rounded-lg transition-colors hover-scale-snap"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-center">
            2025 Sanmati Ukhalkar. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;