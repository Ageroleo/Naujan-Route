// Jeepney Route Data — Calapan City Pier → Naujan Town Proper
// Defines the highway route, stops, and fare calculation utilities

// ─── Types ────────────────────────────────────────────────────

export interface JeepneyStop {
  name: string;
  km: number;
  latitude: number;
  longitude: number;
  regularFare: number;  // fare from Calapan Pier (KM 0)
  discountedFare: number; // S/E/D fare from Calapan Pier
}

// ─── Jeepney Stops (Calapan Pier → Naujan TP) ────────────────

export const JEEPNEY_STOPS: JeepneyStop[] = [
  { name: 'Calapan City Pier',    km: 0,  latitude: 13.4119, longitude: 121.1767, regularFare: 0,     discountedFare: 0 },
  { name: 'Lalud / Tawiran',      km: 4,  latitude: 13.4109, longitude: 121.1929, regularFare: 12.00, discountedFare: 9.50 },
  { name: 'Sta. Isabel',          km: 7,  latitude: 13.4056, longitude: 121.2088, regularFare: 15.50, discountedFare: 12.50 },
  { name: 'Malad',                km: 10, latitude: 13.3988, longitude: 121.2220, regularFare: 21.00, discountedFare: 16.75 },
  { name: 'Bucayao',              km: 15, latitude: 13.3825, longitude: 121.2425, regularFare: 30.00, discountedFare: 24.00 },
  { name: 'Tamaraw',              km: 20, latitude: 13.3625, longitude: 121.2580, regularFare: 40.75, discountedFare: 32.75 },
  { name: 'Kurba-Naujan',         km: 25, latitude: 13.3460, longitude: 121.2720, regularFare: 49.75, discountedFare: 39.75 },
  { name: 'Santiago',             km: 30, latitude: 13.3350, longitude: 121.2850, regularFare: 58.75, discountedFare: 47.00 },
  { name: 'Naujan Town Proper',   km: 34, latitude: 13.3249, longitude: 121.3030, regularFare: 66.00, discountedFare: 52.75 },
];

export const JEEPNEY_ROUTE_COORDS: [number, number][] = [
  // Calapan City Pier area
  [13.4119, 121.1767],
  [13.4118, 121.1777],
  [13.4113, 121.1790],
  [13.4109, 121.1803],
  // Heading east along the coast through Santo Niño
  [13.4113, 121.1820],
  [13.4117, 121.1840],
  [13.4115, 121.1858],
  [13.4112, 121.1878],
  [13.4110, 121.1895],
  [13.4109, 121.1915],
  [13.4109, 121.1929],  // Lalud / Tawiran
  [13.4108, 121.1948],
  [13.4105, 121.1968],
  [13.4100, 121.1985],
  // Through Guinobatan area
  [13.4095, 121.2005],
  [13.4090, 121.2025],
  [13.4085, 121.2040],
  [13.4080, 121.2058],
  [13.4072, 121.2072],
  [13.4063, 121.2082],
  [13.4056, 121.2088],  // Sta. Isabel area
  [13.4048, 121.2098],
  [13.4038, 121.2110],
  // Past Silonay, road starts curving south
  [13.4028, 121.2122],
  [13.4020, 121.2138],
  [13.4015, 121.2152],
  [13.4008, 121.2168],
  [13.4000, 121.2185],
  [13.3993, 121.2200],
  [13.3988, 121.2220],  // Malad area
  [13.3978, 121.2235],
  [13.3968, 121.2250],
  // Road continues curving southeast through Palhi area
  [13.3955, 121.2268],
  [13.3942, 121.2282],
  [13.3930, 121.2295],
  [13.3918, 121.2310],
  [13.3905, 121.2325],
  [13.3890, 121.2340],
  [13.3875, 121.2355],
  [13.3860, 121.2370],
  [13.3845, 121.2388],
  [13.3835, 121.2405],
  [13.3825, 121.2425],  // Bucayao area
  // Continuing southeast through Sapul
  [13.3810, 121.2440],
  [13.3795, 121.2455],
  [13.3780, 121.2470],
  [13.3760, 121.2488],
  [13.3740, 121.2505],
  [13.3720, 121.2520],
  // Through Gutad area
  [13.3700, 121.2538],
  [13.3680, 121.2550],
  [13.3660, 121.2565],
  [13.3640, 121.2575],
  [13.3625, 121.2580],  // Tamaraw area
  [13.3608, 121.2592],
  [13.3590, 121.2605],
  [13.3575, 121.2618],
  // Approaching Nag-iba
  [13.3555, 121.2635],
  [13.3535, 121.2650],
  [13.3520, 121.2662],
  [13.3505, 121.2675],
  [13.3490, 121.2690],
  [13.3475, 121.2705],
  [13.3460, 121.2720],  // Kurba-Naujan
  // Past Nag-iba I & II
  [13.3445, 121.2735],
  [13.3430, 121.2750],
  [13.3415, 121.2768],
  [13.3400, 121.2785],
  [13.3388, 121.2800],
  [13.3375, 121.2815],
  [13.3362, 121.2830],
  [13.3350, 121.2850],  // Santiago
  // Bacungan to Naujan
  [13.3338, 121.2868],
  [13.3325, 121.2888],
  [13.3315, 121.2905],
  [13.3305, 121.2920],
  [13.3295, 121.2938],
  [13.3285, 121.2955],
  [13.3275, 121.2972],
  [13.3265, 121.2990],
  [13.3258, 121.3008],
  [13.3249, 121.3030],  // Naujan Town Proper
];

