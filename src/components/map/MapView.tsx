'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { CATEGORY_CONFIG, type Attraction } from '@/lib/types/database';
import { CATEGORY_SVG_STRINGS } from '@/components/icons/CategoryIcons';
import { Navigation } from 'lucide-react';

// Naujan center coordinates
const NAUJAN_CENTER: [number, number] = [13.3236, 121.3039];
const DEFAULT_ZOOM = 12;

interface MapViewProps {
  attractions: Attraction[];
}

// Create custom colored icons for each category
function createCategoryIcon(category: string): L.DivIcon {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  const color = config?.color || '#059669';
  const svgStr = CATEGORY_SVG_STRINGS[category as keyof typeof CATEGORY_SVG_STRINGS] || '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 12px ${color}66;
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        ">${svgStr}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// Location button component that uses the map instance
function LocationButton() {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    map.locate({ setView: true, maxZoom: 15 });

    map.once('locationfound', (e) => {
      L.circle(e.latlng, { radius: e.accuracy, color: '#059669', fillOpacity: 0.1 }).addTo(map);
      L.marker(e.latlng).addTo(map).bindPopup('📍 You are here!').openPopup();
      setIsLocating(false);
    });

    map.once('locationerror', () => {
      setIsLocating(false);
      alert('Unable to find your location. Please enable GPS and try again.');
    });
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      className={`
        absolute bottom-4 right-4 z-[1000] w-12 h-12 rounded-full
        flex items-center justify-center shadow-md transition-all duration-200
        border border-slate-200
        ${isLocating
          ? 'bg-emerald-50 animate-pulse-soft'
          : 'bg-white hover:bg-slate-50'
        }
      `}
      aria-label="Find my location"
      id="locate-me-button"
    >
      <Navigation size={20} className="text-emerald-600" />
    </button>
  );
}

export default function MapView({ attractions }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-pulse-soft text-3xl">🗺️</div>
          <p className="text-sm text-slate-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={NAUJAN_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full rounded-xl"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.latitude, attraction.longitude]}
            icon={createCategoryIcon(attraction.category)}
          >
            <Popup>
              <div className="space-y-1.5 min-w-[180px]">
                <h3 className="font-bold text-sm text-slate-900">{attraction.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {attraction.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                  <span>📍 Brgy. {attraction.barangay}</span>
                  <span>💰 {attraction.entrance_fee}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationButton />
      </MapContainer>
    </div>
  );
}
