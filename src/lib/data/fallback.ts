// Fallback data for when Supabase is not configured or offline
// This ensures the app works even without database connectivity

import type { Attraction, Route, TransportMatrix, EmergencyContact } from '@/lib/types/database';
import { NAUJAN_ATTRACTIONS, type TrailAttraction } from '@/data/naujanTrailData';

const TRAIL_MAP: Record<string, TrailAttraction> = {
  'naujan-lake-boardwalk-bicycle-lane': NAUJAN_ATTRACTIONS[0],
  'naujan-lake-boardwalk': NAUJAN_ATTRACTIONS[0],
  'naujan-town-plaza': NAUJAN_ATTRACTIONS[1],
  '333-steps': NAUJAN_ATTRACTIONS[2],
  'simbahang-bato': NAUJAN_ATTRACTIONS[3],
  'malinao-beach-resort': NAUJAN_ATTRACTIONS[4],
  'macapili-beach': NAUJAN_ATTRACTIONS[5],
  'arangin-falls': NAUJAN_ATTRACTIONS[6],
  'pungao-hot-spring-montelago-hot-spring': NAUJAN_ATTRACTIONS[7],
  'montelago-hot-spring': NAUJAN_ATTRACTIONS[7],
  'karacha-falls': NAUJAN_ATTRACTIONS[8],
  'dao-water-lily-mini-park': NAUJAN_ATTRACTIONS[9],
  'paitan-river': NAUJAN_ATTRACTIONS[10],
};

export function enrichWithTrailData(attraction: Attraction): Attraction {
  const trail =
    TRAIL_MAP[attraction.slug] ||
    TRAIL_MAP[attraction.id] ||
    NAUJAN_ATTRACTIONS.find((t) => t.name.toLowerCase() === attraction.name.toLowerCase());

  if (!trail) return attraction;

  return {
    ...attraction,
    activities:
      attraction.activities && (attraction.activities as any[]).length > 0
        ? (attraction.activities as string[])
        : trail.activities,
    activitiesSummary: attraction.activitiesSummary || trail.activitiesSummary,
    nawiReminder: attraction.nawiReminder || trail.nawiReminder,
    publishedLocation: attraction.publishedLocation || trail.publishedLocation,
    publishedContact: attraction.publishedContact || trail.publishedContact,
    admissionStatus: attraction.admissionStatus || trail.admissionStatus,
    visitorInfo: attraction.visitorInfo || trail.visitorInfo,
    sourceUrl: attraction.sourceUrl || trail.sourceUrl,
    sourceLabel: attraction.sourceLabel || trail.sourceLabel,
    requiresVerification:
      attraction.requiresVerification !== undefined
        ? attraction.requiresVerification
        : trail.requiresVerification,
    verificationNote: attraction.verificationNote || trail.verificationNote,
    nawiPose: attraction.nawiPose || trail.nawiPose,
  };
}

