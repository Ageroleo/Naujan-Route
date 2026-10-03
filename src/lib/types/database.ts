// TypeScript interfaces matching the Naujan Route database schema

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  description: string | null;
  latitude: number;
  longitude: number;
  barangay: string | null;
  entrance_fee: string;
  opening_hours: string;
  contact_number: string | null;
  cover_image: string | null;
  is_featured: boolean;
  created_at: string;
  activities?: Activity[];
  photos?: Photo[];
}

export type AttractionCategory =
  | 'nature'
  | 'heritage'
  | 'adventure'
  | 'hot-springs'
  | 'waterfall'
  | 'lake'
  | 'river'
  | 'resort'
  | 'viewpoint'
  | 'beach'
  | 'park';

export interface Activity {
  id: string;
  attraction_id: string;
  name: string;
  description: string | null;
  cost: string;
  duration_mins: number | null;
}

export interface Photo {
  id: string;
  attraction_id: string;
  image_url: string;
  caption: string | null;
}

export interface Route {
  id: string;
  title: string;
  description: string | null;
  route_type: RouteType;
  distance_km: number | null;
  estimated_time_mins: number | null;
  road_condition: RoadCondition | null;
  geojson_data: GeoJSONFeatureCollection | null;
  created_at: string;
}

export type RouteType = 'suggested_loop' | 'shortcut' | 'alternative';
export type RoadCondition = 'paved' | 'unpaved' | 'rough' | 'mixed';

export interface TransportMatrix {
  id: string;
  vehicle_type: VehicleType;
  base_fare: number;
  base_km: number;
  per_km_rate: number;
  special_trip_rate: number;
  notes: string | null;
  /** 20% discount for Student/Elderly/Disabled — optional, defaults to 0 */
  discount_percent?: number;
  /** Official source citation, e.g. "LTFRB Fare Guide, Oct 2022" */
  fare_source?: string | null;
  created_at: string;
}

export type VehicleType = 'tricycle' | 'jeepney' | 'boat';

export interface EmergencyContact {
  id: string;
  organization_name: string;
  category: EmergencyCategory;
  phone_number: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export type EmergencyCategory = 'disaster' | 'police' | 'medical' | 'fire' | 'government' | 'tourism';

// GeoJSON types
export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: {
    type: 'LineString' | 'Point' | 'Polygon';
    coordinates: number[][] | number[];
  };
}

// Category metadata for UI
export const CATEGORY_CONFIG: Record<AttractionCategory, { label: string; emoji: string; color: string }> = {
  nature: { label: 'Nature', emoji: '🌿', color: '#22C55E' },
  heritage: { label: 'Heritage', emoji: '🏛️', color: '#F59E0B' },
  adventure: { label: 'Adventure', emoji: '🧗', color: '#EF4444' },
  'hot-springs': { label: 'Hot Springs', emoji: '♨️', color: '#F97316' },
  waterfall: { label: 'Waterfall', emoji: '💧', color: '#3B82F6' },
  lake: { label: 'Lake', emoji: '🏞️', color: '#06B6D4' },
  river: { label: 'River', emoji: '🌊', color: '#0EA5E9' },
  resort: { label: 'Resort', emoji: '🏖️', color: '#EC4899' },
  viewpoint: { label: 'Viewpoint', emoji: '🔭', color: '#8B5CF6' },
  beach: { label: 'Beach', emoji: '🏝️', color: '#38BDF8' },
  park: { label: 'Park', emoji: '🌳', color: '#10B981' },
};

export const VEHICLE_CONFIG: Record<VehicleType, { label: string; emoji: string; icon: string }> = {
  tricycle: { label: 'Tricycle', emoji: '🛺', icon: 'bike' },
  jeepney: { label: 'Jeepney', emoji: '🚐', icon: 'bus' },
  boat: { label: 'Boat', emoji: '⛵', icon: 'ship' },
};

export const EMERGENCY_CONFIG: Record<EmergencyCategory, { label: string; emoji: string; color: string }> = {
  disaster: { label: 'Disaster Response', emoji: '🆘', color: '#EF4444' },
  police: { label: 'Police', emoji: '👮', color: '#3B82F6' },
  medical: { label: 'Medical', emoji: '🏥', color: '#22C55E' },
  fire: { label: 'Fire', emoji: '🚒', color: '#F97316' },
  government: { label: 'Government', emoji: '🏛️', color: '#8B5CF6' },
  tourism: { label: 'Tourism', emoji: '🗺️', color: '#0EA5E9' },
};

export const ROUTE_TYPE_CONFIG: Record<RouteType, { label: string; emoji: string; color: string }> = {
  suggested_loop: { label: 'Suggested Loop', emoji: '🔄', color: '#0F766E' },
  shortcut: { label: 'Shortcut', emoji: '⚡', color: '#8B5CF6' },
  alternative: { label: 'Alternative', emoji: '🔀', color: '#F59E0B' },
};

export const ROAD_CONDITION_CONFIG: Record<RoadCondition, { label: string; emoji: string }> = {
  paved: { label: 'Paved Road', emoji: '🛣️' },
  unpaved: { label: 'Unpaved Road', emoji: '🏔️' },
  rough: { label: 'Rough Terrain', emoji: '⚠️' },
  mixed: { label: 'Mixed Road', emoji: '🔀' },
};
