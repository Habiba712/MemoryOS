'use client'
import Image from "next/image";

import Dashboard from "@/app/pages/dashboard/page";
import HeroSection from "./hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <main className="w-full">
        <HeroSection />
      </main>
     
    </div>
  );
}
