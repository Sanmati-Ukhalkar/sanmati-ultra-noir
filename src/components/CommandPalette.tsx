import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, FolderGit2, Activity, Sparkles, Mail, Github, Linkedin, Download, PartyPopper } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { projects } from '@/data/projects';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'learning', label: 'Activity & Learning', icon: Activity },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'footer', label: 'Contact', icon: Mail },
];

/** Global Ctrl/Cmd+K quick-nav — jump to any section, open a project case
 * study, hit an external link, or trigger the avatar's celebrate pose. */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const goToSection = useCallback((id: string) => {
    setOpen(false);
    // Give the dialog a beat to close before scrolling, matches other nav flows.
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, []);

  const goExternal = useCallback((url: string) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Quick navigation</DialogTitle>
      <DialogDescription className="sr-only">
        Jump to a section, open a project case study, or follow a link.
      </DialogDescription>
      <CommandInput placeholder="Jump to a section, project, or link…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <CommandItem key={id} onSelect={() => goToSection(id)}>
              <Icon />
              <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.slug}
              onSelect={() => { setOpen(false); navigate(`/projects/${p.slug}`); }}
            >
              <FolderGit2 />
              <span>{p.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem onSelect={() => goExternal('https://github.com/Sanmati-Ukhalkar')}>
            <Github />
            <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => goExternal('https://www.linkedin.com/in/sanmati-ukhalkar-2657bb418/')}>
            <Linkedin />
            <span>LinkedIn</span>
          </CommandItem>
          <CommandItem onSelect={() => goExternal('mailto:sanmatiukhalkar2004@gmail.com')}>
            <Mail />
            <span>Email</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              const link = document.createElement('a');
              link.href = '/documents/Sanmati_Ukhalkar_CV.pdf';
              link.download = 'Sanmati_Ukhalkar_CV.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download />
            <span>Download CV</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Fun">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent('avatar:celebrate'));
            }}
          >
            <PartyPopper />
            <span>Make the companion celebrate</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="border-t px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
        <span>Quick nav</span>
        <CommandShortcut>Ctrl K</CommandShortcut>
      </div>
    </CommandDialog>
  );
};

export default CommandPalette;
