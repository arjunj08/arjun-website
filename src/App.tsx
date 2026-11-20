import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Cursor } from './components/Cursor';
import { Landing } from './components/Landing';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { WhatIDo } from './components/WhatIDo';
import { Timeline } from './components/Timeline';
import { GitHubStats } from './components/GitHubStats';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { useLenis } from './hooks/useLenis';
import { config } from './constants/config';
import { projects, Project } from './constants/projects';

function App() {
  const [loading, setLoading] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Initialize smooth scroll
  useLenis();

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenProjectFromPalette = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setSelectedProject(found);
    }
  };

  return (
    <>
      <Helmet>
        <title>{config.meta.title}</title>
        <meta name="description" content={config.meta.description} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={config.meta.title} />
        <meta property="og:description" content={config.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={config.meta.url} />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.meta.title} />
        <meta name="twitter:description" content={config.meta.description} />
        <meta name="twitter:image" content="/og-image.png" />
        
        <link rel="canonical" href={config.meta.url} />
      </Helmet>

      {/* Global Cursor */}
      <Cursor />

      {/* Global Noise Overlay */}
      <div className="bg-noise" />

      {/* Background Grid Lines in neutral dark styling */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 lg:px-24">
        <div className="w-[1px] h-full bg-white/[0.02]" />
        <div className="hidden md:block w-[1px] h-full bg-white/[0.01]" />
        <div className="hidden lg:block w-[1px] h-full bg-white/[0.01]" />
        <div className="w-[1px] h-full bg-white/[0.02]" />
      </div>

      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Command Palette Spotlight Modal */}
      <CommandPalette 
        isOpen={paletteOpen} 
        onClose={() => setPaletteOpen(false)}
        onOpenProjectModal={handleOpenProjectFromPalette}
      />

      {/* Navbar overlay */}
      {!loading && (
        <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
      )}

      {/* Streamlined Section Architecture: Projects leads directly after Hero */}
      <main className={`relative w-full min-h-screen ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-700'}`}>
        <Landing />
        <Projects 
          externalSelectedProject={selectedProject}
          onClearExternalProject={() => setSelectedProject(null)}
        />
        <About />
        <WhatIDo />
        <Timeline />
        <GitHubStats />
        <Achievements />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

export default App;
