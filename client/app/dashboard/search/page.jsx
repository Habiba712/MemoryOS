"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, FileText, Play, ChevronDown } from "lucide-react";
import Link from "next/link";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "pdf", label: "PDFs" },
  { key: "video", label: "Videos" },
  { key: "document", label: "Docs" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounce so we're not hitting the search endpoint on every keystroke
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      runSearch(query, activeFilter);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, activeFilter]);

  async function runSearch(q, filter) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/file/search?q=${encodeURIComponent(q)}&type=${filter}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      console.log(data)
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults(FALLBACK_RESULTS.filter((r) => filter === "all" || r.fileType === filter));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">

      <main className="flex-1 px-8 py-6 max-w-3xl">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Search</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything you've ever saved..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  activeFilter === f.key
                    ? "bg-violet-100 text-violet-700"
                    : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            Most relevant
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-sm text-gray-400 mt-10 text-center">No results for &quot;{query}&quot;.</p>
        )}

        {!loading && (
          <div className="space-y-3">
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ResultCard({ result }) {
  console.log('result', result._id)
  return (
    <Link
      href={`/dashboard/files/${result._id}`}
      className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
    >
      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {(result.url || result.thumbnailUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={result.thumbnailUrl || result.url} alt={result.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FileText className="w-6 h-6" />
          </div>
        )}
        {result.fileType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
          <span className="shrink-0 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {result.matchScore}%
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {result.fileType} · Uploaded {result.updatedAt}
        </p>
        <p className="text-xs text-gray-400 mt-1.5 truncate">
          Matched because: 
        </p>
      </div>
    </Link>
  );
}

// --- fallback demo data, used only if /api/search isn't hooked up yet ---
const FALLBACK_RESULTS = [
  {
    id: "1",
    name: "React Dashboard UI Template",
    fileType: "image",
    extension: "PNG",
    uploadedAgo: "2 months ago",
    matchScore: 95,
    matchedTerms: ["dashboard", "purple", "react", "analytics", "cards"],
    thumbnailUrl: null,
  },
  {
    id: "2",
    name: "Building a Dashboard with React",
    fileType: "pdf",
    extension: "PDF",
    uploadedAgo: "4 months ago",
    matchScore: 92,
    matchedTerms: ["dashboard", "react", "tutorial", "components"],
    thumbnailUrl: null,
  },
  {
    id: "3",
    name: "React Dashboard Tutorial - Full Course",
    fileType: "video",
    extension: "MP4",
    uploadedAgo: "6 months ago",
    matchScore: 89,
    matchedTerms: ["react", "dashboard", "tutorial", "admin"],
    thumbnailUrl: null,
  },
  {
    id: "4",
    name: "Admin Panel Inspiration",
    fileType: "image",
    extension: "PNG",
    uploadedAgo: "7 months ago",
    matchScore: 87,
    matchedTerms: ["admin", "dashboard", "purple", "sidebar", "charts"],
    thumbnailUrl: null,
  },
];