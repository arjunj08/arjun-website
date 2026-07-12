"use client";

import React, { useState, useEffect } from "react";
import { BookPage, BookSettings } from "@/lib/types";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import BookContainer from "@/components/book/BookContainer";

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
});

const SPARKLES = [
  { left: "84vw", top: "14vh", size: 5, flare: "84px" },
  { left: "68vw", top: "26vh", size: 4, flare: "64px" },
  { left: "24vw", top: "20vh", size: 4, flare: "60px" },
  { left: "90vw", top: "52vh", size: 3.5, flare: "56px" },
  { left: "10vw", top: "45vh", size: 3, flare: "40px" },
  { left: "45vw", top: "10vh", size: 4, flare: "50px" },
  { left: "30vw", top: "75vh", size: 3.5, flare: "48px" },
  { left: "75vw", top: "80vh", size: 3, flare: "42px" },
];

export default function ReaderPage() {
  const [activePhase, setActivePhase] = useState<"loading" | "intro" | "reading">("loading");
  const [skipIntroTriggered, setSkipIntroTriggered] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  // Data states
  const [settings, setSettings] = useState<BookSettings | null>(null);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleIntroComplete = () => {
    sessionStorage.setItem("has_seen_intro", "true");
    setActivePhase("reading");
  };

  const handleSkipIntro = () => {
    setSkipIntroTriggered(true);
  };

  const handleOpenBook = () => {
    setIsOpening(true);
    
    // Smoothly transition into the open book pages after the 3D cover opens (3.8 seconds)
    setTimeout(() => {
      handleIntroComplete();
    }, 3800);
  };

  const handleCloseBook = () => {
    setIsOpening(false);
    setSkipIntroTriggered(false);
    sessionStorage.removeItem("has_seen_intro");
    setActivePhase("intro");
  };

  // Catch client runtime errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setClientError(`${event.message}\n${event.error?.stack || ""}`);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [settingsRes, pagesRes, authRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/pages"),
        fetch("/api/auth/me"),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
      if (pagesRes.ok) {
        const data = await pagesRes.json();
        setPages(data);
      }
      
      const isFirebase = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!isFirebase) {
        setIsAdmin(true);
      } else if (authRes.ok) {
        const authData = await authRes.json();
        setIsAdmin(authData.authenticated);
      }
    } catch (err) {
      console.error("Fetch initial data error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle phase transitions
  useEffect(() => {
    if (!settings) return;

    // Detect if WebGL is supported in the browser
    const hasWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    // Check if intro has been seen this session or WebGL is missing
    const hasSeenIntro = sessionStorage.getItem("has_seen_intro");
    if (hasSeenIntro || !hasWebGL()) {
      setActivePhase("reading");
      return;
    }

    setActivePhase("intro");

    // Progress loader simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    // Fade-in "Skip Intro" button after 1.5 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimer);
    };
  }, [settings]);

  // Prevent blank flash with premium dark loading layout
  if (activePhase === "loading" || !settings) {
    return (
      <div className="fixed inset-0 bg-[#050508] flex flex-col justify-center items-center text-stone-300 z-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <span className="text-sm font-serif italic tracking-wider">Unfolding The Living Book...</span>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#050508] overflow-hidden flex flex-col justify-center items-center">
      {/* Background Alignment Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />

      {/* Twinkling Flare Sparkle Stars */}
      {activePhase === "intro" && SPARKLES.map((spark, idx) => (
        <div
          key={idx}
          className="sparkle-star"
          style={{
            left: spark.left,
            top: spark.top,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            "--flare": spark.flare,
            animationDelay: `${idx * 0.4}s`,
          } as any}
        />
      ))}

      {clientError && (
        <div className="absolute top-4 left-4 right-4 bg-rose-900/95 text-rose-100 p-4 rounded-xl border border-rose-800 z-50 text-xs font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto pointer-events-auto shadow-2xl">
          <strong className="block text-sm mb-1">Client-Side Runtime Exception:</strong>
          {clientError}
        </div>
      )}
      
      {/* 3D Scene viewport (Starfield + Nebula always alive, Book only alive in Phase 1) */}
      <Scene
        showBook={activePhase === "intro"}
        isOpening={isOpening}
        title={settings.coverTitle}
        author={settings.author}
        accentColor={settings.accentColor}
        onIntroComplete={handleIntroComplete}
        skipIntroTriggered={skipIntroTriggered}
        onOpenTrigger={handleOpenBook}
      />

      {/* PHASE 1: Cinematic Intro Overlays */}
      {activePhase === "intro" && (
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 select-none">
          
          {/* Header Bar */}
          <div className="w-full flex justify-between items-center animate-fade-in">
            <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold font-serif">
              The Living Book
            </span>
            <a
              href="/admin"
              className="text-xs font-serif text-indigo-455 hover:text-indigo-350 transition-colors bg-stone-950/45 px-4 py-2 rounded-full border border-stone-800 pointer-events-auto shadow-md"
            >
              Admin Portal
            </a>
          </div>

          {isOpening ? (
            /* Cinematic Introduction Sequence (Introduces the Professor) */
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 animate-fade-in">
              <div className="flex flex-col gap-5 max-w-xl animate-fade-in bg-stone-955/20 p-8 rounded-2xl border border-white/5 backdrop-blur-[2px] shadow-2xl">
                <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-bold font-serif animate-pulse">
                  Interactive Lecture Series
                </span>
                
                <h2 className="font-serif text-4xl md:text-5xl text-stone-100 tracking-wide font-light uppercase leading-snug">
                  By {settings.author}
                </h2>
                
                <div className="w-[60px] h-[1px] bg-indigo-500/40 mx-auto my-1" />
                
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400 font-medium">
                  Opening: {settings.title}
                </p>
              </div>
            </div>
          ) : (
            /* Main Hero Split Content */
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-8 mt-4">
              
              {/* Left Column: Hero Text */}
              <div className="w-full md:w-1/2 flex flex-col items-start text-left gap-4 md:gap-6 animate-slide-up pointer-events-auto">
                <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold">
                  Cinematic Interactive Edition
                </span>
                <h1 className="font-serif text-4xl md:text-6xl text-white font-bold leading-tight uppercase tracking-wide">
                  {settings.title}
                </h1>
                <p className="text-sm font-serif italic text-stone-300">
                  By {settings.author}
                </p>
                <p className="text-sm text-stone-400 leading-relaxed font-sans max-w-md">
                  {settings.description}
                </p>

                {progress < 100 ? (
                  /* Loading Progress */
                  <div className="flex flex-col items-start gap-2 w-full max-w-xs mt-4">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold font-serif">
                      Aligning Quantum Realities {progress}%
                    </span>
                    <div className="w-full h-[2px] bg-stone-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-slate-400 to-sky-400 transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Interactive Action Buttons */
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <button
                      onClick={handleOpenBook}
                      disabled={isOpening}
                      className="relative group overflow-hidden bg-slate-900 border border-slate-700/60 hover:bg-slate-850 hover:border-slate-500/80 text-slate-200 font-serif font-bold text-xs tracking-widest uppercase py-3.5 px-8 rounded-full shadow-[0_4px_25px_rgba(255,255,255,0.05),_inset_0_1px_2px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.03] active:scale-97 disabled:opacity-50"
                    >
                      {isOpening ? "Opening Chronicles..." : "Open Book & Read"}
                    </button>
                    {showSkipButton && (
                      <button
                        onClick={handleSkipIntro}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-xs tracking-wider uppercase py-3.5 px-6 rounded-full shadow-lg transition-all active:scale-95"
                      >
                        Skip Intro
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Empty space for 3D Book rendering */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[500px] pointer-events-none" />
            </div>
          )}

          {/* Footer branding */}
          <div className="text-center text-[10px] text-stone-500 uppercase tracking-widest mt-6">
            © 2026 Interactive Cinematic Editions. All rights reserved.
          </div>
        </div>
      )}


      {/* PHASE 2 & 3: Double-Page Book UI */}
      {activePhase === "reading" && (
        <div className="w-full max-w-6xl flex flex-col justify-center items-center z-10 p-4 md:p-8 animate-fade-in relative gap-4">
          
          {/* Header toolbar */}
          <div className="w-full flex justify-between items-center mb-2 px-4 pointer-events-auto">
            <button
              onClick={handleCloseBook}
              className="text-xs font-serif text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 bg-stone-950/60 hover:bg-stone-900/60 px-4 py-2 rounded-full border border-stone-850 shadow-md cursor-pointer"
            >
              ← Close Book & Return
            </button>
            <a
              href="/admin"
              className="text-xs font-serif text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 bg-stone-950/45 px-4 py-2 rounded-full border border-stone-800 shadow-md"
            >
              Write/Edit Chapters →
            </a>
          </div>

          <BookContainer
            settings={settings}
            pages={pages}
            isAdmin={isAdmin}
            onRefresh={fetchData}
          />
        </div>
      )}
    </main>
  );
}
