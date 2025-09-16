import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import profileImage from '/images/projects/my_photo.png';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-20">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8 animate-fade-in-smooth">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight animate-slide-up-delayed" style={{ animationDelay: '0.2s' }}>
              Sanmati Ukhalkar
            </h1>
            <p className="text-xl lg:text-2xl text-secondary font-medium animate-slide-up-delayed" style={{ animationDelay: '0.4s' }}>
              Frontend Developer | AI & Data Science Enthusiast
            </p>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed animate-slide-up-delayed" style={{ animationDelay: '0.6s' }}>
              I build fast, modern, and futuristic digital experiences with a focus on performance and design.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delayed" style={{ animationDelay: '0.8s' }}>
            <Button variant="hero-outline" size="lg" className="text-lg px-8 py-3">
              View Work
            </Button>
            <Button variant="hero" size="lg" className="text-lg px-8 py-3">
              Download CV
            </Button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 pt-4 animate-scale-in" style={{ animationDelay: '1s' }}>
            <a 
              href="#" 
              className="p-3 border border-border hover:border-primary transition-all duration-300 hover-lift-shadow rounded-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 icon-bounce" />
            </a>
            <a 
              href="#" 
              className="p-3 border border-border hover:border-primary transition-all duration-300 hover-lift-shadow rounded-lg"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 icon-bounce" />
            </a>
            <a 
              href="#" 
              className="p-3 border border-border hover:border-primary transition-all duration-300 hover-lift-shadow rounded-lg"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 icon-bounce" />
            </a>
          </div>
        </div>

        {/* Right Column - Profile Image */}
        <div className="flex justify-center lg:justify-end animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <div className="relative group">
            <div className="absolute inset-0 glow-soft rounded-full blur-3xl bg-glow/30 group-hover:bg-glow/40 transition-all duration-500"></div>
            <img
              src={profileImage}
              alt="Sanmati Ukhalkar - Frontend Developer"
              className="relative w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-full border-2 border-border transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;