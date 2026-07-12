"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookPage, BookSettings } from "@/lib/types";
import dynamic from "next/dynamic";

const PageReader = dynamic(() => import("./PageReader"), {
  ssr: false,
});
import { ArrowLeft, ArrowRight, BookOpen, Edit2, CheckCircle2, AlertCircle, Loader2, Sparkles, Compass } from "lucide-react";
import gsap from "gsap";

const CornerOrnament = ({ className }: { className?: string }) => (
  <svg className={`absolute w-6 h-6 text-stone-400/25 pointer-events-none z-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
    <path d="M 2,22 L 2,2 C 2,2 8,2 10,4 C 12,6 8,10 4,10 C 2,10 2,10 2,12" />
    <path d="M 22,2 L 2,2 C 2,2 2,8 4,10 C 6,12 10,8 10,4" />
    <circle cx="2" cy="2" r="0.8" fill="currentColor" />
  </svg>
);

interface BookContainerProps {
  settings: BookSettings;
  pages: BookPage[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export default function BookContainer({
  settings,
  pages,
  isAdmin,
  onRefresh,
}: BookContainerProps) {
  // Page state: 0 is Table of Contents, 1+ are chapters
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bioCountdown, setBioCountdown] = useState(12);

  const bookFrameRef = useRef<HTMLDivElement>(null);
  const flipOverlayRef = useRef<HTMLDivElement>(null);
  const flipPageRef = useRef<HTMLDivElement>(null);
  const leftPageShadowRef = useRef<HTMLDivElement>(null);
  const rightPageShadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync session view counts
  const incrementView = async (pageId: string) => {
    try {
      await fetch(`/api/pages/${pageId}/view`, { method: "POST" });
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  // Flip Page Animation
  const handlePageTransition = (targetIndex: number) => {
    if (isFlipping || targetIndex === currentPageIndex) return;
    if (targetIndex < 0 || targetIndex > pages.length) return;

    // Check auth/publish constraints
    if (targetIndex > 0) {
      const targetPage = pages[targetIndex - 1];
      if (!targetPage.published && !isAdmin) {
        return; // Can't view draft if not admin
      }
    }

    setIsEditMode(false); // Turn off edit mode on page change
    setIsFlipping(true);

    const isForward = targetIndex > currentPageIndex;

    // Mobile has simple slide-fade transition
    if (isMobile) {
      gsap.to(bookFrameRef.current, {
        opacity: 0,
        x: isForward ? -20 : 20,
        duration: 0.3,
        onComplete: () => {
          setCurrentPageIndex(targetIndex);
          if (targetIndex > 0) {
            incrementView(pages[targetIndex - 1].id!);
          }
          gsap.to(bookFrameRef.current, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            onComplete: () => setIsFlipping(false),
          });
        },
      });
      return;
    }

    // Desktop: Premium 3D Page Flip
    const overlay = flipOverlayRef.current;
    const flippingSheet = flipPageRef.current;
    const leftShadow = leftPageShadowRef.current;
    const rightShadow = rightPageShadowRef.current;

    if (!overlay || !flippingSheet) {
      setCurrentPageIndex(targetIndex);
      setIsFlipping(false);
      return;
    }

    // Set active overlay visibility
    overlay.style.display = "block";
    
    // Configure GSAP 3D properties
    gsap.set(flippingSheet, {
      transformOrigin: isForward ? "left center" : "right center",
      rotationY: 0,
      x: isForward ? "50%" : "0%", // start position
    });

    const flipTimeline = gsap.timeline({
      onComplete: () => {
        setCurrentPageIndex(targetIndex);
        if (targetIndex > 0) {
          incrementView(pages[targetIndex - 1].id!);
        }
        overlay.style.display = "none";
        setIsFlipping(false);
        // Clear shadow opacities
        if (leftShadow) leftShadow.style.opacity = "0";
        if (rightShadow) rightShadow.style.opacity = "0";
      },
    });

    // Animate flipping rotation
    flipTimeline.to(flippingSheet, {
      rotationY: isForward ? -180 : 180,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // Shadow sweep overlay simulation
    if (leftShadow && rightShadow) {
      flipTimeline.fromTo(
        isForward ? rightShadow : leftShadow,
        { opacity: 0 },
        { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 1, ease: "sine.inOut" },
        0
      );
    }
  };

  // Auto-flip from Professor Bio page (page 0) to Table of Contents (page 1) after 12s
  useEffect(() => {
    if (currentPageIndex !== 0) return;

    setBioCountdown(12);

    const interval = setInterval(() => {
      setBioCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handlePageTransition(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPageIndex]);

  // Admin New Chapter helper (grouped by sections)
  const handleCreateChapter = async (section: "lifestyle" | "cars" | "writing") => {
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section }),
      });
      if (res.ok) {
        onRefresh();
        // Move to the newly created page
        setTimeout(() => {
          setCurrentPageIndex(pages.length + 2); // Shifted for new pages
          setIsEditMode(true);
        }, 300);
      }
    } catch (err) {
      console.error("Create page error:", err);
    }
  };

  // Helper for first chapter
  const handleCreateFirstChapter = async () => {
      await handleCreateChapter("lifestyle");
  };

  // Render Left Page
  const renderLeftPage = () => {
    if (currentPageIndex === 0) {
      // Title Page
      return (
        <div className="flex flex-col justify-between h-full p-8 select-none text-stone-800 relative z-10">
          {/* Page margin frames and corners */}
          <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
            <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
          </div>
          <CornerOrnament className="top-6 left-6" />
          <CornerOrnament className="top-6 right-6 rotate-90" />
          <CornerOrnament className="bottom-6 left-6 -rotate-90" />
          <CornerOrnament className="bottom-6 right-6 rotate-180" />

          <div className="text-center mt-6 animate-slide-up relative z-10" style={{ animationDelay: "0.1s" }}>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">The Living Book</span>
            <div className="w-16 h-[1px] bg-stone-300 mx-auto my-3" />
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 font-bold leading-tight uppercase my-4">
              {settings.title}
            </h1>
            <p className="text-sm font-serif italic text-stone-600 mt-2">By {settings.author}</p>
          </div>

          <div className="flex flex-col items-center my-6 animate-slide-up relative z-10" style={{ animationDelay: "0.25s" }}>
            {/* Emblem */}
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-300 rotate-45 mb-4"
              style={{ borderColor: `${settings.accentColor}30` }}
            >
              <div
                className="w-8 h-8 rounded-full border border-stone-400 bg-stone-50 flex items-center justify-center -rotate-45"
                style={{ backgroundColor: `${settings.accentColor}10` }}
              >
                <BookOpen className="w-4 h-4 animate-pulse" style={{ color: settings.accentColor }} />
              </div>
            </div>
            <p className="text-center text-sm font-serif text-stone-500 max-w-xs leading-relaxed px-4">
              {settings.description}
            </p>
          </div>

          <div className="text-center mb-6 text-xs text-stone-400 font-serif animate-slide-up relative z-10" style={{ animationDelay: "0.4s" }}>
            Interactive Cinematic Editions
          </div>
        </div>
      );
    } else if (currentPageIndex === 1) {
      // Table of Contents (now on Left Page of index 1)
      const publishedPages = isAdmin ? pages : pages.filter((p) => p.published);
      const lifestylePages = publishedPages.filter((p) => p.section === "lifestyle");
      const carsPages = publishedPages.filter((p) => p.section === "cars");
      const writingPages = publishedPages.filter((p) => !p.section || p.section === "writing");

      const getRomanNumeral = (num: number): string => {
        const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
        return roman[num - 1] || num.toString();
      };

      const renderSectionItems = (sectionPages: BookPage[], sectionName: "lifestyle" | "cars" | "writing") => {
        if (sectionPages.length === 0) {
          return (
            <p className="text-[11px] text-stone-450 font-serif italic pl-6 py-2">
              No articles in this section yet.
            </p>
          );
        }

        return (
          <ul className="space-y-1 mt-1 relative z-25">
            {sectionPages.map((page, idx) => {
              const trueIndex = pages.findIndex((p) => p.id === page.id) + 2;

              return (
                <li
                  key={page.id}
                  onClick={() => handlePageTransition(trueIndex)}
                  className="group cursor-pointer py-1.5 px-2 rounded-lg hover:bg-stone-500/5 hover:translate-x-1 transition-all flex items-center justify-between pointer-events-auto"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-serif text-xs font-bold text-amber-700/60 group-hover:text-amber-800 transition-colors w-6">
                      {getRomanNumeral(page.chapterNumber || idx + 1)}
                    </span>
                    <span className="font-serif text-xs font-semibold text-stone-850 group-hover:text-stone-950 group-hover:underline truncate max-w-[170px]">
                      {page.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-10 border-b border-dashed border-stone-300 group-hover:border-amber-600/30 transition-colors" />
                    {isAdmin && !page.published && (
                      <span className="bg-amber-50 text-amber-700 text-[7px] uppercase font-bold px-1 rounded border border-amber-100">
                        Draft
                      </span>
                    )}
                    <span className="text-[10px] font-serif font-bold text-stone-500 group-hover:text-amber-800">
                      p. {trueIndex * 2 - 2}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        );
      };

      return (
        <div className="flex flex-col h-full p-8 text-stone-850 relative z-10">
          {/* Page margin frames and corners */}
          <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
            <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
          </div>
          <CornerOrnament className="top-6 left-6" />
          <CornerOrnament className="top-6 right-6 rotate-90" />
          <CornerOrnament className="bottom-6 left-6 -rotate-90" />
          <CornerOrnament className="bottom-6 right-6 rotate-180" />

          <div className="border-b border-stone-250 pb-2 mb-4 animate-slide-up relative z-10" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-serif font-bold text-stone-900 tracking-wide uppercase">
              Table of Contents
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 scrollbar-paper relative z-10 space-y-5">
            {/* Section 1: Lifestyle */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-stone-600">Lifestyle</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleCreateChapter("lifestyle")}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-serif font-semibold pointer-events-auto"
                  >
                    + Add
                  </button>
                )}
              </div>
              {renderSectionItems(lifestylePages, "lifestyle")}
            </div>

            {/* Section 2: Cars */}
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-stone-600">Cars</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleCreateChapter("cars")}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-serif font-semibold pointer-events-auto"
                  >
                    + Add
                  </button>
                )}
              </div>
              {renderSectionItems(carsPages, "cars")}
            </div>

            {/* Section 3: Writing */}
            <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-stone-600">Writing</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleCreateChapter("writing")}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-serif font-semibold pointer-events-auto"
                  >
                    + Add
                  </button>
                )}
              </div>
              {renderSectionItems(writingPages, "writing")}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // Render Right Page
  const renderRightPage = () => {
    if (currentPageIndex === 0) {
      // Professor Bio Page
      return (
        <div className="flex flex-col justify-between h-full p-8 text-stone-850 select-none relative z-10">
          {/* Page margin frames and corners */}
          <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
            <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
          </div>
          <CornerOrnament className="top-6 left-6" />
          <CornerOrnament className="top-6 right-6 rotate-90" />
          <CornerOrnament className="bottom-6 left-6 -rotate-90" />
          <CornerOrnament className="bottom-6 right-6 rotate-180" />

          <div className="flex flex-col items-center text-center mt-4 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-500 font-bold font-serif animate-slide-up" style={{ animationDelay: "0.1s" }}>
              About The Instructor
            </span>
            <div className="w-10 h-[1px] bg-stone-300 my-2" />
            
            {/* Portrait Frame inside book */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-stone-300 flex items-center justify-center bg-stone-100/50 shadow-inner my-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 animate-pulse" />
              <svg className="w-14 h-14 text-stone-400/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            <h2 className="font-serif text-2xl text-stone-900 font-semibold mb-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              {settings.author}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm font-serif px-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              {settings.description}
            </p>
          </div>

          {/* Countdown & skip controls */}
          <div className="w-full flex items-center justify-between mt-4 pt-4 border-t border-stone-200 text-xs animate-slide-up relative z-10" style={{ animationDelay: "0.5s" }}>
            <span className="text-[10px] text-stone-400 font-serif italic">
              {bioCountdown > 0 ? `Opening contents in ${bioCountdown}s...` : "Entering lectures..."}
            </span>
            <button
              onClick={() => handlePageTransition(1)}
              className="text-[10px] uppercase tracking-wider font-semibold font-serif text-indigo-600 hover:text-indigo-800 transition-colors pointer-events-auto"
            >
              Skip Bio →
            </button>
          </div>
        </div>
      );
    } else if (currentPageIndex === 1) {
      // Cosmic quote page on right side of TOC
      return (
        <div className="h-full p-8 flex flex-col justify-center items-center text-center select-none font-serif relative z-10">
          {/* Page margin frames and corners */}
          <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
            <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
          </div>
          <CornerOrnament className="top-6 left-6" />
          <CornerOrnament className="top-6 right-6 rotate-90" />
          <CornerOrnament className="bottom-6 left-6 -rotate-90" />
          <CornerOrnament className="bottom-6 right-6 rotate-180" />

          <p className="text-stone-400 italic text-sm max-w-xs leading-relaxed animate-slide-up relative z-10" style={{ animationDelay: "0.2s" }}>
            "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."
          </p>
          <div className="w-8 h-[1px] bg-stone-200 my-4 relative z-10" />
          <span className="text-[10px] text-stone-400 uppercase tracking-widest relative z-10 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            — Carl Sagan
          </span>
        </div>
      );
    } else {
      // Empty right page layout / spine flow handles it since column flow spreads text to the right page
      return (
        <div className="h-full p-8 flex flex-col justify-end text-right animate-slide-up relative z-10">
          {/* Page margin frames and corners */}
          <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
            <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
          </div>
          <CornerOrnament className="top-6 left-6" />
          <CornerOrnament className="top-6 right-6 rotate-90" />
          <CornerOrnament className="bottom-6 left-6 -rotate-90" />
          <CornerOrnament className="bottom-6 right-6 rotate-180" />

          {/* Subtle logo emblem */}
          <div className="opacity-15 font-serif text-[10px] uppercase tracking-widest text-stone-600 mb-2 select-none relative z-10">
            {settings.title}
          </div>
          <span className="text-xs text-stone-400 font-serif select-none relative z-10">
            Page {currentPageIndex * 2}
          </span>
        </div>
      );
    }
  };

  // Render Chapter Spread (Flows across both pages on desktop)
  const renderChapterSpread = () => {
    const page = pages[currentPageIndex - 2];
    if (!page) return null;

    return (
      <div className="w-full h-full flex flex-col p-8 px-12 relative z-10">
        {/* Page margin frames and corners for Left Page of Chapter */}
        {!isMobile && (
          <>
            <div className="absolute inset-y-5 left-5 right-1/2 mr-4 border border-stone-300/35 pointer-events-none rounded-lg z-0">
              <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
            </div>
            <CornerOrnament className="top-6 left-6" />
            <CornerOrnament className="top-6 right-[calc(50%+1.5rem)] rotate-90" />
            <CornerOrnament className="bottom-6 left-6 -rotate-90" />
            <CornerOrnament className="bottom-6 right-[calc(50%+1.5rem)] rotate-180" />

            {/* Page margin frames and corners for Right Page of Chapter */}
            <div className="absolute inset-y-5 left-1/2 ml-4 right-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
              <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
            </div>
            <CornerOrnament className="top-6 left-[calc(50%+1.5rem)]" />
            <CornerOrnament className="top-6 right-6 rotate-90" />
            <CornerOrnament className="bottom-6 left-[calc(50%+1.5rem)] -rotate-90" />
            <CornerOrnament className="bottom-6 right-6 rotate-180" />
          </>
        )}

        {isMobile && (
          <>
            <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
              <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
            </div>
            <CornerOrnament className="top-6 left-6" />
            <CornerOrnament className="top-6 right-6 rotate-90" />
            <CornerOrnament className="bottom-6 left-6 -rotate-90" />
            <CornerOrnament className="bottom-6 right-6 rotate-180" />
          </>
        )}

        {/* Header Toolbar */}
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2 z-10 animate-slide-up relative" style={{ animationDelay: "0.1s" }}>
          <span className="text-sm font-serif font-semibold text-stone-600">
            Chapter {page.chapterNumber}
          </span>
          <div className="flex items-center gap-2">
            {/* Draft indicator */}
            {!page.published && (
              <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-200">
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Reader content (Flows across columns) */}
        <div className="flex-1 min-h-0 relative z-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <PageReader content={page.content} accentColor={settings.accentColor} />
        </div>

        {/* Left and Right Page Footers */}
        {!isMobile && (
          <>
            {/* Left Page Footer */}
            <div className="absolute left-12 bottom-8 text-xs text-stone-400 font-serif select-none z-10">
              Page {(currentPageIndex - 1) * 2 - 1}
            </div>
            {/* Right Page Footer */}
            <div className="absolute right-12 bottom-8 text-right text-xs text-stone-400 font-serif select-none z-10 flex flex-col items-end">
              <span className="opacity-15 text-[10px] uppercase tracking-widest text-stone-600 mb-1">
                {settings.title}
              </span>
              <span>Page {(currentPageIndex - 1) * 2}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  // Helper page counts
  const totalPages = pages.length;

  return (
    <div className="relative w-full max-w-5xl h-[650px] mx-auto z-10 p-4">
      
      {/* 3D Page Flip Overlay (Hidden unless active transition) */}
      <div
        ref={flipOverlayRef}
        className="absolute inset-0 z-50 pointer-events-none"
        style={{ display: "none", perspective: "1500px" }}
      >
        <div
          ref={flipPageRef}
          className="absolute top-4 bottom-4 w-1/2 bg-paper-texture border border-stone-250 rounded shadow-lg overflow-hidden flex flex-col backface-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Double sided fake pages inside sheet */}
          <div className="absolute inset-0 bg-paper-texture border-l border-stone-300 p-8">
            <div className="w-full h-full opacity-20 bg-stone-300 blur-sm rounded"></div>
          </div>
        </div>
      </div>

      {/* Ribbon contents back buttons */}
      {currentPageIndex > 0 && (
        <button
          onClick={() => handlePageTransition(0)}
          className="absolute -top-1 left-8 z-30 bg-stone-900 text-stone-100 hover:bg-stone-850 py-2.5 px-4 text-xs uppercase tracking-wider font-semibold rounded-b-md shadow-md border-t-0 border border-stone-850 transition-all hover:translate-y-0.5 active:translate-y-1"
          style={{ borderBottomColor: settings.accentColor }}
        >
          Contents
        </button>
      )}

      {/* Main Book Frame (Styled as a physical 3D open book mockup) */}
      <div
        ref={bookFrameRef}
        className="w-full h-full relative rounded-3xl shadow-[0_35px_80px_rgba(0,0,0,0.85)] p-[12px] bg-[#0b1120] border border-slate-900 flex flex-col lg:flex-row"
      >
        {/* Gold trim lines on physical cover rim */}
        <div className="absolute inset-[4px] border border-amber-500/25 rounded-[20px] pointer-events-none z-0" />
        <div className="absolute inset-[6px] border border-amber-500/10 rounded-[18px] pointer-events-none z-0" />

        {/* Stacked Page Sheets (3D Page Thickness simulation) */}
        {!isMobile && (
          <>
            <div className="absolute top-[20px] bottom-[20px] left-[6px] w-[8px] bg-stone-100/90 border-l border-t border-b border-stone-300/60 rounded-l shadow-[inset_-2px_0_4px_rgba(0,0,0,0.06)] z-0" />
            <div className="absolute top-[20px] bottom-[20px] right-[6px] w-[8px] bg-stone-100/90 border-r border-t border-b border-stone-300/60 rounded-r shadow-[inset_2px_0_4px_rgba(0,0,0,0.06)] z-0" />
          </>
        )}

        {/* The Paper Block (Inner book container) */}
        <div className="flex-1 w-full h-full flex flex-col lg:flex-row bg-paper-texture rounded-xl relative overflow-hidden z-10 border border-stone-300/50 shadow-inner">
          {/* Soft paper page curvature overlays */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/[0.04] to-transparent pointer-events-none z-25" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/[0.04] to-transparent pointer-events-none z-25" />

          {/* 3D Page corner curvature shadows */}
          <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-black/[0.04] to-transparent pointer-events-none z-25" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-black/[0.04] to-transparent pointer-events-none z-25" />

          {/* Center Spine Divider Shadow */}
          {!isMobile && (
            <div className="absolute inset-y-0 left-1/2 -ml-[15px] w-[30px] bg-gradient-to-r from-black/[0.22] via-black/[0.03] to-black/[0.22] border-l border-r border-black/[0.05] pointer-events-none z-20" />
          )}

          {/* Dynamic shadow sweeps */}
          <div
            ref={leftPageShadowRef}
            className="absolute inset-y-0 left-0 w-1/2 bg-black pointer-events-none z-30 transition-opacity duration-300"
            style={{ opacity: 0 }}
          />
          <div
            ref={rightPageShadowRef}
            className="absolute inset-y-0 right-0 w-1/2 bg-black pointer-events-none z-30 transition-opacity duration-300"
            style={{ opacity: 0 }}
          />

          {/* Layout rendering */}
          {isMobile ? (
            // Mobile: single page layout
            <div className="w-full h-full overflow-y-auto scrollbar-paper bg-paper-texture">
              {currentPageIndex === 0 ? (
                <div className="flex flex-col min-h-full">
                  <div className="flex-1 border-b border-stone-200 bg-paper-texture">{renderLeftPage()}</div>
                  <div className="flex-1 bg-paper-texture">{renderRightPage()}</div>
                </div>
              ) : currentPageIndex === 1 ? (
                <div className="flex flex-col min-h-full">
                  <div className="flex-1 border-b border-stone-200 bg-paper-texture">{renderLeftPage()}</div>
                  <div className="flex-1 bg-paper-texture">{renderRightPage()}</div>
                </div>
              ) : (
                <div className="h-full flex flex-col bg-paper-texture">
                  {renderChapterSpread()}
                </div>
              )}
            </div>
          ) : (
            // Desktop: spread double pages with realistic 3D spine curve shadows
            currentPageIndex >= 2 ? (
              <div key={`chapter-${currentPageIndex}`} className="w-full h-full bg-paper-texture relative z-10 overflow-hidden">
                {renderChapterSpread()}
              </div>
            ) : (
              <>
                <div key={`left-${currentPageIndex}`} className="w-1/2 h-full border-r border-stone-250 bg-paper-texture shadow-[inset_-24px_0_30px_rgba(0,0,0,0.015)] relative z-10 overflow-hidden">
                  {renderLeftPage()}
                </div>
                <div key={`right-${currentPageIndex}`} className="w-1/2 h-full bg-paper-texture shadow-[inset_24px_0_30px_rgba(0,0,0,0.015)] relative z-10 overflow-hidden">
                  {renderRightPage()}
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-between items-center px-4 pointer-events-none">
        <button
          onClick={() => handlePageTransition(currentPageIndex - 1)}
          disabled={currentPageIndex === 0 || isFlipping}
          className="pointer-events-auto flex items-center gap-1 bg-stone-900 hover:bg-stone-850 text-stone-100 disabled:opacity-30 disabled:hover:bg-stone-900 px-4 py-2.5 rounded-full shadow-lg border border-stone-800 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Prev
        </button>
        
        {currentPageIndex > 0 && (
          <span className="text-xs text-stone-400 font-serif select-none bg-stone-950/40 px-3 py-1.5 rounded-full backdrop-blur">
            {currentPageIndex === 1 
              ? "Table of Contents" 
              : `Chapter ${currentPageIndex - 1} of ${totalPages}`}
          </span>
        )}

        <button
          onClick={() => handlePageTransition(currentPageIndex + 1)}
          disabled={currentPageIndex >= totalPages + 1 || isFlipping}
          className="pointer-events-auto flex items-center gap-1 bg-stone-900 hover:bg-stone-850 text-stone-100 disabled:opacity-30 disabled:hover:bg-stone-900 px-4 py-2.5 rounded-full shadow-lg border border-stone-800 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
