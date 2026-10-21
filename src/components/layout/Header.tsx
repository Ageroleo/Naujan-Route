'use client';

import { MapPin, ShieldAlert } from 'lucide-react';
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
        <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
          <Link href="/" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Explore</Link>
          <Link href="/map" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/map' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Map</Link>
          <Link href="/fare-calculator" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/fare-calculator' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Fare</Link>
          <Link href="/directory" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/directory' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Directory</Link>
          <Link href="/emergency" className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === '/emergency' ? 'bg-white text-red-600 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Emergency</Link>
        </nav>

        {/* Quick Access Emergency Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-emergency-modal'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/90 text-xs font-extrabold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
            id="header-emergency-trigger"
            aria-label="Open emergency assistance modal"
            title="Instant Emergency Hotlines (911 & 143)"
          >
            <ShieldAlert size={14} className="text-red-600 animate-pulse" />
            <span className="hidden sm:inline">SOS / 911</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