// ─── Tricycle Fare Constants ──────────────────────────────────

const TRICYCLE_BASE_FARE = 15.00;
const TRICYCLE_BASE_KM = 2.0;
const TRICYCLE_PER_KM = 3.00;
const TRICYCLE_DISCOUNT_PERCENT = 20;

// ─── Utility Functions ───────────────────────────────────────

/** Haversine distance in km */
export function haversineKm(
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

/**
 * Find the nearest jeepney stop to a given lat/lng.
 * Returns the stop and the straight-line distance to it.
 */
export function findNearestStop(
  lat: number, lng: number
): { stop: JeepneyStop; distanceKm: number } {
  let nearest = JEEPNEY_STOPS[0];
  let minDist = Infinity;

  for (const stop of JEEPNEY_STOPS) {
    const d = haversineKm(lat, lng, stop.latitude, stop.longitude);
    if (d < minDist) {
      minDist = d;
      nearest = stop;
    }
  }

  return { stop: nearest, distanceKm: minDist };
}

/**
 * Find the nearest jeepney stop to the user's current location (boarding point).
 */
export function findBoardingStop(
  userLat: number, userLng: number
): { stop: JeepneyStop; distanceKm: number } {
  return findNearestStop(userLat, userLng);
}

/**
 * Calculate tricycle fare for a given distance in km.
 */
export function calculateTricycleFare(distanceKm: number): {
  regular: number;
  discounted: number;
} {
  if (distanceKm <= 0) return { regular: 0, discounted: 0 };

  let fare: number;
  if (distanceKm <= TRICYCLE_BASE_KM) {
    fare = TRICYCLE_BASE_FARE;
  } else {
    const extraKm = distanceKm - TRICYCLE_BASE_KM;
    fare = TRICYCLE_BASE_FARE + extraKm * TRICYCLE_PER_KM;
  }

  const discounted = fare * (1 - TRICYCLE_DISCOUNT_PERCENT / 100);

  return {
    regular: Math.round(fare * 100) / 100,
    discounted: Math.round(discounted * 100) / 100,
  };
}

/**
 * Calculate the jeepney fare between two stops (by km markers).
 * Uses the official fare table if boarding from Calapan Pier (km=0).
 * Otherwise interpolates from the per-km rate.
 */
export function calculateJeepneyFareBetweenStops(
  boardingStop: JeepneyStop,
  dropoffStop: JeepneyStop
): { regular: number; discounted: number } {
  // Same stop or backwards direction
  if (boardingStop.km >= dropoffStop.km) {
    return { regular: 0, discounted: 0 };
  }

  // If boarding from Calapan Pier, use official fares directly
  if (boardingStop.km === 0) {
    return {
      regular: dropoffStop.regularFare,
      discounted: dropoffStop.discountedFare,
    };
  }

  // Otherwise, compute fare difference between the two stops
  const regular = Math.max(0, dropoffStop.regularFare - boardingStop.regularFare);
  const discounted = Math.max(0, dropoffStop.discountedFare - boardingStop.discountedFare);

  return {
    regular: Math.round(regular * 100) / 100,
    discounted: Math.round(discounted * 100) / 100,
  };
}

// ─── Combined Fare Calculation ───────────────────────────────

export interface CombinedFareResult {
  /** Nearest jeepney stop to the user (boarding) */
  boardingStop: JeepneyStop;
  /** Distance from user to boarding stop (km) */
  boardingTricycleDistKm: number;
  /** Tricycle fare to reach boarding stop (if user is not on highway) */
  boardingTricycleFare: { regular: number; discounted: number };

  /** Nearest jeepney stop to the destination (drop-off) */
  dropoffStop: JeepneyStop;
  /** Jeepney fare from boarding to drop-off */
  jeepneyFare: { regular: number; discounted: number };

  /** Distance from drop-off stop to destination (km) */
  lastMileDistKm: number;
  /** Tricycle fare from drop-off stop to destination */
  lastMileTricycleFare: { regular: number; discounted: number };

  /** Total combined fare */
  totalFare: { regular: number; discounted: number };

  /** Whether the destination is close enough to a jeepney stop to walk */
  destinationOnHighway: boolean;
  /** Whether the user is close enough to a jeepney stop to walk */
  userOnHighway: boolean;
}

/** Threshold: if within 0.5 km of a jeepney stop, consider it "on the highway" (walkable) */
const HIGHWAY_PROXIMITY_KM = 0.5;

/**
 * Calculate the full combined fare for a trip from user location to destination.
 * Handles: tricycle to boarding stop → jeepney along highway → tricycle to destination.
 */
export function calculateCombinedFare(
  userLat: number, userLng: number,
  destLat: number, destLng: number
): CombinedFareResult {
  // Find nearest stops
  const boarding = findNearestStop(userLat, userLng);
  const dropoff = findNearestStop(destLat, destLng);

  const userOnHighway = boarding.distanceKm <= HIGHWAY_PROXIMITY_KM;
  const destinationOnHighway = dropoff.distanceKm <= HIGHWAY_PROXIMITY_KM;

  // Boarding tricycle fare (user → nearest jeepney stop)
  const boardingTricycleFare = userOnHighway
    ? { regular: 0, discounted: 0 }
    : calculateTricycleFare(boarding.distanceKm);

  // Jeepney fare along highway
  const jeepneyFare = calculateJeepneyFareBetweenStops(boarding.stop, dropoff.stop);

  // Last-mile tricycle fare (jeepney stop → destination)
  const lastMileTricycleFare = destinationOnHighway
    ? { regular: 0, discounted: 0 }
    : calculateTricycleFare(dropoff.distanceKm);

  // Total
  const totalRegular = boardingTricycleFare.regular + jeepneyFare.regular + lastMileTricycleFare.regular;
  const totalDiscounted = boardingTricycleFare.discounted + jeepneyFare.discounted + lastMileTricycleFare.discounted;

  return {
    boardingStop: boarding.stop,
    boardingTricycleDistKm: boarding.distanceKm,
    boardingTricycleFare,
    dropoffStop: dropoff.stop,
    jeepneyFare,
    lastMileDistKm: dropoff.distanceKm,
    lastMileTricycleFare,
    totalFare: {
      regular: Math.round(totalRegular * 100) / 100,
      discounted: Math.round(totalDiscounted * 100) / 100,
    },
    destinationOnHighway,
    userOnHighway,
  };
}
