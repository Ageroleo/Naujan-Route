'use client';

import NawiMascot from './Nawi';
import Link from 'next/link';
import { Phone, MapPin, RefreshCw, WifiOff } from 'lucide-react';

export default function NawiOfflineCard() {
  return (
    <div className="flex flex-col items-center text-center px-4 py-10 space-y-6 animate-fade-in">
      {/* Offline badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
        <WifiOff size={12} />
        No Connection
      </div>

      <NawiMascot
        size={180}
        speechBubble="You're currently offline, but don't worry! Your cached destination guides and emergency hotlines are still accessible."
        showBanner
        pose="binoculars"
      />

      <div className="w-full max-w-xs space-y-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {/* Primary: Emergency directory */}
        <Link
          href="/emergency"
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-sm"
          id="offline-emergency-link"
        >
          <Phone size={16} />
          View Offline Emergency Directory
        </Link>

        {/* Secondary: Browse saved spots */}
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm"
          id="offline-browse-link"
        >
          <MapPin size={16} />
          Browse Saved Tourist Spots
        </Link>

        {/* Tertiary: Retry */}
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-sm font-medium"
          id="offline-retry-button"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
