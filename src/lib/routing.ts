// OSRM Routing Service for Naujan Tourism PWA
// Fetches real road routes from the OSRM public demo server

// ─── Types ────────────────────────────────────────────────────

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  name: string; // road name
  maneuver: {
    type: string;
    modifier?: string;
  };
}

export interface RouteResult {
  /** Human-readable label, e.g. "Fastest route", "Alternative 1" */
  label: string;
  /** GeoJSON LineString geometry for drawing on the map */
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [lng, lat][]
  };
  /** Total distance in kilometers, rounded to 1 decimal */
  distanceKm: number;
  /** Raw distance in meters */
  distanceMeters: number;
  /** Human-readable distance string, e.g. "14.8 km" */
  distanceText: string;
  /** Human-readable duration string, e.g. "25 mins" or "1 hr 10 mins" */
  durationText: string;
  /** Raw duration in seconds */
  durationSeconds: number;
  /** Turn-by-turn navigation steps */
  steps: RouteStep[];
}

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Format a duration in seconds to a human-readable string.
 * e.g. 1500 → "25 mins", 4200 → "1 hr 10 mins"
 */
function formatDuration(seconds: number): string {
  const totalMins = Math.round(seconds / 60);
  if (totalMins < 60) {
    return `${totalMins} min${totalMins !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (mins === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
}

/**
 * Format a distance in meters to a human-readable km string.
 * e.g. 14832 → "14.8 km"
 */
function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Map OSRM maneuver type + modifier to a human-readable instruction prefix.
 */
function formatManeuver(type: string, modifier?: string): string {
  const modMap: Record<string, string> = {
    left: 'Turn left',
    right: 'Turn right',
    'slight left': 'Slight left',
    'slight right': 'Slight right',
    'sharp left': 'Sharp left',
    'sharp right': 'Sharp right',
    straight: 'Continue straight',
    uturn: 'Make a U-turn',
  };

  switch (type) {
    case 'depart':
      return 'Depart';
    case 'arrive':
      return 'Arrive at destination';
    case 'turn':
    case 'new name':
    case 'end of road':
      return modifier ? (modMap[modifier] || `Turn ${modifier}`) : 'Continue';
    case 'merge':
      return modifier ? `Merge ${modifier}` : 'Merge';
    case 'fork':
      return modifier ? `Take the ${modifier} fork` : 'Take the fork';
    case 'roundabout':
    case 'rotary':
      return 'Enter the roundabout';
    case 'exit roundabout':
    case 'exit rotary':
      return 'Exit the roundabout';
    case 'continue':
      return modifier ? (modMap[modifier] || 'Continue') : 'Continue';
    default:
      return modifier ? (modMap[modifier] || 'Continue') : 'Continue';
  }
}

// ─── Shared Route Parser ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOsrmRoute(route: any, index: number): RouteResult {
  const distanceMeters: number = route.distance;
  const durationSeconds: number = route.duration;

  // Label: first route is fastest, rest are numbered alternatives
  const label = index === 0 ? 'Fastest route' : `Alternative ${index}`;

  // Extract turn-by-turn steps from the first leg
  const leg = route.legs?.[0];
  const steps: RouteStep[] = (leg?.steps || [])
    .filter((s: { maneuver?: { type?: string } }) => s.maneuver?.type !== 'arrive' || true)
    .map((s: {
      name?: string;
      distance?: number;
      duration?: number;
      maneuver?: { type?: string; modifier?: string };
    }) => {
      const maneuverType = s.maneuver?.type || 'continue';
      const maneuverModifier = s.maneuver?.modifier;
      const roadName = s.name || 'unnamed road';
      const prefix = formatManeuver(maneuverType, maneuverModifier);
      const instruction =
        maneuverType === 'arrive'
          ? 'Arrive at your destination'
          : maneuverType === 'depart'
            ? `Head ${maneuverModifier || ''} on ${roadName}`.trim()
            : `${prefix} onto ${roadName}`;

      return {
        instruction,
        distance: s.distance || 0,
        duration: s.duration || 0,
        name: roadName,
        maneuver: {
          type: maneuverType,
          modifier: maneuverModifier || '',
        },
      };
    });

  return {
    label,
    geometry: route.geometry,
    distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
    distanceMeters,
    distanceText: formatDistance(distanceMeters),
    durationText: formatDuration(durationSeconds),
    durationSeconds,
    steps,
  };
}

// ─── Waypoint-based Alternative Helpers ───────────────────────

/**
 * Compute perpendicular offset waypoints from the midpoint of origin→dest.
 * Used to coerce OSRM into returning genuinely different paths through
 * nearby road junctions even in sparse rural networks.
 */
function computeOffsetWaypoints(
  originLat: number, originLng: number,
  destLat: number, destLng: number,
): { lat: number; lng: number }[] {
  const midLat = (originLat + destLat) / 2;
  const midLng = (originLng + destLng) / 2;

  // Direction vector from origin to destination
  const dLat = destLat - originLat;
  const dLng = destLng - originLng;

  // Perpendicular vectors (rotated ±90°)
  // Scale the offset: ~15-20% of the route length gives meaningful detours
  const scale = 0.18;
  const perpLat = -dLng * scale;
  const perpLng = dLat * scale;

  return [
    { lat: midLat + perpLat, lng: midLng + perpLng }, // offset "left"
    { lat: midLat - perpLat, lng: midLng - perpLng }, // offset "right"
  ];
}

/**
 * Fetch a single OSRM route passing through an intermediate waypoint.
 * Returns null on failure.
 */
async function fetchRouteViaWaypoint(
  originLat: number, originLng: number,
  waypointLat: number, waypointLng: number,
  destLat: number, destLng: number,
  timeoutMs = 10000,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${originLng},${originLat};${waypointLng},${waypointLat};${destLng},${destLat}` +
    `?overview=full&geometries=geojson&steps=true&continue_straight=false`;

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(tid);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return null;

    // OSRM splits via-waypoint routes into multiple legs — merge them
    const route = data.routes[0];
    const mergedSteps: unknown[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    for (const leg of route.legs) {
      totalDistance += leg.distance;
      totalDuration += leg.duration;
      if (leg.steps) mergedSteps.push(...leg.steps);
    }

    return {
      distance: totalDistance,
      duration: totalDuration,
      geometry: route.geometry,
      legs: [{ steps: mergedSteps, distance: totalDistance, duration: totalDuration }],
    };
  } catch {
    return null;
  }
}

/**
 * Simple overlap check: sample coordinates from two geometries and
 * measure how many points from `candidate` are close to any point in `reference`.
 * Returns a ratio 0..1 where 1 = fully overlapping.
 */
function routeOverlapRatio(
  refCoords: [number, number][],
  candCoords: [number, number][],
): number {
  // Sample at most 40 evenly-spaced points from the candidate
  const sampleCount = Math.min(40, candCoords.length);
  const step = Math.max(1, Math.floor(candCoords.length / sampleCount));

  // Threshold: ~200m in degrees (rough at this latitude)
  const threshold = 0.002;

  let matchCount = 0;

  for (let i = 0; i < candCoords.length; i += step) {
    const [cLng, cLat] = candCoords[i];
    const isClose = refCoords.some(([rLng, rLat]) => {
      return Math.abs(cLng - rLng) < threshold && Math.abs(cLat - rLat) < threshold;
    });
    if (isClose) matchCount++;
  }

  return matchCount / Math.ceil(candCoords.length / step);
}

// ─── Main Routing Functions ───────────────────────────────────

/**
 * Fetch **all** alternative driving routes between two coordinates
 * using the OSRM public API.
 *
 * Strategy:
 * 1. Request OSRM with `alternatives=true`
 * 2. If OSRM returns < 3 routes (common in rural networks), generate
 *    waypoint-detour alternatives via perpendicular offset midpoints
 * 3. De-duplicate alternatives that overlap > 80% with an existing route
 *
 * Returns an array of RouteResults sorted fastest-first.
 * Returns an empty array on failure.
 */
export async function fetchRoutes(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult[]> {
  // OSRM expects coordinates as lng,lat — alternatives=true requests up to 3 routes
  const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true&alternatives=true`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Routing] OSRM responded with status ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('[Routing] OSRM returned no routes:', data.code);
      return [];
    }

    // Parse all natively returned routes (usually 1–3)
    const results: RouteResult[] = data.routes.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (route: any, idx: number) => parseOsrmRoute(route, idx)
    );

    // ── Generate waypoint-based alternatives if OSRM gave us < 3 ──
    if (results.length < 3) {
      const waypoints = computeOffsetWaypoints(originLat, originLng, destLat, destLng);

      // Fetch waypoint detour routes in parallel
      const waypointRoutes = await Promise.all(
        waypoints.map((wp) =>
          fetchRouteViaWaypoint(originLat, originLng, wp.lat, wp.lng, destLat, destLng)
        )
      );

      for (const wpRoute of waypointRoutes) {
        if (results.length >= 3) break;
        if (!wpRoute) continue;

        const candCoords = wpRoute.geometry?.coordinates as [number, number][] | undefined;
        if (!candCoords || candCoords.length < 2) continue;

        // Check overlap with every already-accepted route
        const isDuplicate = results.some((existing) => {
          const refCoords = existing.geometry.coordinates;
          return routeOverlapRatio(refCoords, candCoords) > 0.80;
        });

        if (!isDuplicate) {
          results.push(parseOsrmRoute(wpRoute, results.length));
        }
      }
    }

    // Sort by duration (fastest first) and re-label
    results.sort((a, b) => a.durationSeconds - b.durationSeconds);
    results.forEach((r, i) => {
      r.label = i === 0 ? 'Fastest route' : `Alternative ${i}`;
    });

    return results;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error('[Routing] Request timed out');
    } else {
      console.error('[Routing] Failed to fetch routes:', err);
    }
    return [];
  }
}

/**
 * Fetch the single fastest driving route (backward-compatible wrapper).
 */
export async function fetchRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult | null> {
  const routes = await fetchRoutes(originLat, originLng, destLat, destLng);
  return routes.length > 0 ? routes[0] : null;
}

