"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Star, Play } from "lucide-react";
import {useParams} from "next/navigation";

const TABS = ["Overview", "Extracted Text", "Metadata"];

export default function FileDetailView() {
  const [activeTab, setActiveTab] = useState("Overview");
  const {id} = useParams();


  const [file, setFile] = useState(null);
  const getFile = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/file/getFile/${id}`);
    if (!res.ok) throw new Error("Failed to load file");
    const data = await res.json();
    setFile(normalizeFile(data));
  }
  useEffect(() => {
    getFile();
  }, [id]);

console.log('file', file)
  if (!file) return null;

  return (
    <div className="max-w-2xl w-full bg-white px-4 py-8 mx-auto rounded-xl">
      <Link href="/dashboard/search" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="rounded-xl overflow-hidden bg-gray-900 h-56 mb-4 relative">
        {file.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No preview available
          </div>
        )}
        {file.fileType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between mb-1">
        <h1 className="text-lg font-semibold text-gray-900">{file.name}</h1>
        <button 
         className="shrink-0">
          <Star
            className={`w-5 h-5 ${file.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-5">
        {file.extension} · {file.sizeLabel} · Uploaded {file.uploadedAgo}
      </p>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm pb-2.5 -mb-px border-b-2 transition-colors ${
              activeTab === tab
                ? "border-violet-600 text-violet-700 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">AI Summary</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{file.summary || "No summary generated yet."}</p>
          </section>

          {file.detectedObjects?.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Detected Objects</h2>
              <div className="flex flex-wrap gap-2">
                {file.detectedObjects.map((obj) => (
                  <span key={obj} className="text-xs text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
                    {obj}
                  </span>
                ))}
              </div>
            </section>
          )}

          {file.tags?.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {file.tags.map((tag) => (
                  <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {file.similarFiles?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900">Similar Files</h2>
                <Link href={`/dashboard/files/${file.id}/similar`} className="text-xs text-violet-600 hover:text-violet-500">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {file.similarFiles.map((sf) => (
                  <Link
                    key={sf.id}
                    href={`/dashboard/files/${sf.id}`}
                    className="h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    {sf.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sf.thumbnailUrl} alt={sf.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === "Extracted Text" && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {file.extractedText || "No text was extracted from this file."}
          </p>
        </div>
      )}

      {activeTab === "Metadata" && (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          <MetaRow label="File type" value={file.mimeType} />
          <MetaRow label="Size" value={file.sizeLabel} />
          <MetaRow label="Uploaded" value={file.uploadedAt} />
          {file.dimensions && (
            <MetaRow label="Dimensions" value={`${file.dimensions.width} × ${file.dimensions.height}`} />
          )}
          {file.pageCount && <MetaRow label="Pages" value={file.pageCount} />}
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

// Maps whatever your backend actually returns (Mongo doc shape, e.g. originalName,
// size, createdAt) onto the field names this component reads. Add/adjust the
// right-hand side if your real field names differ from what's guessed here.
function normalizeFile(raw) {
  if (!raw) return null;

  return {
    id: raw._id || raw.id,
    name: raw.originalName || raw.name,
    fileType: raw.fileType,
    mimeType: raw.mimeType,
    extension: (raw.originalName || raw.name || "")
      .split(".")
      .pop()
      ?.toUpperCase(),
    sizeLabel: raw.sizeLabel || formatBytes(raw.size),
    uploadedAt: raw.uploadedAt || (raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : ""),
    uploadedAgo: raw.uploadedAgo || (raw.createdAt ? timeAgo(raw.createdAt) : ""),
    thumbnailUrl: raw.thumbnailUrl || raw.url,
    summary: raw.summary,
    extractedText: raw.extractedText,
    tags: raw.tags || [],
    detectedObjects: raw.detectedObjects || [],
    dimensions: raw.dimensions,
    pageCount: raw.pageCount,
    isFavorite: raw.isFavorite,
    similarFiles: raw.similarFiles || [],
  };
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateString) {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}