const RAW_ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    name: 'Largo Castillo Farm Resort',
    slug: 'largo-castillo-farm-resort',
    category: 'resort',
    description: 'A farm resort in Barangay Estrella blending agriculture and leisure, offering a unique countryside retreat experience.',
    latitude: 13.326464254071587,
    longitude: 121.31453888903856,
    barangay: 'Estrella',
    entrance_fee: 'Varies',
    opening_hours: '6:00 AM – 6:00 PM',
    contact_number: null,
    cover_image: '/images/Largo Castillo Farm Resort.jpg',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Naujan Lake Boardwalk and Bicycle Lane',
    slug: 'naujan-lake-boardwalk-bicycle-lane',
    category: 'lake',
    description: 'A scenic boardwalk and bicycle lane along the shores of Naujan Lake in Barangay Montelago. Perfect for leisurely walks, cycling, and enjoying panoramic lake views.',
    latitude: 13.118932070258642,
    longitude: 121.34633485584389,
    barangay: 'Montelago',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/Naujan Lake Boardwalk and Bicycle Lane.jpg',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Naujan Town Plaza',
    slug: 'naujan-town-plaza',
    category: 'park',
    description: 'The central town plaza of Naujan located in Barangay Poblacion I. A gathering place for locals and visitors, surrounded by municipal landmarks.',
    latitude: 13.324865482056648,
    longitude: 121.30296224810526,
    barangay: 'Poblacion I',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/Naujan Town Plaza.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Pungao Hot Spring / Montelago Hot Spring',
    slug: 'pungao-hot-spring-montelago-hot-spring',
    category: 'hot-springs',
    description: 'A natural volcanic hot spring in Barangay Montelago near the shores of Naujan Lake. Known for therapeutic mineral-rich waters at 38–42°C, surrounded by hills with igneous rock formations.',
    latitude: 13.222529608771133,
    longitude: 121.3758642557758,
    barangay: 'Montelago',
    entrance_fee: '₱50 per person',
    opening_hours: '6:00 AM – 6:00 PM',
    contact_number: null,
    cover_image: '/images/Montelago Hot Spring.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Macapili Beach',
    slug: 'macapili-beach',
    category: 'beach',
    description: 'A serene beach in Barangay Macapili offering a quiet escape with natural coastal beauty and calm waters.',
    latitude: 13.249590181773444,
    longitude: 121.37878055577632,
    barangay: 'Macapili',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/Macapili Beach.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Malinao Beach Resort',
    slug: 'malinao-beach-resort',
    category: 'resort',
    description: 'A beachside resort in Barangay Sta. Cruz with accommodations, swimming areas, and a relaxing tropical atmosphere.',
    latitude: 13.316395711828727,
    longitude: 121.32402039757034,
    barangay: 'Sta. Cruz',
    entrance_fee: 'Varies',
    opening_hours: '6:00 AM – 6:00 PM',
    contact_number: null,
    cover_image: '/images/Malinao Beach Resort.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Simbahang Bato',
    slug: 'simbahang-bato',
    category: 'heritage',
    description: 'A 17th-century stone church ruins built by Augustinian missionaries in Barangay Bancuro. Known as the "church within a church" — a modern chapel now stands inside the original roofless stone ruins.',
    latitude: 13.28132830584094,
    longitude: 121.3217375655667,
    barangay: 'Bancuro',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/Simbahang Bato.jpg',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Montelago Hot Spring',
    slug: 'montelago-hot-spring',
    category: 'hot-springs',
    description: 'A natural hot spring in Barangay Montelago with warm, mineral-rich waters ideal for relaxation and therapeutic bathing.',
    latitude: 13.222529608771133,
    longitude: 121.3758642557758,
    barangay: 'Montelago',
    entrance_fee: '₱50 per person',
    opening_hours: '6:00 AM – 6:00 PM',
    contact_number: null,
    cover_image: '/images/Montelago Hot Spring.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Arangin Falls',
    slug: 'arangin-falls',
    category: 'waterfall',
    description: 'A stunning multi-tiered waterfall in Barangay Arangin with crystal-clear waters cascading over moss-covered rocks into natural swimming pools.',
    latitude: 13.22440188497092,
    longitude: 121.09786258090969,
    barangay: 'Arangin',
    entrance_fee: '₱20 per person',
    opening_hours: '7:00 AM – 4:00 PM',
    contact_number: null,
    cover_image: '/images/Arangin Falls.jpg',
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: '333 Steps',
    slug: '333-steps',
    category: 'viewpoint',
    description: 'A scenic stairway attraction in Barangay Melgar A with 333 steps leading to elevated views. A popular spot for exercise and sightseeing.',
    latitude: 13.275281445619239,
    longitude: 121.35573258091017,
    barangay: 'Melgar A',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/333 Steps.webp',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Karacha Falls',
    slug: 'karacha-falls',
    category: 'waterfall',
    description: 'A hidden gem waterfall in Barangay Malvar surrounded by dense tropical vegetation. The deep natural pool at the base is refreshingly cold and perfect for swimming.',
    latitude: 13.198452532068051,
    longitude: 121.11373513826909,
    barangay: 'Malvar',
    entrance_fee: '₱15 per person',
    opening_hours: '7:00 AM – 4:00 PM',
    contact_number: null,
    cover_image: '/images/Karacha Falls.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Dao Water Lily Mini Park',
    slug: 'dao-water-lily-mini-park',
    category: 'park',
    description: 'A charming mini park in Barangay Dao featuring water lilies and a tranquil pond setting. A peaceful spot for relaxation and photography.',
    latitude: 13.256973784289269,
    longitude: 121.31947659071159,
    barangay: 'Dao',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/Dao Water Lily Mini Park.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Paitan River',
    slug: 'paitan-river',
    category: 'river',
    description: 'A scenic river in Barangay Paitan offering beautiful natural surroundings, perfect for nature walks, fishing, and riverside relaxation.',
    latitude: 13.185967954796245,
    longitude: 121.08376426749784,
    barangay: 'Paitan',
    entrance_fee: 'Free',
    opening_hours: 'Open 24 hours',
    contact_number: null,
    cover_image: '/images/Paitan River.jpg',
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_ATTRACTIONS: Attraction[] = RAW_ATTRACTIONS.map(enrichWithTrailData);

