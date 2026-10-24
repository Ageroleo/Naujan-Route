'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {
  Map as MapIcon,
  Layers,
  Navigation,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ListOrdered,
  Clock,
  Route as RouteIcon,
  AlertTriangle,
  MapPin,
  DollarSign,
  Info,
  Phone,
  PhoneOff,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FALLBACK_ATTRACTIONS, enrichWithTrailData } from '@/lib/data/fallback';
import { CATEGORY_CONFIG, type Attraction } from '@/lib/types/database';
import { CATEGORY_ICONS, CATEGORY_SVG_STRINGS } from '@/components/icons/CategoryIcons';
import { fetchRoutes, type RouteResult } from '@/lib/routing';
import { calculateCombinedFare, type CombinedFareResult } from '@/lib/data/jeepney-route';
import NawiReminderBanner from '@/components/mascot/NawiReminderBanner';

// Naujan center coordinates
const NAUJAN_CENTER: [number, number] = [13.2500, 121.2500];
const DEFAULT_ZOOM = 11;
const FOCUSED_ZOOM = 15;

// ─── Route color scheme ───────────────────────────────────────
const ROUTE_COLORS = [
  { color: '#0284C7', label: 'blue' },   // selected / fastest
  { color: '#8B5CF6', label: 'purple' }, // alt 1
  { color: '#F59E0B', label: 'amber' },  // alt 2
];

// Haversine distance in km (fallback for offline)
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// Create custom colored icons for each category
function createCategoryIcon(category: string, isHighlighted = false): L.DivIcon {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  const color = config?.color || '#059669';
  const svgStr = CATEGORY_SVG_STRINGS[category as keyof typeof CATEGORY_SVG_STRINGS] || '';
  const size = isHighlighted ? 46 : 36;
  const ring = isHighlighted ? 'border: 3px solid #FFD700; box-shadow: 0 0 20px #FFD70088, 0 3px 12px ' + color + '66;' : 'border: 2px solid white; box-shadow: 0 3px 12px ' + color + '66;';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        ${ring}
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
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// User location marker
function createUserIcon(): L.DivIcon {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width: 18px; height: 18px;
        background: #0284C7;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 12px rgba(2,132,199,0.4);
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: rgba(2,132,199,0.12);
          animation: pulse 2s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}



// Component that auto-centers the map — now route-aware
function MapController({
  target,
  userLocation,
  routeCoordinates,
}: {
  target: Attraction | null;
  userLocation: [number, number] | null;
  routeCoordinates: [number, number][] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 1) {
      // Fit to the full route polyline
      const latLngs = routeCoordinates.map(([lng, lat]) => L.latLng(lat, lng));
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    } else if (target && userLocation) {
      // Fit bounds to show both user and target
      const bounds = L.latLngBounds(
        [target.latitude, target.longitude],
        userLocation
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    } else if (target) {
      map.setView([target.latitude, target.longitude], FOCUSED_ZOOM, {
        animate: true,
        duration: 1,
      });
    }
  }, [target, userLocation, routeCoordinates, map]);

  return null;
}

