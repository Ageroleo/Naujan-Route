'use client';

import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo & App Name */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
            <MapPin size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold font-[family-name:var(--font-display)] leading-tight tracking-tight text-slate-900">
              Naujan Trail
            </h1>
            <p className="text-[10px] text-slate-500 leading-none">
              Oriental Mindoro
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
          <Link href="/" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Explore</Link>
          <Link href="/map" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/map' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Map</Link>
          <Link href="/fare-calculator" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/fare-calculator' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Fare</Link>
          <Link href="/emergency" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/emergency' ? 'bg-white text-red-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Emergency</Link>
        </nav>

        <div className="w-[88px] hidden md:block"></div>
      </div>
    </header>
  );
}
