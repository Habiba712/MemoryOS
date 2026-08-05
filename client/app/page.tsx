'use client'
import Image from "next/image";

import HeroSection from "./hero";

const metadata = {
  title: "MemoryOS",
  description: "MemoryOS is your AI-powered second brain. Upload once, find forever. Search naturally, not by filename or folder.",
  icon: "/favicon.ico",
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <main className="w-full">
        <HeroSection />
      </main>
     
    </div>
  );
}
