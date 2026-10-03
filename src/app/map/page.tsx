'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const MapPageClient = dynamic(() => import('./MapPageClient'), {
  ssr: false,
  loading: () => (
    <div className="px-4 py-6 md:py-8 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-slate-200 animate-pulse" />
        <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
      </div>
      <div
        className="rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center"
        style={{ height: 'calc(100dvh - 200px)', minHeight: '400px' }}
      >
        <div className="text-center space-y-2">
          <div className="text-3xl">🗺️</div>
          <p className="text-sm text-slate-500">Loading map...</p>
        </div>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="px-4 py-6 md:py-8 max-w-7xl mx-auto flex items-center justify-center" style={{ height: 'calc(100dvh - 200px)' }}>
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    }>
      <MapPageClient />
    </Suspense>
  );
}
