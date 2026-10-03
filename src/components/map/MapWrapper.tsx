'use client';

import dynamic from 'next/dynamic';
import type { Attraction } from '@/lib/types/database';

const MapViewInner = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="animate-pulse-soft text-3xl">🗺️</div>
        <p className="text-sm text-text-secondary">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  attractions: Attraction[];
}

export default function MapWrapper({ attractions }: MapWrapperProps) {
  return <MapViewInner attractions={attractions} />;
}
