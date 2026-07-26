"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Upload, Layers, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Search", href: "/dashboard/search", icon: Search },
  { label: "Upload", href: "/dashboard/upload", icon: Upload },
  { label: "Collections", href: "/dashboard/collections", icon: Layers },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col justify-between h-screen sticky top-0 px-4 py-5">
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-bold">
            ∞
          </div>
          <span className="font-semibold text-gray-900">
            Memory<span className="text-violet-600">OS</span>
          </span>
        </Link>

        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-violet-50 text-violet-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}