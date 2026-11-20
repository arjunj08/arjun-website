import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowRight, 
  Copy, 
  Download, 
  ExternalLink, 
  Mail, 
  FolderGit2, 
  Compass, 
  Volume2, 
  VolumeX, 
  Check 
} from 'lucide-react';
import { config } from '../constants/config';
import { projects } from '../constants/projects';
import { sound } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProjectModal?: (projectId: string) => void;
}

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Projects' | 'Actions';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose,
  onOpenProjectModal 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [soundActive, setSoundActive] = useState(sound.isEnabled());
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playModal();
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    sound.playSuccess();
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
      onClose();
    }, 1000);
  };

  const scrollTo = (id: string) => {
    onClose();
    sound.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const items: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home / Hero',
      subtitle: 'Return to top overview',
      icon: <Compass className="w-4 h-4 text-primary" />,
      action: () => scrollTo('home'),
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Featured Work',
      subtitle: 'Autonomous agents & AI systems',
      icon: <FolderGit2 className="w-4 h-4 text-primary" />,
      action: () => scrollTo('projects'),
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      title: 'A Little About Me',
      subtitle: 'Background & education story',
      icon: <Compass className="w-4 h-4 text-secondary" />,
      action: () => scrollTo('about'),
    },
    {
      id: 'nav-what-i-do',
      category: 'Navigation',
      title: 'What I Do',
      subtitle: 'Core competencies & engineering domains',
      icon: <Compass className="w-4 h-4 text-primary" />,
      action: () => scrollTo('what-i-do'),
    },
    {
      id: 'nav-timeline',
      category: 'Navigation',
      title: 'My Journey / Timeline',
      subtitle: 'Education, startups & achievements',
      icon: <Compass className="w-4 h-4 text-secondary" />,
      action: () => scrollTo('timeline'),
    },
    {
      id: 'nav-stats',
      category: 'Navigation',
      title: 'Open Source & Stats',
      subtitle: 'GitHub analytics & contributions',
      icon: <Compass className="w-4 h-4 text-secondary" />,
      action: () => scrollTo('stats'),
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Start a Conversation',
      subtitle: 'Get in touch & direct channels',
      icon: <Mail className="w-4 h-4 text-primary" />,
      action: () => scrollTo('contact'),
    },

    // Projects Direct Launch
    ...projects.map((p) => ({
      id: `proj-${p.id}`,
      category: 'Projects' as const,
      title: p.title,
      subtitle: `${p.subtitle} • ${p.tech.slice(0, 3).join(', ')}`,
      icon: <FolderGit2 className="w-4 h-4 text-secondary" />,
      action: () => {
        onClose();
        if (onOpenProjectModal) {
          onOpenProjectModal(p.id);
        } else {
          scrollTo('projects');
        }
      },
    })),

    // Quick Actions
    {
      id: 'act-copy-email',
      category: 'Actions',
      title: copiedKey === 'email' ? 'Email Copied!' : 'Copy Personal Email',
      subtitle: config.emails.personal,
      icon: copiedKey === 'email' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-primary" />,
      action: () => handleCopy(config.emails.personal, 'email'),
    },
    {
      id: 'act-copy-asu-email',
      category: 'Actions',
      title: copiedKey === 'asu' ? 'ASU Email Copied!' : 'Copy ASU Student Email',
      subtitle: config.emails.asu,
      icon: copiedKey === 'asu' ? <Check className="w-4 h-4 text-success" /> : <Mail className="w-4 h-4 text-secondary" />,
      action: () => handleCopy(config.emails.asu, 'asu'),
    },
    {
      id: 'act-download-resume',
      category: 'Actions',
      title: 'Download Resume',
      subtitle: 'Opens /resume.pdf',
      icon: <Download className="w-4 h-4 text-primary" />,
      action: () => {
        sound.playSuccess();
        const a = document.createElement('a');
        a.href = '/resume.pdf';
        a.download = 'resume.pdf';
        a.click();
        onClose();
      },
    },
    {
      id: 'act-toggle-sound',
      category: 'Actions',
      title: soundActive ? 'Disable Sound FX' : 'Enable Sound FX',
      subtitle: soundActive ? 'Mute synthesized micro-haptics' : 'Turn on synthesized micro-audio ticks',
      icon: soundActive ? <VolumeX className="w-4 h-4 text-textMuted" /> : <Volume2 className="w-4 h-4 text-secondary" />,
      action: () => {
        const next = sound.toggle();
        setSoundActive(next);
      },
    },
    {
      id: 'act-github',
      category: 'Actions',
      title: 'View GitHub Profile',
      subtitle: config.githubUrl,
      icon: <ExternalLink className="w-4 h-4 text-secondary" />,
      action: () => {
        sound.playClick();
        window.open(config.githubUrl, '_blank');
        onClose();
      },
    },
    {
      id: 'act-linkedin',
      category: 'Actions',
      title: 'View LinkedIn Profile',
      subtitle: config.linkedinUrl,
      icon: <ExternalLink className="w-4 h-4 text-primary" />,
      action: () => {
        sound.playClick();
        window.open(config.linkedinUrl, '_blank');
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sound.playHover();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sound.playHover();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-28 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#08090C]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e111a]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(124,92,255,0.15)] overflow-hidden flex flex-col z-10 transition-all duration-300 animate-in fade-in zoom-in-95"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, project, or jump to section..."
            className="w-full bg-transparent text-white font-body text-sm md:text-base outline-none placeholder:text-textMuted/60"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-code uppercase text-textMuted bg-white/[0.05] border border-white/[0.08]">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-textMuted font-body text-sm">
              No matching commands or projects found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => {
                    setSelectedIndex(index);
                    sound.playHover();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                    isSelected 
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/15 border border-primary/30 text-white' 
                      : 'hover:bg-white/[0.03] text-textMuted border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/[0.02] border-white/[0.05]'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className={`font-display text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="font-code text-[11px] text-textMuted truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-code uppercase tracking-widest text-textMuted/60 px-2 py-0.5 rounded bg-white/[0.02]">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-secondary' : 'opacity-0'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-5 py-3 border-t border-white/[0.06] bg-black/30 flex items-center justify-between text-[11px] font-code text-textMuted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd> select
            </span>
          </div>
          <span className="text-secondary/80 font-medium">
            J. Arjun v2 Portfolio
          </span>
        </div>
      </div>
    </div>
  );
};
export default CommandPalette;
