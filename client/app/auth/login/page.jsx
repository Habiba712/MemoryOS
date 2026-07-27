"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Search, FolderOpen, ShieldCheck } from "lucide-react";
import BrainIcon from "@/assests/brain.js";
import {useRouter} from "next/navigation";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
    

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: hook this up to your auth endpoint
      const res = await fetch(`http://localhost:4000/api/auth/login`, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
           const data = await res.json();
        localStorage.setItem("sessionData", JSON.stringify(data));
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
        // console.log('document token', request.cookies.get('token')?.value)
         router.push("/dashboard/dashboard");

      }
      else{
          setErrorMessage("Invalid email or password.");
        setEmail("");
        setPassword("");
        throw new Error(data.message || "Something went wrong");

      }
      setLoading(false);

    } catch (err) {
      setError(err.message);
    } 
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] relative overflow-hidden flex items-center justify-center px-4 py-10 w-full">
      {/* ambient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* floating decorative icons, hidden on small screens so they don't clutter mobile */}
      <div className="hidden lg:block absolute left-10 top-1/3 w-16 h-16 bg-white/5 rounded-2xl border border-white/10" />
      <div className="hidden lg:block absolute right-16 top-24 w-14 h-14 bg-white/5 rounded-2xl border border-white/10" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 text-lg">
              <BrainIcon className="w-10 h-10 text-violet-400" />
            </div>
            <span className="text-2xl font-semibold text-white">
              Memory<span className="text-violet-400">OS</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Your AI-powered second brain.<br />Find anything. Instantly.
          </p>
        </div>

        <div className="bg-[#12121f] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-xl font-semibold text-white mb-1">Welcome back 👋</h1>
          <p className="text-sm text-gray-400 mb-6">Log in to continue to your MemoryOS</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium py-2.5 rounded-lg mt-2"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-gray-500">or continue with</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button className="w-full bg-white hover:bg-gray-100 transition-colors text-gray-800 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2">
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/pages/signup" className="text-violet-400 hover:text-violet-300 font-medium">
              Create one
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <Feature icon={<Search className="w-4 h-4" />} title="AI Search" desc="Search using natural language" />
          <Feature icon={<FolderOpen className="w-4 h-4" />} title="All your files" desc="Images, PDFs, notes and more" />
          <Feature icon={<ShieldCheck className="w-4 h-4" />} title="Private & Secure" desc="Your data is always encrypted" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-300">{title}</p>
      <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6 29.5 4 24 4c-7.4 0-13.8 4.2-17.1 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-1.9 14-5.1l-6.5-5.5C29.4 34.9 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5C40.9 36.9 44 31 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}