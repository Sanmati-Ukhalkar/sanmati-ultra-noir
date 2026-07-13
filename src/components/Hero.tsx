import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import DotField from './DotField';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-10 sm:px-8 sm:py-20 overflow-hidden">
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
      <div className="max-w-4xl w-full flex flex-col items-center justify-center text-center relative z-10">
        <div className="space-y-8 animate-fade-in-smooth">
          <div className="space-y-4 w-full">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up-delayed" style={{ animationDelay: '0.2s' }}>
              Sanmati Ukhalkar
            </h1>
            <p className="text-lg xs:text-xl sm:text-2xl text-secondary font-medium animate-slide-up-delayed" style={{ animationDelay: '0.4s' }}>
              Python Developer | AI, ML & Data Science
            </p>
            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed animate-slide-up-delayed" style={{ animationDelay: '0.6s' }}>
              I build intelligent, data-driven solutions and futuristic digital experiences with a focus on machine learning and performance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delayed items-center justify-center pt-4" style={{ animationDelay: '0.8s' }}>
            <Button variant="hero-outline" size="lg" className="text-lg px-8 py-3">
              View Work
            </Button>
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/documents/Sanmati_Ukhalkar_CV.pdf';
                link.download = 'Sanmati_Ukhalkar_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download CV
            </Button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 sm:gap-6 pt-4 animate-scale-in justify-center" style={{ animationDelay: '1s' }}>
            <a 
              href="https://www.linkedin.com/in/sanmati-ukhalkar-2657bb418/" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border hover:border-primary transition-all duration-300 hover-lift-shadow rounded-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 icon-bounce" />
            </a>
            <a 
              href="https://github.com/Sanmati-Ukhalkar" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border hover:border-primary transition-all duration-300 hover-lift-shadow rounded-lg"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 icon-bounce" />
            </a>
            <a 
              href="mailto:sanmatiukhalkar2004@gmail.com" 
              className="p-3 border border-border hover:border-primary transition-all duration-300 hover-lift-shadow rounded-lg"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 icon-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;