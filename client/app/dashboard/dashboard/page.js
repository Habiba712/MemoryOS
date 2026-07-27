"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/sideBar";
import {
  Search,
  Bell,
  Files,
  Cloud,
  Layers,
  Heart,
  FileText,
  Play,
  Image as ImageIcon,
  Code2,
  Palette,
  Receipt,
  FlaskConical,
  Plane,
  UtensilsCrossed,
} from "lucide-react";

// swap this for a real session/user fetch once auth is wired up
const CURRENT_USER = { name: "Habiba", initial: "H" };

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to load dashboard");
        const data = await res.json();
        setStats(data.stats);
        setRecentFiles(data.recentFiles);
        setCollections(data.collections);
      } catch (err) {
        console.error(err);
        // fallback so the page still looks right during development
        setStats(FALLBACK_STATS);
        setRecentFiles(FALLBACK_FILES);
        setCollections(FALLBACK_COLLECTIONS);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/dashboard/search?q=${encodeURIComponent(query)}`;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <main className="flex-1 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Good morning, {CURRENT_USER.name} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what&apos;s happening with your memory.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-medium">
              {CURRENT_USER.initial}
            </div>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything you've ever saved..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-16 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
        </form>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Files className="w-4 h-4" />}
            label="Total Files"
            value={loading ? "—" : stats.totalFiles}
            sub={loading ? "" : `+${stats.newThisWeek} this week`}
          />
          <StatCard
            icon={<Cloud className="w-4 h-4" />}
            label="Storage Used"
            value={loading ? "—" : `${stats.storageUsedGb} GB`}
            sub={loading ? "" : `of ${stats.storageLimitGb} GB`}
          />
          <StatCard
            icon={<Layers className="w-4 h-4" />}
            label="Collections"
            value={loading ? "—" : stats.collectionsCount}
            sub="AI generated"
          />
          <StatCard
            icon={<Heart className="w-4 h-4" />}
            label="Favorites"
            value={loading ? "—" : stats.favoritesCount}
            sub="Your saved items"
          />
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recent Uploads</h2>
            <Link href="/dashboard/collections" className="text-xs text-violet-600 hover:text-violet-500">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-36 rounded-xl bg-gray-100 animate-pulse" />
                ))
              : recentFiles.map((file) => <FileCard key={file.id} file={file} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Smart Collections</h2>
            <Link href="/dashboard/collections" className="text-xs text-violet-600 hover:text-violet-500">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                ))
              : collections.map((c) => <CollectionCard key={c.name} collection={c} />)}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

function FileCard({ file }) {
  const badge = fileTypeBadge(file.fileType);

  return (
    <Link
      href={`/dashboard/files/${file.id}`}
      className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="relative h-24 bg-gray-100">
        {file.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FileText className="w-8 h-8" />
          </div>
        )}

        <span className={`absolute top-1.5 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${badge.className}`}>
          {badge.label}
        </span>

        {file.fileType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{file.uploadedAgo}</p>
      </div>
    </Link>
  );
}

function CollectionCard({ collection }) {
  return (
    <Link
      href={`/dashboard/collections/${collection.slug}`}
      className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 hover:shadow-md transition-shadow"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${collection.iconBg}`}>
        {collection.icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-900 truncate">{collection.name}</p>
        <p className="text-[11px] text-gray-400">{collection.fileCount} files</p>
      </div>
    </Link>
  );
}

function fileTypeBadge(type) {
  switch (type) {
    case "pdf":
      return { label: "PDF", className: "bg-red-100 text-red-600" };
    case "video":
      return { label: "MP4", className: "bg-violet-100 text-violet-600" };
    case "image":
      return { label: "PNG", className: "bg-blue-100 text-blue-600" };
    default:
      return { label: "DOC", className: "bg-gray-100 text-gray-600" };
  }
}

// --- fallback demo data, used only if /api/dashboard isn't hooked up yet ---

const FALLBACK_STATS = {
  totalFiles: 458,
  newThisWeek: 23,
  storageUsedGb: 3.2,
  storageLimitGb: 20,
  collectionsCount: 12,
  favoritesCount: 34,
};

const FALLBACK_FILES = [
  { id: "1", name: "Dashboard UI.png", fileType: "image", uploadedAgo: "2 minutes ago", thumbnailUrl: null },
  { id: "2", name: "French CV.pdf", fileType: "pdf", uploadedAgo: "1 hour ago", thumbnailUrl: null },
  { id: "3", name: "Coffee Recipe.png", fileType: "image", uploadedAgo: "3 hours ago", thumbnailUrl: null },
  { id: "4", name: "React Tutorial.mp4", fileType: "video", uploadedAgo: "5 hours ago", thumbnailUrl: null },
  { id: "5", name: "JWT Notes.pdf", fileType: "pdf", uploadedAgo: "12 hours ago", thumbnailUrl: null },
];

const FALLBACK_COLLECTIONS = [
  { name: "Programming", slug: "programming", fileCount: 126, icon: <Code2 className="w-4 h-4 text-blue-600" />, iconBg: "bg-blue-50" },
  { name: "Design", slug: "design", fileCount: 86, icon: <Palette className="w-4 h-4 text-pink-600" />, iconBg: "bg-pink-50" },
  { name: "Invoices", slug: "invoices", fileCount: 24, icon: <Receipt className="w-4 h-4 text-amber-600" />, iconBg: "bg-amber-50" },
  { name: "Research", slug: "research", fileCount: 67, icon: <FlaskConical className="w-4 h-4 text-emerald-600" />, iconBg: "bg-emerald-50" },
  { name: "Travel", slug: "travel", fileCount: 32, icon: <Plane className="w-4 h-4 text-sky-600" />, iconBg: "bg-sky-50" },
  { name: "Recipes", slug: "recipes", fileCount: 18, icon: <UtensilsCrossed className="w-4 h-4 text-orange-600" />, iconBg: "bg-orange-50" },
];