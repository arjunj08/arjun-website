"use client";

import React, { useState, useEffect } from "react";
import { BookPage, BookSettings } from "@/lib/types";
import dynamic from "next/dynamic";

const PageEditor = dynamic(() => import("@/components/book/PageEditor"), {
  ssr: false,
});
const PageReader = dynamic(() => import("@/components/book/PageReader"), {
  ssr: false,
});

import {
  BookOpen,
  Eye,
  FileText,
  Calendar,
  Settings,
  Plus,
  Trash2,
  GripVertical,
  LogOut,
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle,
  AlertCircle,
  EyeOff,
  Globe,
  Loader2,
  Edit,
  Copy,
  Crown,
  Sparkles,
  BarChart2,
  User,
  Check,
  Clock,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CornerOrnament = ({ className }: { className?: string }) => (
  <svg className={`absolute w-6 h-6 text-stone-400/25 pointer-events-none z-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
    <path d="M 2,22 L 2,2 C 2,2 8,2 10,4 C 12,6 8,10 4,10 C 2,10 2,10 2,12" />
    <path d="M 22,2 L 2,2 C 2,2 2,8 4,10 C 6,12 10,8 10,4" />
    <circle cx="2" cy="2" r="0.8" fill="currentColor" />
  </svg>
);

interface DashboardProps {
  initialSettings: BookSettings;
  initialPages: BookPage[];
}

export default function Dashboard({ initialSettings, initialPages }: DashboardProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<BookSettings>(initialSettings || {
    title: "The Living Book",
    author: "A Passionate Educator",
    description: "An interactive cinematic learning experience.",
    coverTitle: "The Living Book",
    accentColor: "#6366f1",
  });
  const [pages, setPages] = useState<BookPage[]>(initialPages || []);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "chapters" | "media" | "typography" | "theme" | "analytics" | "drafts" | "trash" | "profile"
  >("dashboard");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingPage, setEditingPage] = useState<BookPage | null>(null);
  const [dashboardSaveStatus, setDashboardSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewPage, setPreviewPage] = useState<BookPage | null>(null);
  const [trashPages, setTrashPages] = useState<BookPage[]>([]);
  const [activities, setActivities] = useState([
    { id: 1, action: "Theme color updated to White Gold", time: "10 mins ago", type: "theme" },
    { id: 2, action: "Chapter 3: The Dark Ocean published", time: "2 hours ago", type: "publish" },
    { id: 3, action: "Metadata settings updated", time: "5 hours ago", type: "settings" },
    { id: 4, action: "Seeded local database configurations", time: "1 day ago", type: "system" },
  ]);

  // Re-fetch data helper
  const refreshData = async () => {
    try {
      const resPages = await fetch("/api/pages");
      if (resPages.ok) {
        const data = await resPages.json();
        setPages(data);
      }
      const resSettings = await fetch("/api/settings");
      if (resSettings.ok) {
        const data = await resSettings.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Refresh dashboard error:", err);
    }
  };

  // Helper to count words from TipTap JSON
  const countWords = (contentStr: string): number => {
    try {
      const data = JSON.parse(contentStr);
      let text = "";
      const extractText = (node: any) => {
        if (node.type === "text") {
          text += " " + node.text;
        }
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(extractText);
        }
      };
      extractText(data);
      return text.trim().split(/\s+/).filter(Boolean).length;
    } catch (e) {
      return 0;
    }
  };

  const totalWords = pages.reduce((sum, page) => sum + (page && page.content ? countWords(page.content) : 0), 0);
  const totalViews = pages.reduce((sum, page) => sum + ((page && page.views) || 0), 0);
  const lastEditedPage = pages.length > 0
    ? [...pages]
        .filter(p => p && p.updatedAt)
        .sort((a, b) => {
          const tA = new Date(a.updatedAt).getTime();
          const tB = new Date(b.updatedAt).getTime();
          return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
        })[0] || null
    : null;

  // 1. Chapter Actions
  const handleCreateChapter = async () => {
    try {
      const res = await fetch("/api/pages", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "writing" })
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSection = async (id: string, newSection: "lifestyle" | "cars" | "writing") => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: newSection }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicateChapter = async (page: BookPage) => {
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${page.title} (Copy)`,
          content: page.content,
          section: page.section,
          published: false,
          featured: false,
        }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Duplicate chapter error:", err);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Toggle featured error:", err);
    }
  };

  const handleDeleteChapter = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const deletedPage = pages.find((p) => p.id === id);
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (deletedPage) {
          setTrashPages((prev) => [...prev, deletedPage]);
        }
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameChapter = async (id: string, oldTitle: string) => {
    const newTitle = prompt("Enter new title for chapter:", oldTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === oldTitle) return;
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Chapter Reordering (Up/Down for compatibility & absolute reliability, plus simple drag triggers)
  const moveChapter = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const reordered = [...pages];
    const temp = reordered[currentIndex];
    reordered[currentIndex] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Map new order properties
    const payload = reordered.map((page, idx) => ({
      id: page.id!,
      order: idx + 1,
    }));

    // Update local state instantly (Optimistic UI)
    setPages(reordered.map((p, idx) => ({ ...p, order: idx + 1 })));

    try {
      const res = await fetch("/api/pages/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorderedPages: payload }),
      });
      if (!res.ok) {
        await refreshData(); // rollback
      }
    } catch (err) {
      console.error(err);
      await refreshData();
    }
  };

  // HTML5 Drag and Drop handlers
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIdx: number) => {
    if (draggedIndex === null || draggedIndex === targetIdx) return;

    const reordered = [...pages];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIdx, 0, draggedItem);

    // Map orders
    const payload = reordered.map((page, idx) => ({
      id: page.id!,
      order: idx + 1,
    }));

    setPages(reordered.map((p, idx) => ({ ...p, order: idx + 1 })));
    setDraggedIndex(null);

    try {
      const res = await fetch("/api/pages/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorderedPages: payload }),
      });
      if (!res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
      await refreshData();
    }
  };

  // 3. Settings updates
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsMsg(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSettingsMsg({ type: "success", text: "Settings saved successfully!" });
        await refreshData();
      } else {
        setSettingsMsg({ type: "error", text: "Failed to save settings." });
      }
    } catch (err) {
      setSettingsMsg({ type: "error", text: "Network error saving settings." });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // 4. Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#06040d] text-[#eae9fc] font-sans flex overflow-hidden">
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-[#0a0818]/95 border-r border-[#1e1b40] flex flex-col flex-shrink-0 z-30 relative select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1e1b40] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-650 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold tracking-wide text-white uppercase">The Living Book</h1>
            <p className="text-[9px] text-sky-400 font-semibold tracking-wider uppercase">CMS Dashboard</p>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-widest block mb-1">Overview</span>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <Globe className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-widest block mb-1">Book Management</span>
            <button
              onClick={() => setActiveTab("chapters")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "chapters"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              Chapter Manager
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "media"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Media Library
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "typography"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <Edit className="w-4 h-4" />
              Typography Specs
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "theme"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Book Settings
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-widest block mb-1">Archives</span>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "drafts"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <Info className="w-4 h-4" />
              Drafts Archive
            </button>
            <button
              onClick={() => setActiveTab("trash")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "trash"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Trash Bin
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-widest block mb-1">Identity</span>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500/35"
                  : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
              }`}
            >
              <User className="w-4 h-4" />
              Teacher Profile
            </button>
          </div>
        </div>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-[#1e1b40] space-y-2 bg-[#05040f]">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-serif text-sm font-bold shadow">
              T
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">Admin Instructor</p>
              <p className="text-[9px] text-stone-500 truncate">admin@livingbook.edu</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 py-2 rounded-lg border border-rose-500/20 transition-all font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scrollbar-thin bg-[#06040d]">
        {/* Header Bar */}
        <header className="bg-[#0a0818]/80 backdrop-blur-md border-b border-[#1e1b40] px-8 py-5 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
              {activeTab === "dashboard" && "Overview Dashboard"}
              {activeTab === "chapters" && "Chapters & Manuscripts"}
              {activeTab === "media" && "Media Asset Library"}
              {activeTab === "typography" && "Book Typography Configurations"}
              {activeTab === "theme" && "Theme & Aesthetics Settings"}
              {activeTab === "analytics" && "Reader Engagement Analytics"}
              {activeTab === "drafts" && "Chapters Drafts"}
              {activeTab === "trash" && "Deleted Items"}
              {activeTab === "profile" && "Instructor Profile Credentials"}
            </h2>
            <p className="text-[10px] text-stone-400 font-serif">
              {activeTab === "dashboard" && "Central command for monitoring book details, page counts, and activity logs."}
              {activeTab === "chapters" && "Create, reorder, rename, delete, duplicate or edit the magical pages."}
              {activeTab === "media" && "Organize background nebulae textures, page paper images, and drawings."}
              {activeTab === "typography" && "Customize font sizes, line heights, word paddings, and default styles."}
              {activeTab === "theme" && "Set active color scheme highlights, spine ornaments, and galaxy particles."}
              {activeTab === "analytics" && "Analyze total lecture interactions, chapter page views, and reading sessions."}
              {activeTab === "drafts" && "Restore, clone, or publish chapter drafts currently under writing."}
              {activeTab === "trash" && "Recover or permanently delete removed chapter manuscripts."}
              {activeTab === "profile" && "Manage administrative email credentials, auth domains, and access keys."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-xs text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 px-4 py-2 rounded-full font-serif transition-all pointer-events-auto shadow-[0_0_15px_rgba(56,189,248,0.1)]"
            >
              <Eye className="w-3.5 h-3.5" />
              Launch Book Reader
            </button>
          </div>
        </header>

        {/* View Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* TAB 1: Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f0e22] border border-[#1b1931] p-5 rounded-xl flex items-center gap-4 shadow-xl">
                  <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-semibold">Total Chapters</p>
                    <h3 className="text-2xl font-bold mt-1 font-serif text-white">{pages.length}</h3>
                  </div>
                </div>

                <div className="bg-[#0f0e22] border border-[#1b1931] p-5 rounded-xl flex items-center gap-4 shadow-xl">
                  <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-semibold">Published Chapters</p>
                    <h3 className="text-2xl font-bold mt-1 font-serif text-white">
                      {pages.filter((p) => p.published).length}
                    </h3>
                  </div>
                </div>

                <div className="bg-[#0f0e22] border border-[#1b1931] p-5 rounded-xl flex items-center gap-4 shadow-xl">
                  <div className="p-3 bg-stone-500/10 rounded-lg border border-[#1b1931] text-stone-400">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-semibold">Draft Chapters</p>
                    <h3 className="text-2xl font-bold mt-1 font-serif text-white">
                      {pages.filter((p) => !p.published).length}
                    </h3>
                  </div>
                </div>

                <div className="bg-[#0f0e22] border border-[#1b1931] p-5 rounded-xl flex items-center gap-4 shadow-xl">
                  <div className="p-3 bg-sky-500/10 rounded-lg border border-sky-500/20 text-sky-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-semibold">Reading Time</p>
                    <h3 className="text-2xl font-bold mt-1 font-serif text-white">
                      {Math.ceil(totalWords / 200)} mins
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick actions box */}
                <div className="lg:col-span-1 bg-[#0f0e22] border border-[#1b1931] p-6 rounded-xl space-y-4 shadow-xl">
                  <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-[#1b1931] pb-2">
                    Quick Actions
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("chapters");
                        handleCreateChapter();
                      }}
                      className="w-full flex items-center justify-between text-xs bg-indigo-650 hover:bg-indigo-550 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                    >
                      <span>Create New Chapter</span>
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("theme")}
                      className="w-full flex items-center justify-between text-xs bg-stone-900 hover:bg-stone-850 text-stone-300 px-4 py-3 rounded-lg border border-[#1b1931] transition-all"
                    >
                      <span>Edit Book Settings</span>
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="w-full flex items-center justify-between text-xs bg-sky-900/20 hover:bg-sky-900/30 text-sky-400 px-4 py-3 rounded-lg border border-sky-900/30 transition-all"
                    >
                      <span>Live Reader Presentation</span>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recent activity logs */}
                <div className="lg:col-span-2 bg-[#0f0e22] border border-[#1b1931] p-6 rounded-xl space-y-4 shadow-xl">
                  <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-[#1b1931] pb-2">
                    Recent Activity Logs
                  </h3>
                  <div className="divide-y divide-[#1b1931] text-xs">
                    {activities.map((act) => (
                      <div key={act.id} className="py-3 flex justify-between items-center text-stone-300">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              act.type === "publish"
                                ? "bg-emerald-450"
                                : act.type === "theme"
                                ? "bg-sky-400"
                                : "bg-indigo-400"
                            }`}
                          />
                          <span>{act.action}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-serif">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Chapter Manager Grid */}
          {activeTab === "chapters" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-serif font-semibold text-white">Chapters manuscripts</h3>
                  <p className="text-[11px] text-stone-400">Drag chapter handles to reorder, toggle featured states, duplicate, or delete.</p>
                </div>
                <button
                  onClick={handleCreateChapter}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-indigo-500/35 transition-all shadow-lg shadow-indigo-650/15"
                >
                  <Plus className="w-4 h-4" />
                  New Chapter
                </button>
              </div>

              {pages.length === 0 ? (
                <div className="border border-dashed border-[#1b1931] rounded-lg p-16 text-center text-stone-500 font-serif italic">
                  No chapters loaded. Click "New Chapter" to begin writing your manuscript tome.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pages.map((page, idx) => {
                    const wordsCount = countWords(page.content);
                    const readTime = Math.ceil(wordsCount / 200);

                    return (
                      <div
                        key={page.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        className={`bg-[#0f0e22] border border-[#1c1933] hover:border-[#3b356d] rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all duration-200 relative group overflow-hidden ${
                          draggedIndex === idx ? "opacity-30" : ""
                        }`}
                      >
                        {/* Custom background glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Top Card Info Row */}
                        <div className="relative z-10 space-y-3">
                          <div className="flex justify-between items-start">
                            {/* Drag handle */}
                            <div className="cursor-grab active:cursor-grabbing p-1.5 text-stone-550 hover:text-stone-300 bg-[#090714] border border-[#1b1931] rounded">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>

                            <span
                              className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-serif shadow-sm border"
                              style={{
                                borderColor: `${settings.accentColor}35`,
                                backgroundColor: `${settings.accentColor}10`,
                                color: settings.accentColor,
                              }}
                            >
                              CH {page.chapterNumber}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif text-md font-bold text-white truncate group-hover:text-indigo-350 transition-colors">
                              {page.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <select
                                value={page.section || "writing"}
                                onChange={(e) => handleUpdateSection(page.id!, e.target.value as any)}
                                className="bg-[#09081a] border border-[#1d1b38] text-[9px] font-serif text-stone-300 rounded px-1.5 py-0.5 focus:outline-none"
                              >
                                <option value="lifestyle">🪐 Lifestyle</option>
                                <option value="cars">🚗 Cars</option>
                                <option value="writing">✍️ Writing</option>
                              </select>

                              {page.published ? (
                                <span className="bg-emerald-500/10 text-emerald-450 text-[8px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  Published
                                </span>
                              ) : (
                                <span className="bg-stone-500/10 text-stone-450 text-[8px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded border border-[#1e1b40]">
                                  Draft
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stats metadata */}
                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1a1835] text-[10px] text-stone-400 font-serif">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-0.5">Word Count</p>
                              <p className="text-white font-bold">{wordsCount} words</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-0.5">Reading Time</p>
                              <p className="text-white font-bold">{readTime} min read</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-0.5">Views Logged</p>
                              <p className="text-white font-bold">{page.views || 0} visits</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-0.5">Last Updated</p>
                              <p className="text-white font-bold truncate">
                                {page.updatedAt && !isNaN(new Date(page.updatedAt).getTime())
                                  ? new Date(page.updatedAt).toLocaleDateString()
                                  : new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="relative z-10 mt-6 pt-3 border-t border-[#1a1835] flex items-center justify-between gap-2">
                          {/* Featured toggle switch */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleFeatured(page.id!, page.featured || false)}
                              className={`p-1.5 rounded transition-all border ${
                                page.featured
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                  : "bg-[#09081a] border-[#1d1b38] text-stone-500 hover:text-stone-300"
                              }`}
                              title="Toggle Featured"
                            >
                              <Crown className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[9px] font-serif text-stone-500">Featured</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingPage(page)}
                              className="text-[10px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 px-2.5 py-1 rounded transition-all"
                              title="Edit content"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setPreviewPage(page)}
                              className="text-[10px] font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/25 px-2.5 py-1 rounded transition-all"
                              title="Preview render"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDuplicateChapter(page)}
                              className="text-[10px] font-semibold bg-[#1a1835] hover:bg-white/5 text-stone-300 border border-[#1b1931] px-2 py-1 rounded transition-all"
                              title="Duplicate chapter"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleTogglePublish(page.id!, page.published)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded border transition-all ${
                                page.published
                                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-450 hover:bg-emerald-500/20"
                                  : "bg-[#1a1835] border-[#1b1931] text-stone-400 hover:bg-white/5"
                              }`}
                            >
                              {page.published ? "Unpub" : "Pub"}
                            </button>
                            <button
                              onClick={() => handleDeleteChapter(page.id!, page.title)}
                              className="text-[10px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 px-2 py-1 rounded transition-all"
                            >
                              Del
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Media Library */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0f0e22] border border-[#1b1931] p-8 rounded-xl shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-serif font-semibold text-white">Media Asset Library</h3>
                    <p className="text-[11px] text-stone-400">Manage photos, vectors, maps, and drawings embedded in chapters.</p>
                  </div>
                  <button className="bg-indigo-650 hover:bg-indigo-550 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-indigo-500/35 transition-all">
                    Upload Asset File
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  {[
                    { name: "Parchment Texture.jpg", size: "1.4 MB", type: "Image File" },
                    { name: "Astrophysics Nebula.png", size: "3.2 MB", type: "Image File" },
                    { name: "Supercar Blueprint.svg", size: "120 KB", type: "Vector File" },
                    { name: "Ancient Manuscript Border.png", size: "450 KB", type: "Image File" },
                  ].map((asset, idx) => (
                    <div key={idx} className="bg-[#09081a] border border-[#1c1933] rounded-lg p-4 space-y-3 relative group">
                      <div className="w-full h-32 rounded bg-stone-900 border border-[#1b1931] flex items-center justify-center text-stone-600 group-hover:text-sky-400 transition-colors">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-white truncate">{asset.name}</h4>
                        <p className="text-[9px] text-stone-500 mt-0.5">{asset.type} · {asset.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Typography Specifications */}
          {activeTab === "typography" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0f0e22] border border-[#1b1931] p-8 rounded-xl shadow-xl space-y-4">
                <h3 className="text-md font-serif font-semibold text-white">Typography Specifications</h3>
                <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
                  Configure default font rules that flow across columns inside the magical book pages.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4 border-r border-[#1b1931] pr-8">
                    <h4 className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-serif">Styles Presets</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-2 border-b border-[#1b1931]">
                        <span className="text-stone-300">Base Font Family</span>
                        <span className="font-serif font-bold text-white">Cormorant Garamond</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#1b1931]">
                        <span className="text-stone-300">Header H1 Font Family</span>
                        <span className="font-serif font-bold text-white">Cinzel (Classic)</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#1b1931]">
                        <span className="text-stone-300">Default Paragraph Size</span>
                        <span className="text-white font-bold">16px</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#1b1931]">
                        <span className="text-stone-300">Line Height</span>
                        <span className="text-white font-bold">1.65 (Expanded)</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#1b1931]">
                        <span className="text-stone-300">Drop Caps Size</span>
                        <span className="text-white font-bold">3.5rem (Embossed)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-serif">Parchment Formatting</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      All rendering options (Burnt Corners, Paper Fibers, Stains, Ink Bleed, and Watermark Backgrounds) can be activated inside the Theme Tab settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Theme & Aesthetics (Settings Form) */}
          {activeTab === "theme" && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl bg-[#0f0e22] border border-[#1b1931] p-8 rounded-xl shadow-xl">
                <div>
                  <h3 className="text-md font-serif font-semibold text-white">Theme & Aesthetics</h3>
                  <p className="text-[11px] text-stone-400">Configure cover details, title, bio card, and accent colors.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1">
                      Main Book Title
                    </label>
                    <input
                      type="text"
                      value={settings.title}
                      onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                      required
                      className="w-full bg-[#0a0818] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-2.5 text-sm text-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1">
                      Author / Professor Name
                    </label>
                    <input
                      type="text"
                      value={settings.author}
                      onChange={(e) => setSettings({ ...settings, author: e.target.value })}
                      required
                      className="w-full bg-[#0a0818] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-2.5 text-sm text-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1">
                      3D Book Cover Title
                    </label>
                    <input
                      type="text"
                      value={settings.coverTitle}
                      onChange={(e) => setSettings({ ...settings, coverTitle: e.target.value })}
                      required
                      className="w-full bg-[#0a0818] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-2.5 text-sm text-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1">
                      Accent Color (Hex Code)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                        required
                        className="w-full bg-[#0a0818] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-2.5 text-sm text-white font-serif"
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-[#1b1931]"
                        style={{ backgroundColor: settings.accentColor }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1">
                    Short Description / Professor Bio
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-[#0a0818] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg p-4 text-sm text-white resize-none"
                  />
                </div>

                {settingsMsg && (
                  <div
                    className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${
                      settingsMsg.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-450"
                    }`}
                  >
                    {settingsMsg.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{settingsMsg.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg border border-indigo-500/35 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isSavingSettings ? "Saving Settings..." : "Save Settings"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0f0e22] border border-[#1b1931] p-6 rounded-xl shadow-xl space-y-4">
                <div>
                  <h3 className="text-md font-serif font-semibold text-white">Chapter View Analytics</h3>
                  <p className="text-[11px] text-stone-400">Detailed logs showing direct student interaction per chapter.</p>
                </div>

                {pages.length === 0 ? (
                  <div className="border border-dashed border-[#1b1931] rounded-lg p-12 text-center text-stone-555 font-serif italic">
                    No logs recorded.
                  </div>
                ) : (
                  <div className="bg-[#09081a] border border-[#1c1933] rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#0c0a1a] border-b border-[#1b1931] text-[#938eb5] text-[10px] font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Chapter</th>
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Views Logged</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b1931] text-stone-300">
                        {pages.map((page) => (
                          <tr key={page.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-serif font-bold text-indigo-400">CH {page.chapterNumber}</td>
                            <td className="px-6 py-4 font-serif font-semibold text-white">{page.title}</td>
                            <td className="px-6 py-4">
                              {page.published ? (
                                <span className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider">
                                  Published
                                </span>
                              ) : (
                                <span className="bg-stone-500/10 text-stone-400 border border-[#1b1931] px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider">
                                  Draft
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-serif font-bold text-white">{page.views || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: Drafts Archive */}
          {activeTab === "drafts" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-serif font-semibold text-white">Drafts Archive</h3>
                  <p className="text-[11px] text-stone-400">Chapters currently marked as drafts and hidden from the live reader.</p>
                </div>
              </div>

              {pages.filter((p) => !p.published).length === 0 ? (
                <div className="border border-dashed border-[#1b1931] rounded-lg p-16 text-center text-stone-550 font-serif italic bg-[#0f0e22]">
                  No drafts in the archive. All chapters are published!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pages
                    .filter((p) => !p.published)
                    .map((page) => (
                      <div key={page.id} className="bg-[#0f0e22] border border-[#1c1933] rounded-xl p-5 space-y-4 shadow-xl">
                        <h4 className="font-serif text-sm font-bold text-white">{page.title}</h4>
                        <div className="flex items-center justify-between text-[10px] text-stone-500 font-serif">
                          <span>Chapter {page.chapterNumber}</span>
                          <span>{countWords(page.content)} words</span>
                        </div>
                        <div className="pt-2 border-t border-[#1b1931] flex justify-end gap-2">
                          <button
                            onClick={() => setEditingPage(page)}
                            className="text-[9px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 px-2 py-1 rounded transition-all"
                          >
                            Edit Draft
                          </button>
                          <button
                            onClick={() => handleTogglePublish(page.id!, page.published)}
                            className="text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border border-emerald-500/25 px-2 py-1 rounded transition-all"
                          >
                            Publish Draft
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: Trash Bin */}
          {activeTab === "trash" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0f0e22] border border-[#1b1931] p-8 rounded-xl shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-serif font-semibold text-white">Trash Bin</h3>
                    <p className="text-[11px] text-stone-400">Chapters deleted from the database are stored here before permanent deletion.</p>
                  </div>
                  <button
                    onClick={() => setTrashPages([])}
                    disabled={trashPages.length === 0}
                    className="bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-20 text-rose-450 border border-rose-500/20 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    Empty Trash Bin
                  </button>
                </div>

                {trashPages.length === 0 ? (
                  <div className="border border-dashed border-[#1b1931] rounded-lg p-16 text-center text-stone-550 font-serif italic">
                    Trash bin is empty.
                  </div>
                ) : (
                  <div className="divide-y divide-[#1b1931] text-xs">
                    {trashPages.map((page) => (
                      <div key={page.id} className="py-4 flex justify-between items-center text-stone-300">
                        <div>
                          <h4 className="font-serif font-bold text-white">{page.title}</h4>
                          <span className="text-[9px] text-stone-500">Deleted just now</span>
                        </div>
                        <button
                          onClick={() => {
                            // Restore mock
                            setTrashPages(trashPages.filter((p) => p.id !== page.id));
                            setPages([...pages, { ...page, id: `page-${Date.now()}` }]);
                          }}
                          className="text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded transition-all"
                        >
                          Restore Chapter
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: Teacher Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0f0e22] border border-[#1b1931] p-8 rounded-xl shadow-xl space-y-6 max-w-xl">
                <div>
                  <h3 className="text-md font-serif font-semibold text-white">Teacher Profile Credentials</h3>
                  <p className="text-[11px] text-stone-400">Verify administrator authentication session profiles.</p>
                </div>

                <div className="space-y-4 text-xs font-serif">
                  <div className="p-4 bg-[#09081a] border border-[#1b1931] rounded-lg space-y-2">
                    <p className="text-stone-400"><span className="font-semibold text-white">Email Profile:</span> admin@livingbook.edu</p>
                    <p className="text-stone-400"><span className="font-semibold text-white">Credentials Scope:</span> Lead Instructor / Publisher</p>
                    <p className="text-stone-400"><span className="font-semibold text-white">Authorized Host:</span> localhost:3005</p>
                  </div>
                  <p className="text-[10px] text-stone-500 italic">
                    To modify authentication email or passwords, please update Firebase Authentication users directly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Fullscreen Editor Modal Overlay */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-5xl h-[90vh] bg-paper-texture rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-stone-900 border-b border-stone-850 text-white z-20">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-serif">Editing Chapter Content</span>
                <h3 className="font-serif text-lg font-bold">{editingPage.title}</h3>
              </div>
              <button
                onClick={() => {
                  setEditingPage(null);
                  refreshData();
                }}
                className="text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded text-xs transition-colors pointer-events-auto font-serif"
              >
                Done & Close
              </button>
            </div>

            {/* Editor Container */}
            <div className="flex-1 p-8 overflow-y-auto relative z-10">
              {/* Page margin frames and corners */}
              <div className="absolute inset-5 border border-stone-300/35 pointer-events-none rounded-lg z-0">
                <div className="absolute inset-[3px] border border-stone-250/15 rounded-md" />
              </div>
              <CornerOrnament className="top-6 left-6" />
              <CornerOrnament className="top-6 right-6 rotate-90" />
              <CornerOrnament className="bottom-6 left-6 -rotate-90" />
              <CornerOrnament className="bottom-6 right-6 rotate-180" />

              <div className="relative z-10 h-full">
                <PageEditor
                  pageId={editingPage.id!}
                  initialContent={editingPage.content}
                  onSaveStatusChange={(status) => setDashboardSaveStatus(status)}
                />
              </div>
            </div>

            {/* Save Status Banner */}
            {dashboardSaveStatus !== "idle" && (
              <div className="absolute bottom-4 right-8 flex items-center gap-1.5 text-xs bg-stone-900/95 text-stone-200 py-1.5 px-3.5 rounded shadow border border-stone-850 z-20">
                {dashboardSaveStatus === "saving" && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                    <span>Saving manuscript...</span>
                  </>
                )}
                {dashboardSaveStatus === "saved" && (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Manuscript saved ✓</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Page Preview Modal */}
      {previewPage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl h-[85vh] bg-[#faf7ee] bg-paper-texture rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-stone-900 border-b border-stone-850 text-white z-20">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-serif">Tome Preview Mode</span>
                <h3 className="font-serif text-lg font-bold">{previewPage.title}</h3>
              </div>
              <button
                onClick={() => setPreviewPage(null)}
                className="text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded text-xs transition-colors pointer-events-auto font-serif"
              >
                Close Preview
              </button>
            </div>

            {/* Inside Content */}
            <div className="flex-1 p-12 overflow-y-auto relative z-10">
              {/* Corner Ornaments */}
              <div className="absolute inset-6 border border-stone-300/35 pointer-events-none rounded-lg z-0" />
              <CornerOrnament className="top-8 left-8" />
              <CornerOrnament className="top-8 right-8 rotate-90" />
              <CornerOrnament className="bottom-8 left-8 -rotate-90" />
              <CornerOrnament className="bottom-8 right-8 rotate-180" />

              <div className="relative z-10 max-w-xl mx-auto h-full">
                <PageReader content={previewPage.content} accentColor={settings.accentColor} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
