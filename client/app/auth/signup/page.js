"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import BrainIcon from "@/assests/brain.js";


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      setError("Password doesn't meet the requirements below.");
      return;
    }

    setLoading(true);
    try {
      // TODO: hook this up to your auth endpoint
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white relative overflow-hidden flex items-center justify-center px-4 py-10 w-full">
      <div className="hidden lg:block absolute left-12 top-1/3 w-16 h-16 bg-violet-100/60 rounded-2xl border border-violet-100" />
      <div className="hidden lg:block absolute right-16 top-24 w-14 h-14 bg-violet-100/60 rounded-2xl border border-violet-100" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 text-lg">
              <BrainIcon className="w-10 h-10 text-violet-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              Memory<span className="text-violet-600">OS</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Your AI-powered second brain.<br />Find anything. Instantly.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Start organizing your digital life.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <PasswordRule met={hasMinLength} label="At least 8 characters" />
                <PasswordRule met={hasNumber} label="1 number" />
                <PasswordRule met={hasSpecialChar} label="1 special character" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium py-2.5 rounded-lg mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 transition-colors text-gray-700 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2">
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-violet-600 hover:text-violet-500 font-medium">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-violet-500 hover:underline">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="text-violet-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

function PasswordRule({ met, label }) {
  return (
    <span className={`text-xs flex items-center gap-1 ${met ? "text-green-600" : "text-gray-400"}`}>
      <span className={`w-1 h-1 rounded-full ${met ? "bg-green-600" : "bg-gray-300"}`} />
      {label}
    </span>
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