export const FALLBACK_ROUTES: Route[] = [
  {
    id: '1',
    title: 'Naujan Heritage & Nature Loop',
    description: 'A full-day loop visiting Bancuro Church ruins, Naujan Lake, and Montelago Hot Spring.',
    route_type: 'suggested_loop',
    distance_km: 42.5,
    estimated_time_mins: 180,
    road_condition: 'mixed',
    geojson_data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'Heritage & Nature Loop', color: '#0F766E' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [121.30296, 13.32487], [121.32174, 13.28133], [121.33000, 13.27000],
            [121.34633, 13.11893], [121.37586, 13.22253], [121.35000, 13.27000],
            [121.30296, 13.32487]
          ]
        }
      }]
    },
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Waterfall Trail Route',
    description: 'An adventure route connecting Arangin Falls, Karacha Falls, and Paitan River Falls.',
    route_type: 'suggested_loop',
    distance_km: 35.0,
    estimated_time_mins: 210,
    road_condition: 'rough',
    geojson_data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'Waterfall Trail', color: '#0EA5E9' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [121.30296, 13.32487], [121.09786, 13.22440],
            [121.11374, 13.19845], [121.08376, 13.18597],
            [121.30296, 13.32487]
          ]
        }
      }]
    },
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Calapan–Naujan Express',
    description: 'Direct route from Calapan City to Naujan Poblacion via the national highway.',
    route_type: 'alternative',
    distance_km: 18.0,
    estimated_time_mins: 45,
    road_condition: 'paved',
    geojson_data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'Calapan-Naujan Express', color: '#F59E0B' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [121.1767, 13.4117], [121.2100, 13.3900],
            [121.2400, 13.3600], [121.2700, 13.3400],
            [121.30296, 13.32487]
          ]
        }
      }]
    },
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Lakeside Shortcut to Montelago',
    description: 'Shortcut from Poblacion to Montelago and hot springs. Unpaved but scenic.',
    route_type: 'shortcut',
    distance_km: 12.0,
    estimated_time_mins: 30,
    road_condition: 'unpaved',
    geojson_data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'Lakeside Shortcut', color: '#8B5CF6' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [121.30296, 13.32487], [121.31948, 13.25697],
            [121.35573, 13.27528], [121.37586, 13.22253]
          ]
        }
      }]
    },
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Butas River to Lake Gateway',
    description: 'Scenic route following the Butas River from coast to Naujan Lake. Combines boat and land travel.',
    route_type: 'alternative',
    distance_km: 15.0,
    estimated_time_mins: 60,
    road_condition: 'mixed',
    geojson_data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'River Gateway', color: '#EC4899' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [121.2900, 13.3400], [121.2950, 13.3350],
            [121.3200, 13.2500], [121.34633, 13.11893]
          ]
        }
      }]
    },
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_TRANSPORT: TransportMatrix[] = [
  {
    id: '1',
    vehicle_type: 'tricycle',
    base_fare: 15.00,
    base_km: 2.0,
    per_km_rate: 3.00,
    special_trip_rate: 0,
    notes: 'Zonal fare per Pambayang Ordinansa BLG. 151 (2023). Base fare covers first 2 km. Applies within Poblacion and Curva zones. Senior/PWD/Student discount: 20% off.',
    discount_percent: 20,
    fare_source: 'Pambayang Ordinansa BLG. 151, Bayan ng Naujan, 2023',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    vehicle_type: 'jeepney',
    base_fare: 12.00,
    base_km: 4.0,
    per_km_rate: 1.80,
    special_trip_rate: 0,
    notes: 'Calapan City Pier – Naujan (TP) route, 34 km. Fares rounded to nearest ₱0.25. Senior/PWD/Student discount: 20% off (first 4 km = ₱9.60, then ₱1.44/km).',
    discount_percent: 20,
    fare_source: 'LTFRB Fare Guide, Plate No. DVE 328, effective October 3, 2022',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    vehicle_type: 'boat',
    base_fare: 200.00,
    base_km: 0.0,
    per_km_rate: 0.00,
    special_trip_rate: 500.00,
    notes: 'Lake Naujan bangka boat rental. Base fare for standard tour (up to 4 pax, ~1 hour). Special rate for extended tour.',
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_EMERGENCY: EmergencyContact[] = [
  {
    id: '1',
    organization_name: 'MDRRMO Naujan (Disaster Risk Reduction)',
    category: 'disaster',
    phone_number: '(043) 442-0165',
    address: 'Municipal Hall, Poblacion I, Naujan',
    latitude: 13.3250,
    longitude: 121.2930,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    organization_name: 'PNP Naujan Municipal Police Station',
    category: 'police',
    phone_number: '(043) 442-0030',
    address: 'Poblacion II, Naujan',
    latitude: 13.3248,
    longitude: 121.2935,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    organization_name: 'Naujan Municipal Hospital',
    category: 'medical',
    phone_number: '(043) 442-0121',
    address: 'Poblacion I, Naujan',
    latitude: 13.3255,
    longitude: 121.2925,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    organization_name: 'Bureau of Fire Protection – Naujan',
    category: 'fire',
    phone_number: '(043) 442-0117',
    address: 'Poblacion I, Naujan',
    latitude: 13.3252,
    longitude: 121.2928,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    organization_name: 'Naujan Municipal Tourism Office',
    category: 'tourism',
    phone_number: '(043) 442-0100',
    address: 'Municipal Hall, Poblacion I, Naujan',
    latitude: 13.3250,
    longitude: 121.2930,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    organization_name: 'Philippine Red Cross – Oriental Mindoro',
    category: 'medical',
    phone_number: '(043) 288-5303',
    address: 'Calapan City, Oriental Mindoro',
    latitude: 13.4117,
    longitude: 121.1767,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    organization_name: 'Philippine Coast Guard – Calapan',
    category: 'disaster',
    phone_number: '(043) 288-1090',
    address: 'Port of Calapan, Calapan City',
    latitude: 13.4120,
    longitude: 121.1770,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    organization_name: 'National Emergency Hotline',
    category: 'disaster',
    phone_number: '911',
    address: 'National hotline – available nationwide',
    latitude: null,
    longitude: null,
    created_at: new Date().toISOString(),
  },
];
