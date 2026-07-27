'use client'

import Link from "next/link";
import BrainIcon from "@/assests/brain.js";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/40 to-white">
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-bold">
            <BrainIcon className="w-10 h-10 text-violet-600" />
          </div>
          <span className="font-semibold text-gray-900">
            Memory<span className="text-violet-600">OS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link href="#features" className="hover:text-gray-900">Features</Link>
          <Link href="#how-it-works" className="hover:text-gray-900">How it works</Link>
          <Link href="#pricing" className="hover:text-gray-900">Pricing</Link>
          <Link href="/login" className="hover:text-gray-900">Login</Link>
        </nav>

        <Link
          href="/auth/signup"
          className="bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          Get Started
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find <span className="text-violet-600">anything</span> you&apos;ve ever saved.
          </h1>

          <p className="text-gray-500 mt-5 max-w-md leading-relaxed">
            MemoryOS is your AI-powered second brain. Upload once, find forever.
            Search naturally, not by filename or folder.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <Link
              href="/auth/signup"
              className="bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-5 py-3 rounded-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="#how-it-works"
              className="border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium px-5 py-3 rounded-lg flex items-center gap-1.5"
            >
              See How It Works
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* <p className="text-xs text-gray-400 mt-10">
            Trusted by students, developers, designers and<br />thousands of productive people.
          </p> */}
        </div>

        <div className="flex justify-center">
          <svg viewBox="0 0 560 480" className="w-full h-auto max-w-xl">
            <defs>
              <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#4c1d95" floodOpacity="0.15" />
              </filter>
              <filter id="badgeShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e1b4b" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* sparkle dots scattered around */}
            <g fill="#a78bfa" opacity="0.6">
              <circle cx="500" cy="90" r="3" />
              <circle cx="520" cy="140" r="2" />
              <circle cx="60" cy="380" r="3" />
              <circle cx="30" cy="150" r="2" />
            </g>
            <g fill="#fbbf24" opacity="0.7">
              <path d="M470 340 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" />
              <path d="M40 260 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
            </g>

            {/* main tilted browser card */}
            <g transform="rotate(-3 280 240)" filter="url(#cardShadow)">
              <rect x="120" y="70" width="320" height="340" rx="18" fill="#ffffff" stroke="#e5e7eb" />

              {/* top bar with search + share icon */}
              <rect x="140" y="92" width="240" height="30" rx="8" fill="#f3f4f6" />
              <circle cx="155" cy="107" r="4.5" fill="none" stroke="#9ca3af" strokeWidth="1.6" />
              <line x1="158.5" y1="110.5" x2="163" y2="115" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
              <text x="172" y="111" fontSize="9" fill="#6b7280" fontFamily="Arial, sans-serif">
                purple dashboard react tutorial
              </text>
              <rect x="392" y="92" width="28" height="30" rx="8" fill="#f3f4f6" />
              <path d="M402 100 l0 14 M398 104 l4 -4 4 4 M398 110 h8" stroke="#9ca3af" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

              {/* AI reply row */}
              <circle cx="150" cy="140" r="9" fill="#ede9fe" />
              <text x="150" y="144" fontSize="9" fill="#7c3aed" fontFamily="Arial, sans-serif" textAnchor="middle">A</text>
              <rect x="168" y="133" width="60" height="14" rx="7" fill="#f3f4f6" />
              <text x="176" y="143" fontSize="8" fill="#9ca3af" fontFamily="Arial, sans-serif">Found 3 results</text>

              {/* dark dashboard preview card */}
              <rect x="140" y="160" width="120" height="80" rx="10" fill="#1e1b2e" />
              <rect x="150" y="170" width="100" height="14" rx="3" fill="#4c1d95" opacity="0.7" />
              <rect x="150" y="190" width="45" height="40" rx="4" fill="#312e81" opacity="0.6" />
              <rect x="200" y="190" width="50" height="18" rx="3" fill="#6d28d9" opacity="0.7" />
              <rect x="200" y="212" width="50" height="18" rx="3" fill="#4c1d95" opacity="0.5" />
              <circle cx="248" cy="168" r="3" fill="#f472b6" />

              <text x="140" y="252" fontSize="8" fill="#9ca3af" fontFamily="Arial, sans-serif">React Dashboard.png</text>
              <text x="140" y="263" fontSize="7" fill="#c4b5fd" fontFamily="Arial, sans-serif">95% match</text>

              {/* PDF result card */}
              <rect x="270" y="160" width="90" height="80" rx="10" fill="#fafafa" stroke="#f0f0f0" />
              <rect x="280" y="170" width="26" height="30" rx="4" fill="#ef4444" />
              <text x="293" y="188" fontSize="7" fill="#ffffff" fontFamily="Arial, sans-serif" textAnchor="middle">PDF</text>
              <text x="280" y="215" fontSize="8" fill="#374151" fontFamily="Arial, sans-serif">French Recipe</text>
              <text x="280" y="226" fontSize="7" fill="#9ca3af" fontFamily="Arial, sans-serif">92% match</text>

              {/* bottom code-ish lines */}
              <rect x="140" y="256" width="220" height="8" rx="2" fill="#f3f4f6" />
              <rect x="140" y="268" width="180" height="8" rx="2" fill="#f3f4f6" />
              <rect x="140" y="280" width="200" height="8" rx="2" fill="#f3f4f6" />
            </g>

            {/* floating badge: PDF, top left */}
            <g filter="url(#badgeShadow)">
              <rect x="60" y="150" width="52" height="52" rx="16" fill="#ef4444" />
              <text x="86" y="182" fontSize="13" fontWeight="bold" fill="#ffffff" fontFamily="Arial, sans-serif" textAnchor="middle">PDF</text>
            </g>

            {/* floating badge: play button, lower left */}
            <g filter="url(#badgeShadow)">
              <circle cx="86" cy="300" r="26" fill="#7c3aed" />
              <path d="M79 289 l18 11 -18 11 z" fill="#ffffff" />
            </g>

            {/* floating badge: chart/image icon, top right */}
            <g filter="url(#badgeShadow)">
              <rect x="452" y="170" width="48" height="48" rx="14" fill="#22c55e" />
              <path d="M464 202 l8 -12 6 8 10 -14" stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* floating badge: document icon, lower right */}
            <g filter="url(#badgeShadow)">
              <rect x="458" y="270" width="46" height="46" rx="14" fill="#3b82f6" />
              <rect x="472" y="280" width="18" height="24" rx="2" fill="#ffffff" />
              <line x1="475" y1="286" x2="486" y2="286" stroke="#3b82f6" strokeWidth="1.4" />
              <line x1="475" y1="291" x2="486" y2="291" stroke="#3b82f6" strokeWidth="1.4" />
              <line x1="475" y1="296" x2="482" y2="296" stroke="#3b82f6" strokeWidth="1.4" />
            </g>
          </svg>
        </div>
      </main>
    </div>
  );
}