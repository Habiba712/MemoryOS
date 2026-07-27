"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Palette,
  Receipt,
  FlaskConical,
  Plane,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Sparkles,
} from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const res = await fetch("/api/collections");
        if (!res.ok) throw new Error("Failed to load collections");
        const data = await res.json();
        setCollections(data.collections);
      } catch (err) {
        console.error(err);
        setCollections(FALLBACK_COLLECTIONS);
      } finally {
        setLoading(false);
      }
    }

    loadCollections();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
 
      <main className="flex-1 px-8 py-6 w-full">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold text-gray-900">Collections</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          AI automatically groups your files by what they&apos;re about.
        </p>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {collections.map((c) => (
              <CollectionCard key={c.slug} collection={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CollectionCard({ collection }) {
  return (
    <Link
      href={`/dashboard/collections/${collection.slug}`}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${collection.iconBg}`}>
          {collection.icon}
        </div>
        <span className="text-xs text-gray-400">{collection.fileCount} files</span>
      </div>
      <p className="text-sm font-medium text-gray-900">{collection.name}</p>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{collection.description}</p>
    </Link>
  );
}

// --- fallback demo data, used only if /api/collections isn't hooked up yet ---
const FALLBACK_COLLECTIONS = [
  {
    name: "Programming",
    slug: "programming",
    fileCount: 126,
    description: "Code snippets, docs, and dev tutorials",
    icon: <Code2 className="w-5 h-5 text-blue-600" />,
    iconBg: "bg-blue-50",
  },
  {
    name: "Design",
    slug: "design",
    fileCount: 86,
    description: "UI inspiration, mockups, and assets",
    icon: <Palette className="w-5 h-5 text-pink-600" />,
    iconBg: "bg-pink-50",
  },
  {
    name: "Invoices",
    slug: "invoices",
    fileCount: 24,
    description: "Receipts and billing documents",
    icon: <Receipt className="w-5 h-5 text-amber-600" />,
    iconBg: "bg-amber-50",
  },
  {
    name: "Research",
    slug: "research",
    fileCount: 67,
    description: "Papers, notes, and reference material",
    icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
    iconBg: "bg-emerald-50",
  },
  {
    name: "Travel",
    slug: "travel",
    fileCount: 32,
    description: "Tickets, itineraries, and saved spots",
    icon: <Plane className="w-5 h-5 text-sky-600" />,
    iconBg: "bg-sky-50",
  },
  {
    name: "Recipes",
    slug: "recipes",
    fileCount: 18,
    description: "Saved dishes and cooking notes",
    icon: <UtensilsCrossed className="w-5 h-5 text-orange-600" />,
    iconBg: "bg-orange-50",
  },
  {
    name: "School",
    slug: "school",
    fileCount: 41,
    description: "Assignments, slides, and study notes",
    icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
    iconBg: "bg-indigo-50",
  },
  {
    name: "Work",
    slug: "work",
    fileCount: 58,
    description: "Meeting notes and job-related files",
    icon: <Briefcase className="w-5 h-5 text-gray-600" />,
    iconBg: "bg-gray-100",
  },
  {
    name: "Inspiration",
    slug: "inspiration",
    fileCount: 15,
    description: "Ideas and things that caught your eye",
    icon: <Sparkles className="w-5 h-5 text-violet-600" />,
    iconBg: "bg-violet-50",
  },
];