// Location button component
function LocationButton({
  onLocated,
}: {
  onLocated: (latlng: [number, number]) => void;
}) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    map.locate({ setView: false, maxZoom: 15 });

    map.once('locationfound', (e) => {
      onLocated([e.latlng.lat, e.latlng.lng]);
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

// ─── Step icon based on maneuver type ─────────────────────────
function StepIcon({ type, modifier }: { type: string; modifier?: string }) {
  const getArrow = () => {
    if (type === 'depart') return '🚩';
    if (type === 'arrive') return '📍';
    if (type === 'roundabout' || type === 'rotary') return '🔄';
    if (!modifier) return '⬆️';
    if (modifier.includes('left')) return '⬅️';
    if (modifier.includes('right')) return '➡️';
    if (modifier === 'uturn') return '↩️';
    return '⬆️';
  };
  return <span className="text-sm shrink-0">{getArrow()}</span>;
}

export default function MapPageClient() {
  const searchParams = useSearchParams();
  const attractionSlug = searchParams.get('attraction');

  const [attractions, setAttractions] = useState<Attraction[]>(FALLBACK_ATTRACTIONS);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [fareExpanded, setFareExpanded] = useState(true);
  const [spotInfoExpanded, setSpotInfoExpanded] = useState(true);

  // Routing state — now supports multiple alternatives
  const [allRoutes, setAllRoutes] = useState<RouteResult[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false);

  // Prevent duplicate fetch
  const routeFetchedRef = useRef<string | null>(null);

  // The targeted attraction from the URL param
  const targetAttraction = useMemo(
    () => (attractionSlug ? attractions.find((a) => a.slug === attractionSlug) || null : null),
    [attractionSlug, attractions]
  );

  // Currently selected route (derived from allRoutes)
  const activeRoute: RouteResult | null = useMemo(
    () => (allRoutes.length > 0 ? allRoutes[selectedRouteIndex] ?? allRoutes[0] : null),
    [allRoutes, selectedRouteIndex]
  );

  // Distance: prefer road distance from active route, fall back to haversine
  const distanceKm = useMemo(() => {
    if (activeRoute) return activeRoute.distanceKm;
    if (!userLocation || !targetAttraction) return null;
    return haversineDistance(
      userLocation[0], userLocation[1],
      targetAttraction.latitude, targetAttraction.longitude
    );
  }, [userLocation, targetAttraction, activeRoute]);

  // Whether we're showing straight-line fallback
  const isOfflineFallback = useMemo(
    () => !activeRoute && distanceKm !== null,
    [activeRoute, distanceKm]
  );

  // Combined fare: jeepney (highway) + tricycle (last mile)
  const combinedFare: CombinedFareResult | null = useMemo(() => {
    if (!userLocation || !targetAttraction) return null;
    return calculateCombinedFare(
      userLocation[0], userLocation[1],
      targetAttraction.latitude, targetAttraction.longitude
    );
  }, [userLocation, targetAttraction]);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const attractionsRes = await supabase.from('attractions').select('*').order('name');

        if (!attractionsRes.error && attractionsRes.data?.length) {
          setAttractions((attractionsRes.data as Attraction[]).map(enrichWithTrailData));
        }
      } catch {
        // Use fallback
      }
    }
    fetchData();
  }, []);

  // Auto-locate user when targeting an attraction
  useEffect(() => {
    if (targetAttraction && !userLocation && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setUsingFallbackLocation(false);
        },
        () => {
          // Geolocation denied — fall back to Naujan Municipal Hall
          setUserLocation(NAUJAN_CENTER);
          setUsingFallbackLocation(true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [targetAttraction, userLocation]);

  // Fetch road routes (with alternatives) when both user location and target are available
  useEffect(() => {
    if (!userLocation || !targetAttraction) return;

    const routeKey = `${userLocation[0]},${userLocation[1]}-${targetAttraction.id}`;
    if (routeFetchedRef.current === routeKey) return; // already fetched
    routeFetchedRef.current = routeKey;

    async function getRoutes() {
      setIsRoutingLoading(true);
      setRouteError(null);
      setAllRoutes([]);
      setSelectedRouteIndex(0);

      const results = await fetchRoutes(
        userLocation![0], userLocation![1],
        targetAttraction!.latitude, targetAttraction!.longitude
      );

      if (results.length > 0) {
        setAllRoutes(results);
      } else {
        setRouteError('Could not calculate road route. Showing direct distance.');
      }

      setIsRoutingLoading(false);
    }
    getRoutes();
  }, [userLocation, targetAttraction]);

  const handleUserLocated = useCallback((latlng: [number, number]) => {
    setUserLocation(latlng);
    setUsingFallbackLocation(false);
    // Reset routes so they re-fetch with new location
    routeFetchedRef.current = null;
    setAllRoutes([]);
    setSelectedRouteIndex(0);
  }, []);

  // Clear all routes
  const handleClearRoute = useCallback(() => {
    setAllRoutes([]);
    setRouteError(null);
    setShowDirections(false);
    setSelectedRouteIndex(0);
    routeFetchedRef.current = null;
  }, []);

  // Route coordinates for map fitting (use active route)
  const routeCoordinates = useMemo(() => {
    if (!activeRoute) return null;
    return activeRoute.geometry.coordinates as [number, number][];
  }, [activeRoute]);

  // All routes converted to Leaflet positions [lat, lng] for polylines
  const allRoutePositions = useMemo(() => {
    return allRoutes.map((route) =>
      route.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
      )
    );
  }, [allRoutes]);

  // Google Maps directions link (uses active route destination)
  const googleMapsLink = useMemo(() => {
    if (!userLocation || !targetAttraction) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${targetAttraction.latitude},${targetAttraction.longitude}&travelmode=driving`;
  }, [userLocation, targetAttraction]);

  // Cycle through routes
  const handlePrevRoute = useCallback(() => {
    setSelectedRouteIndex((prev) => (prev > 0 ? prev - 1 : allRoutes.length - 1));
    setShowDirections(false);
  }, [allRoutes.length]);

  const handleNextRoute = useCallback(() => {
    setSelectedRouteIndex((prev) => (prev < allRoutes.length - 1 ? prev + 1 : 0));
    setShowDirections(false);
  }, [allRoutes.length]);

  return (
    <div className="px-4 py-6 md:py-8 max-w-7xl mx-auto space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <MapIcon size={18} className="text-emerald-600" />
          <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-slate-900">
            {targetAttraction ? targetAttraction.name : 'Interactive Map'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Layers size={13} />
          <span>{attractions.length} pins</span>
        </div>
      </div>

      {/* ── Tourist Spot Info Card (visible when navigating to a spot) ── */}
      {targetAttraction && (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          {/* Card Header — always visible, toggles expand */}
          <button
            onClick={() => setSpotInfoExpanded(!spotInfoExpanded)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
            id="toggle-spot-info-button"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${CATEGORY_CONFIG[targetAttraction.category]?.color}14` }}
              >
                <Info size={17} style={{ color: CATEGORY_CONFIG[targetAttraction.category]?.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">About this spot</p>
                <p className="text-[10px] text-slate-500 truncate">
                  {targetAttraction.name}
                </p>
              </div>
            </div>
            {spotInfoExpanded
              ? <ChevronUp size={16} className="text-slate-400 shrink-0" />
              : <ChevronDown size={16} className="text-slate-400 shrink-0" />
            }
          </button>

          {/* Expandable Content */}
          {spotInfoExpanded && (
            <div className="px-3 pb-3 space-y-3 animate-fade-in">
              {/* Cover Image */}
              {targetAttraction.cover_image && (
                <div className="relative h-40 rounded-lg overflow-hidden bg-slate-100">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${encodeURI(targetAttraction.cover_image)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* Category badge on image */}
                  <div className="absolute top-2 right-2 badge flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-800 shadow-xs">
                    {(() => {
                      const Icon = CATEGORY_ICONS[targetAttraction.category];
                      return Icon ? <Icon size={12} style={{ color: CATEGORY_CONFIG[targetAttraction.category]?.color }} /> : null;
                    })()}
                    <span className="text-[10px] font-semibold">{CATEGORY_CONFIG[targetAttraction.category]?.label}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {targetAttraction.description && (
                <p className="text-xs text-slate-700 leading-relaxed">
                  {targetAttraction.description}
                </p>
              )}

              {/* Quick info pills */}
              <div className="flex flex-wrap gap-2">
                {targetAttraction.barangay && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                    <MapPin size={12} className="text-emerald-600 shrink-0" />
                    Brgy. {targetAttraction.barangay}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                  <DollarSign size={12} className="text-amber-600 shrink-0" />
                  {targetAttraction.entrance_fee}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                  <Clock size={12} className="text-sky-600 shrink-0" />
                  {targetAttraction.opening_hours}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div
        className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm animate-fade-in-up"
        style={{ height: targetAttraction ? 'calc(100dvh - 360px)' : 'calc(100dvh - 200px)', minHeight: '300px' }}
      >
        <div className="relative w-full h-full">
          {/* Route loading overlay */}
          {isRoutingLoading && (
            <div className="route-loading-overlay">
              <div className="flex flex-col items-center gap-2">
                <div className="route-loading-spinner" />
                <span className="text-xs font-medium text-slate-600">Calculating routes…</span>
              </div>
            </div>
          )}

          <MapContainer
            center={targetAttraction ? [targetAttraction.latitude, targetAttraction.longitude] : NAUJAN_CENTER}
            zoom={targetAttraction ? FOCUSED_ZOOM : DEFAULT_ZOOM}
            className="w-full h-full rounded-xl"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />




            {/* All attraction markers */}
            {attractions.map((attraction) => (
              <Marker
                key={attraction.id}
                position={[attraction.latitude, attraction.longitude]}
                icon={createCategoryIcon(
                  attraction.category,
                  targetAttraction?.id === attraction.id
                )}
              >
                <Popup>
                  <div className="space-y-2 min-w-[210px] max-w-[260px] p-0.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{attraction.name}</h3>
                    </div>
                    {attraction.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {attraction.description}
                      </p>
                    )}
                    <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                      <div>📍 {attraction.publishedLocation || (attraction.barangay ? `Brgy. ${attraction.barangay}` : 'Naujan')}</div>
                      <div>💰 {attraction.admissionStatus || attraction.entrance_fee}</div>
                      {attraction.publishedContact && (
                        <div>📞 {attraction.publishedContact}</div>
                      )}
                    </div>
                    {Array.isArray(attraction.activities) && attraction.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {attraction.activities.slice(0, 3).map((act, i) => (
                          <span
                            key={i}
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {typeof act === 'string' ? act : (act as { name: string }).name}
                          </span>
                        ))}
                        {attraction.activities.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{attraction.activities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    {attraction.nawiReminder && (
                      <div className="text-[10px] text-emerald-900 bg-emerald-50 rounded-lg p-2 border border-emerald-200/80 leading-snug">
                        🦆 <strong>Nawi:</strong> {attraction.nawiReminder}
                      </div>
                    )}
                    <div className="pt-1">
                      <a
                        href={`/map?attraction=${attraction.slug}`}
                        className="block text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-2 rounded-lg border border-emerald-200 transition-colors"
                      >
                        Set as Destination &rarr;
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User location marker */}
            {userLocation && (
              <Marker position={userLocation} icon={createUserIcon()}>
                <Popup>
                  <div className="text-xs font-medium text-slate-900">
                    📍 {usingFallbackLocation ? 'Naujan Municipal Hall (default)' : 'Your Location'}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* ── Route polylines — all alternatives ── */}
            {allRoutePositions.length > 0 && (
              <>
                {/* Draw inactive alternatives first (behind selected) */}
                {allRoutePositions.map((positions, idx) => {
                  if (idx === selectedRouteIndex) return null; // draw selected last
                  const routeColor = ROUTE_COLORS[idx] || ROUTE_COLORS[ROUTE_COLORS.length - 1];
                  return (
                    <Polyline
                      key={`alt-${idx}`}
                      positions={positions}
                      pathOptions={{
                        color: routeColor.color,
                        weight: 4,
                        opacity: 0.5,
                        dashArray: '10, 8',
                        lineCap: 'round',
                        lineJoin: 'round',
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedRouteIndex(idx);
                          setShowDirections(false);
                        },
                      }}
                    />
                  );
                })}

                {/* Selected route — drawn on top */}
                {allRoutePositions[selectedRouteIndex] && (
                  <>
                    {/* White casing for contrast */}
                    <Polyline
                      positions={allRoutePositions[selectedRouteIndex]}
                      pathOptions={{
                        color: '#FFFFFF',
                        weight: 9,
                        opacity: 0.9,
                        lineCap: 'round',
                        lineJoin: 'round',
                      }}
                    />
                    {/* Colored route line */}
                    <Polyline
                      positions={allRoutePositions[selectedRouteIndex]}
                      pathOptions={{
                        color: ROUTE_COLORS[selectedRouteIndex]?.color || ROUTE_COLORS[0].color,
                        weight: 6,
                        opacity: 0.9,
                        lineCap: 'round',
                        lineJoin: 'round',
                      }}
                    />
                  </>
                )}
              </>
            )}

            {/* ── Fallback straight line (only when no routes available) ── */}
            {allRoutePositions.length === 0 && userLocation && targetAttraction && !isRoutingLoading && (
              <Polyline
                positions={[
                  userLocation,
                  [targetAttraction.latitude, targetAttraction.longitude],
                ]}
                pathOptions={{
                  color: '#94A3B8',
                  weight: 3,
                  dashArray: '8, 8',
                  opacity: 0.6,
                }}
              />
            )}

            <MapController
              target={targetAttraction}
              userLocation={userLocation}
              routeCoordinates={routeCoordinates}
            />
            <LocationButton onLocated={handleUserLocated} />
          </MapContainer>
        </div>
      </div>

      {/* ── Route Selector Pills (shown when multiple alternatives exist) ── */}
      {allRoutes.length > 1 && !isRoutingLoading && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {allRoutes.length} Routes Available — Pick one
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 route-selector-scroll">
            {allRoutes.map((route, idx) => {
              const isActive = idx === selectedRouteIndex;
              const routeColor = ROUTE_COLORS[idx] || ROUTE_COLORS[ROUTE_COLORS.length - 1];
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedRouteIndex(idx);
                    setShowDirections(false);
                  }}
                  className={`route-pill ${isActive ? 'route-pill-active' : ''}`}
                  style={{
                    '--route-color': routeColor.color,
                  } as React.CSSProperties}
                  id={`route-pill-${idx}`}
                >
                  {/* Color dot */}
                  <span
                    className="route-pill-dot"
                    style={{ backgroundColor: routeColor.color }}
                  />
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {route.label}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {route.distanceText} · {route.durationText}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Destination Digital Trail Details Card ── */}
      {targetAttraction && (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-fade-in-up" id="destination-trail-card">
          <button
            onClick={() => setSpotInfoExpanded(!spotInfoExpanded)}
            className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: `${CATEGORY_CONFIG[targetAttraction.category]?.color || '#059669'}15` }}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[targetAttraction.category];
                  return Icon ? <Icon size={18} style={{ color: CATEGORY_CONFIG[targetAttraction.category]?.color || '#059669' }} /> : null;
                })()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{targetAttraction.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">
                  {targetAttraction.publishedLocation || (targetAttraction.barangay ? `Brgy. ${targetAttraction.barangay}, Naujan` : 'Naujan')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-slate-400">
              <span className="text-xs font-semibold text-emerald-700 mr-1">
                {spotInfoExpanded ? 'Hide Guide' : 'View Guide'}
              </span>
              {spotInfoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {spotInfoExpanded && (
            <div className="px-3.5 pb-3.5 space-y-3 border-t border-slate-100 animate-fade-in">
              {/* Description */}
              {targetAttraction.description && (
                <p className="text-xs text-slate-700 leading-relaxed">
                  {targetAttraction.description}
                </p>
              )}

              {/* Location & Contact Info */}
              <div className="space-y-1.5 text-xs bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <div className="flex items-start gap-1.5 text-slate-700">
                  <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Location: </span>
                    <span>{targetAttraction.publishedLocation || (targetAttraction.barangay ? `Brgy. ${targetAttraction.barangay}, Naujan` : 'Naujan')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-slate-700">
                  <Info size={13} className="text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Visitor Info: </span>
                    <span>
                      {targetAttraction.visitorInfo || `${targetAttraction.admissionStatus || targetAttraction.entrance_fee} • ${targetAttraction.opening_hours}`}
                    </span>
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="font-semibold text-slate-900">Contact:</span>
                  {(() => {
                    const contact = targetAttraction.publishedContact || targetAttraction.contact_number;
                    if (contact && contact !== 'For verification' && /[0-9]/.test(contact)) {
                      return (
                        <a
                          href={`tel:${contact.replace(/[^\d+]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <Phone size={11} strokeWidth={2.5} />
                          <span>{contact}</span>
                        </a>
                      );
                    }
                    if (contact === 'For verification') {
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-600">
                          <PhoneOff size={11} />
                          For verification
                        </span>
                      );
                    }
                    return <span className="text-[11px] text-slate-500">Contact MTO</span>;
                  })()}

                  {(targetAttraction.admissionStatus || targetAttraction.entrance_fee) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/80 text-emerald-800 ml-auto">
                      <DollarSign size={11} className="text-emerald-700" />
                      {targetAttraction.admissionStatus || targetAttraction.entrance_fee}
                    </span>
                  )}
                </div>
              </div>

              {/* Available Activities Chips */}
              {Array.isArray(targetAttraction.activities) && targetAttraction.activities.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <Sparkles size={11} className="text-emerald-600" />
                    <span>Available Activities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {targetAttraction.activities.map((act, i) => (
                      <span
                        key={i}
                        className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                      >
                        {typeof act === 'string' ? act : (act as { name: string }).name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nawi Reminder Banner */}
              {targetAttraction.nawiReminder && (
                <NawiReminderBanner
                  reminder={targetAttraction.nawiReminder}
                  attractionName={targetAttraction.name}
                  pose={targetAttraction.nawiPose}
                />
              )}

              {/* Official Source Link */}
              {targetAttraction.sourceUrl && (
                <div className="pt-0.5">
                  <a
                    href={targetAttraction.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <ExternalLink size={12} className="shrink-0" />
                    <span>Official Listing (Travel Oriental Mindoro)</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Route Summary Card ── */}
      {targetAttraction && (activeRoute || routeError || isOfflineFallback) && !isRoutingLoading && (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-route-card">
          {/* Card Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${CATEGORY_CONFIG[targetAttraction.category]?.color}12` }}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[targetAttraction.category];
                  return Icon ? <Icon size={16} style={{ color: CATEGORY_CONFIG[targetAttraction.category]?.color }} /> : null;
                })()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{targetAttraction.name}</p>
                <p className="text-[10px] text-slate-500">
                  Brgy. {targetAttraction.barangay}
                  {allRoutes.length > 1 && activeRoute && (
                    <span className="ml-1.5 text-emerald-600 font-semibold">
                      · {activeRoute.label}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Route navigation arrows (when multiple routes) */}
              {allRoutes.length > 1 && (
                <>
                  <button
                    onClick={handlePrevRoute}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Previous route"
                    id="prev-route-button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                    {selectedRouteIndex + 1}/{allRoutes.length}
                  </span>
                  <button
                    onClick={handleNextRoute}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Next route"
                    id="next-route-button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              <button
                onClick={handleClearRoute}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear route"
                id="clear-route-button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="px-3 py-2.5">
            {activeRoute ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-xs">
                  <RouteIcon size={14} className="text-sky-600" />
                  <span className="font-bold text-slate-900">{activeRoute.distanceText}</span>
                  <span className="text-slate-500">via road</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-xs">
                  <Clock size={14} className="text-amber-600" />
                  <span className="font-bold text-slate-900">{activeRoute.durationText}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-xs">
                <AlertTriangle size={14} className="text-orange-500 shrink-0" />
                <span className="text-slate-600">
                  <span className="font-semibold text-orange-600">Offline Estimate:</span>{' '}
                  Direct distance{distanceKm !== null ? ` ~${distanceKm.toFixed(1)} km` : ''}
                </span>
              </div>
            )}

            {usingFallbackLocation && (
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] text-slate-500">
                <MapPin size={12} className="shrink-0" />
                Using Naujan Municipal Hall as starting point
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-3 pb-2 flex gap-2">
            {googleMapsLink && (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                id="open-google-maps-button"
              >
                <ExternalLink size={13} />
                Open in Google Maps
              </a>
            )}
            {activeRoute && activeRoute.steps.length > 0 && (
              <button
                onClick={() => setShowDirections(!showDirections)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  showDirections
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                id="toggle-directions-button"
              >
                <ListOrdered size={13} />
                Steps
              </button>
            )}
          </div>

          {/* Step-by-Step Directions Drawer */}
          {showDirections && activeRoute && (
            <div className="border-t border-slate-100 px-3 py-2 animate-fade-in">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Turn-by-Turn Directions — {activeRoute.label}
              </p>
              <div className="route-steps-drawer space-y-1">
                {activeRoute.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <StepIcon type={step.maneuver.type} modifier={step.maneuver.modifier} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 leading-snug">{step.instruction}</p>
                      {step.distance > 0 && step.maneuver.type !== 'arrive' && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {step.distance >= 1000
                            ? `${(step.distance / 1000).toFixed(1)} km`
                            : `${Math.round(step.distance)} m`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fare Estimate Panel — shown when an attraction is targeted */}
      {targetAttraction && (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Panel Header */}
          <button
            onClick={() => setFareExpanded(!fareExpanded)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${CATEGORY_CONFIG[targetAttraction.category]?.color}12` }}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[targetAttraction.category];
                  return Icon ? <Icon size={16} style={{ color: CATEGORY_CONFIG[targetAttraction.category]?.color }} /> : null;
                })()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{targetAttraction.name}</p>
                <p className="text-[10px] text-slate-500">
                  Brgy. {targetAttraction.barangay} • {targetAttraction.entrance_fee}
                </p>
              </div>
            </div>
            {fareExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {fareExpanded && (
            <div className="px-3 pb-3 space-y-3">
              {/* Distance Info */}
              {distanceKm !== null ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-xs">
                  <Navigation size={14} className="text-emerald-600" />
                  <span className="text-slate-600">
                    {activeRoute ? 'Road' : 'Direct'} distance: <span className="font-bold text-slate-900">{distanceKm.toFixed(1)} km</span> from {usingFallbackLocation ? 'Municipal Hall' : 'your location'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-xs text-slate-500">
                  <Navigation size={14} />
                  <span>Enable location to see distance &amp; fare estimates</span>
                </div>
              )}

              {/* Combined Route Fare Breakdown */}
              {combinedFare && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Total Combined Fare</p>
                      <p className="text-[10px] text-slate-500">Jeepney Highway + Tricycle</p>
                      <p className="text-[10px] text-sky-600 font-medium">
                        Student/Senior/PWD: ₱{combinedFare.totalFare.discounted.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-extrabold text-emerald-700">
                        ₱{combinedFare.totalFare.regular.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">regular fare</p>
                    </div>
                  </div>

                  {/* Route Leg Breakdown */}
                  <div className="rounded-lg bg-slate-50 border border-slate-200/60 p-2.5 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Trip Breakdown
                    </p>

                    {/* Leg 1: Tricycle to highway if needed */}
                    {!combinedFare.userOnHighway && (
                      <div className="flex items-start justify-between text-xs text-slate-700">
                        <div className="flex items-start gap-1.5">
                          <span className="shrink-0 mt-0.5 text-amber-600 font-bold">🛺</span>
                          <div>
                            <p className="font-semibold text-slate-800">Tricycle to Highway</p>
                            <p className="text-[10px] text-slate-500">
                              To {combinedFare.boardingStop.name} ({combinedFare.boardingTricycleDistKm.toFixed(1)} km)
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ₱{combinedFare.boardingTricycleFare.regular.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Leg 2: Jeepney along highway */}
                    <div className="flex items-start justify-between text-xs text-slate-700">
                      <div className="flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5 text-blue-600 font-bold">🚐</span>
                        <div>
                          <p className="font-semibold text-slate-800">Jeepney (National Highway)</p>
                          <p className="text-[10px] text-slate-500">
                            {combinedFare.boardingStop.name} → {combinedFare.dropoffStop.name}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900">
                        ₱{combinedFare.jeepneyFare.regular.toFixed(2)}
                      </span>
                    </div>

                    {/* Leg 3: Tricycle to destination if needed */}
                    {!combinedFare.destinationOnHighway && (
                      <div className="flex items-start justify-between text-xs text-slate-700">
                        <div className="flex items-start gap-1.5">
                          <span className="shrink-0 mt-0.5 text-amber-600 font-bold">🛺</span>
                          <div>
                            <p className="font-semibold text-slate-800">Tricycle (Last Mile)</p>
                            <p className="text-[10px] text-slate-500">
                              From {combinedFare.dropoffStop.name} ({combinedFare.lastMileDistKm.toFixed(1)} km inside)
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ₱{combinedFare.lastMileTricycleFare.regular.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-[9px] text-slate-400 text-center pt-0.5">
                    * Jeepney fare based on LTFRB matrix. Tricycle fare based on Naujan Municipal Ordinance.
                  </p>
                </div>
              )}

              {/* Back to explore link */}
              <a
                href="/"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 pt-1 hover:underline"
              >
                <X size={12} />
                Back to Explore
              </a>
            </div>
          )}
        </div>
      )}

      {/* Legend — hide when fare panel is shown */}
      {!targetAttraction && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-xs font-semibold text-slate-600 mb-2">Map Legend</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(attractions.map((a) => a.category))).map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const IconComponent = CATEGORY_ICONS[cat];
              if (!config) return null;
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: `${config.color}10`, color: config.color }}
                >
                  {IconComponent && <IconComponent size={12} />}
                  {config.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
