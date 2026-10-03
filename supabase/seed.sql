-- ============================================================
-- Naujan Route — Seed Data
-- Authentic data for the Municipality of Naujan, Oriental Mindoro
-- ============================================================

-- ============================================================
-- ATTRACTIONS
-- ============================================================
INSERT INTO attractions (name, slug, category, description, latitude, longitude, barangay, entrance_fee, opening_hours, cover_image, is_featured) VALUES
(
  'Emerald Isle Beach Resort',
  'emerald-isle-beach-resort',
  'resort',
  'A popular beach resort in Barangay Estrella, offering scenic coastal views, swimming areas, and relaxation by the shore.',
  13.2100, 121.3400,
  'Estrella',
  'Varies',
  '6:00 AM – 6:00 PM',
  '/images/emerald-isle.jpg',
  true
),
(
  'Hafa Adai',
  'hafa-adai',
  'resort',
  'A relaxing resort destination in Barangay Estrella, known for its welcoming atmosphere and beachfront amenities.',
  13.2110, 121.3410,
  'Estrella',
  'Varies',
  '6:00 AM – 6:00 PM',
  '/images/hafa-adai.jpg',
  true
),
(
  'Largo Castillo Farm Resort',
  'largo-castillo-farm-resort',
  'resort',
  'A farm resort in Barangay Estrella blending agriculture and leisure, offering a unique countryside retreat experience.',
  13.2120, 121.3420,
  'Estrella',
  'Varies',
  '6:00 AM – 6:00 PM',
  '/images/Largo Castillo Farm Resort.jpg',
  true
),
(
  'Naujan Lake Boardwalk and Bicycle Lane',
  'naujan-lake-boardwalk-bicycle-lane',
  'lake',
  'A scenic boardwalk and bicycle lane along the shores of Naujan Lake in Barangay Montelago. Perfect for leisurely walks, cycling, and enjoying panoramic lake views.',
  13.118932070258642, 121.34633485584389,
  'Montelago',
  'Free',
  'Open 24 hours',
  '/images/Naujan Lake Boardwalk and Bicycle Lane.jpg',
  true
),
(
  'Naujan Town Plaza',
  'naujan-town-plaza',
  'park',
  'The central town plaza of Naujan located in Barangay Poblacion I. A gathering place for locals and visitors, surrounded by municipal landmarks.',
  13.324865482056648, 121.30296224810526,
  'Poblacion I',
  'Free',
  'Open 24 hours',
  '/images/Naujan Town Plaza.jpg',
  false
),
(
  'Pungao Hot Spring / Montelago Hot Spring',
  'pungao-hot-spring-montelago-hot-spring',
  'hot-springs',
  'A natural volcanic hot spring in Barangay Montelago near the shores of Naujan Lake. Known for therapeutic mineral-rich waters at 38–42°C, surrounded by hills with igneous rock formations.',
  13.222529608771133, 121.3758642557758,
  'Montelago',
  '₱50 per person',
  '6:00 AM – 6:00 PM',
  '/images/Montelago Hot Spring.jpg',
  false
),
(
  'Macapili Beach',
  'macapili-beach',
  'beach',
  'A serene beach in Barangay Macapili offering a quiet escape with natural coastal beauty and calm waters.',
  13.249590181773444, 121.37878055577632,
  'Macapili',
  'Free',
  'Open 24 hours',
  '/images/Macapili Beach.jpg',
  false
),
(
  'Malinao Beach Resort',
  'malinao-beach-resort',
  'resort',
  'A beachside resort in Barangay Santa Cruz with accommodations, swimming areas, and a relaxing tropical atmosphere.',
  13.316395711828727, 121.32402039757034,
  'Santa Cruz',
  'Varies',
  '6:00 AM – 6:00 PM',
  '/images/Malinao Beach Resort.jpg',
  false
),
(
  'Corralmo Falls',
  'corralmo-falls',
  'waterfall',
  'A beautiful waterfall located in Barangay Metolza, offering a refreshing cascade surrounded by lush tropical greenery. A great spot for swimming and nature trekking.',
  13.206312675570643, 121.05254959689358,
  'Metolza',
  '₱20 per person',
  '7:00 AM – 4:00 PM',
  '/images/corralmo-falls.jpg',
  false
),
(
  'Naujan Park',
  'naujan-park',
  'park',
  'A public park in Barangay Poblacion I, perfect for family outings, picnics, and recreational activities in the heart of Naujan.',
  13.3244, 121.3020,
  'Poblacion I',
  'Free',
  'Open 24 hours',
  '/images/naujan-park.jpg',
  false
),
(
  'Matabang Bundok Park',
  'matabang-bundok-park',
  'park',
  'A hilltop park in Barangay Montemayor offering elevated views of the surrounding landscape. Ideal for hiking and scenic viewpoints.',
  13.2424012581883, 121.39505224228363,
  'Montemayor',
  'Free',
  'Open 24 hours',
  '/images/matabang-bundok.jpg',
  false
),
(
  'Simbahang Bato',
  'simbahang-bato',
  'heritage',
  'A 17th-century stone church ruins built by Augustinian missionaries in Barangay Bancuro. Known as the "church within a church" — a modern chapel now stands inside the original roofless stone ruins.',
  13.28132830584094, 121.3217375655667,
  'Bancuro',
  'Free',
  'Open 24 hours',
  '/images/Simbahang Bato.jpg',
  true
),
(
  'Montelago Hot Spring',
  'montelago-hot-spring',
  'hot-springs',
  'A natural hot spring in Barangay Montelago with warm, mineral-rich waters ideal for relaxation and therapeutic bathing.',
  13.222529608771133, 121.3758642557758,
  'Montelago',
  '₱50 per person',
  '6:00 AM – 6:00 PM',
  '/images/Montelago Hot Spring.jpg',
  false
),
(
  'Arangin Falls',
  'arangin-falls',
  'waterfall',
  'A stunning multi-tiered waterfall in Barangay Arangin with crystal-clear waters cascading over moss-covered rocks into natural swimming pools.',
  13.22440188497092, 121.09786258090969,
  'Arangin',
  '₱20 per person',
  '7:00 AM – 4:00 PM',
  '/images/Arangin Falls.jpg',
  true
),
(
  '333 Steps',
  '333-steps',
  'viewpoint',
  'A scenic stairway attraction in Barangay Melgar A with 333 steps leading to elevated views. A popular spot for exercise and sightseeing.',
  13.275281445619239, 121.35573258091017,
  'Melgar A',
  'Free',
  'Open 24 hours',
  '/images/333 Steps.webp',
  false
),
(
  'Karacha Falls',
  'karacha-falls',
  'waterfall',
  'A hidden gem waterfall in Barangay Malvar surrounded by dense tropical vegetation. The deep natural pool at the base is refreshingly cold and perfect for swimming.',
  13.198452532068051, 121.11373513826909,
  'Malvar',
  '₱15 per person',
  '7:00 AM – 4:00 PM',
  '/images/Karacha Falls.jpg',
  false
),
(
  'Dao Water Lily Mini Park',
  'dao-water-lily-mini-park',
  'park',
  'A charming mini park in Barangay Dao featuring water lilies and a tranquil pond setting. A peaceful spot for relaxation and photography.',
  13.256973784289269, 121.31947659071159,
  'Dao',
  'Free',
  'Open 24 hours',
  '/images/Dao Water Lily Mini Park.jpg',
  false
),
(
  'Paitan River',
  'paitan-river',
  'river',
  'A scenic river in Barangay Paitan offering beautiful natural surroundings, perfect for nature walks, fishing, and riverside relaxation.',
  13.185967954796245, 121.08376426749784,
  'Paitan',
  'Free',
  'Open 24 hours',
  '/images/Paitan River.jpg',
  false
);

-- ============================================================
-- ACTIVITIES
-- ============================================================
INSERT INTO activities (attraction_id, name, description, cost, duration_mins) VALUES
-- Simbahang Bato
((SELECT id FROM attractions WHERE slug = 'simbahang-bato'), 'Heritage Tour', 'Walk through the 17th-century stone ruins with a local guide who shares the rich history of the Augustinian mission.', '₱50 donation suggested', 45),
((SELECT id FROM attractions WHERE slug = 'simbahang-bato'), 'Photography', 'The ruins offer dramatic lighting and textures perfect for portrait and architectural photography.', 'Free', 30),

-- Montelago Hot Spring
((SELECT id FROM attractions WHERE slug = 'montelago-hot-spring'), 'Hot Spring Bathing', 'Soak in the naturally heated mineral waters for relaxation and therapeutic benefits.', 'Included in entrance fee', 60),
((SELECT id FROM attractions WHERE slug = 'montelago-hot-spring'), 'Picnicking', 'Enjoy a packed meal or locally prepared food in the shaded picnic area beside the springs.', '₱50 cottage rental', 90),

-- Arangin Falls
((SELECT id FROM attractions WHERE slug = 'arangin-falls'), 'Swimming', 'Cool off in the natural rock pools beneath the falls.', 'Free (with entrance fee)', 60),
((SELECT id FROM attractions WHERE slug = 'arangin-falls'), 'Trekking', 'Hike through tropical forest trails to reach the falls. Moderate difficulty, sturdy footwear recommended.', 'Free', 45),
((SELECT id FROM attractions WHERE slug = 'arangin-falls'), 'Cliff Jumping', 'For the adventurous — jump from designated rock ledges into the deep pool below.', 'Free', 15),

-- Corralmo Falls
((SELECT id FROM attractions WHERE slug = 'corralmo-falls'), 'Swimming', 'Take a refreshing swim in the natural pool at the base of the falls.', 'Free (with entrance fee)', 60),
((SELECT id FROM attractions WHERE slug = 'corralmo-falls'), 'Nature Trekking', 'Hike through lush tropical greenery to reach the falls.', 'Free', 45),

-- Karacha Falls
((SELECT id FROM attractions WHERE slug = 'karacha-falls'), 'Swimming', 'Swim in the deep, refreshingly cold natural pool at the base of the waterfall.', 'Free (with entrance fee)', 60),
((SELECT id FROM attractions WHERE slug = 'karacha-falls'), 'Trekking', 'Hike through farmlands and forest trails to reach this hidden gem.', 'Free', 45),

-- Naujan Lake Boardwalk
((SELECT id FROM attractions WHERE slug = 'naujan-lake-boardwalk-bicycle-lane'), 'Cycling', 'Ride along the dedicated bicycle lane with scenic lake views.', 'Free (bring your own bike)', 60),
((SELECT id FROM attractions WHERE slug = 'naujan-lake-boardwalk-bicycle-lane'), 'Boardwalk Stroll', 'Walk along the boardwalk and enjoy panoramic views of Naujan Lake.', 'Free', 30),

-- 333 Steps
((SELECT id FROM attractions WHERE slug = '333-steps'), 'Stair Climbing', 'Climb the 333 steps for exercise and scenic views from the top.', 'Free', 30),

-- Paitan River
((SELECT id FROM attractions WHERE slug = 'paitan-river'), 'River Walk', 'Enjoy a leisurely walk along the scenic riverside.', 'Free', 45),
((SELECT id FROM attractions WHERE slug = 'paitan-river'), 'Fishing', 'Try freshwater fishing along the river banks.', 'Free', 90);

-- ============================================================
-- ROUTES
-- ============================================================
INSERT INTO routes (title, description, route_type, distance_km, estimated_time_mins, road_condition, geojson_data) VALUES
(
  'Naujan Heritage & Nature Loop',
  'A full-day loop starting from Poblacion, visiting Bancuro Church ruins, then heading to Naujan Lake and returning via Montelago Hot Spring. The most popular tourist route covering the top 3 attractions.',
  'suggested_loop',
  42.5,
  180,
  'mixed',
  '{
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {"name": "Heritage & Nature Loop", "color": "#0F766E"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [121.30296, 13.32487],
          [121.32174, 13.28133],
          [121.33000, 13.27000],
          [121.34633, 13.11893],
          [121.37586, 13.22253],
          [121.35000, 13.27000],
          [121.30296, 13.32487]
        ]
      }
    }]
  }'
),
(
  'Waterfall Trail Route',
  'An adventure route connecting the major waterfalls of Naujan. Start from Poblacion and visit Arangin Falls, then continue to Karacha Falls and Paitan River Falls. Best for adventurous travelers with a full day to spare.',
  'suggested_loop',
  35.0,
  210,
  'rough',
  '{
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {"name": "Waterfall Trail", "color": "#0EA5E9"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [121.30296, 13.32487],
          [121.09786, 13.22440],
          [121.11374, 13.19845],
          [121.08376, 13.18597],
          [121.30296, 13.32487]
        ]
      }
    }]
  }'
),
(
  'Calapan–Naujan Express',
  'The direct route from Calapan City (capital of Oriental Mindoro) to Naujan Poblacion via the national highway. Paved road, jeepney-accessible.',
  'alternative',
  18.0,
  45,
  'paved',
  '{
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {"name": "Calapan-Naujan Express", "color": "#F59E0B"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [121.1767, 13.4117],
          [121.2100, 13.3900],
          [121.2400, 13.3600],
          [121.2700, 13.3400],
          [121.30296, 13.32487]
        ]
      }
    }]
  }'
),
(
  'Lakeside Shortcut to Montelago',
  'A shortcut from Naujan Poblacion directly to Montelago and the hot springs, bypassing the main highway. Unpaved sections but scenic views of farmland and the lake.',
  'shortcut',
  12.0,
  30,
  'unpaved',
  '{
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {"name": "Lakeside Shortcut", "color": "#8B5CF6"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [121.30296, 13.32487],
          [121.31948, 13.25697],
          [121.35573, 13.27528],
          [121.37586, 13.22253]
        ]
      }
    }]
  }'
),
(
  'Butas River to Lake Gateway',
  'An alternative scenic route following the Butas River from the coast to Naujan Lake. Combines boat and land travel for a unique experience.',
  'alternative',
  15.0,
  60,
  'mixed',
  '{
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {"name": "River Gateway", "color": "#EC4899"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [121.2900, 13.3400],
          [121.2950, 13.3350],
          [121.3200, 13.2500],
          [121.34633, 13.11893]
        ]
      }
    }]
  }'
);

-- ============================================================
-- TRANSPORT MATRIX
-- ============================================================
INSERT INTO transport_matrix (vehicle_type, base_fare, base_km, per_km_rate, special_trip_rate, notes) VALUES
('tricycle', 15.00, 2.0, 3.00, 0.00, 'Zonal fare per Pambayang Ordinansa BLG. 151 (2023). Base fare covers first 2 km. Applies within Poblacion and Curva zones. Senior/PWD/Student discount: 20% off.'),
('jeepney', 12.00, 4.0, 1.80, 0.00, 'Calapan City Pier – Naujan (TP) route, 34 km. LTFRB Fare Guide Plate No. DVE 328, effective Oct 3, 2022. Fares rounded to nearest ₱0.25. Senior/PWD/Student: 20% off (first 4 km = ₱9.60, then ₱1.44/km).'),
('boat', 200.00, 0.0, 0.00, 500.00, 'Lake Naujan bangka boat rental. Base fare is for a standard lake tour (up to 4 passengers, ~1 hour). Special trip rate is for extended tour (2-3 hours) or crossing to remote areas of the lake. Price is per boat, not per person.');

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
INSERT INTO emergency_contacts (organization_name, category, phone_number, address, latitude, longitude) VALUES
('MDRRMO Naujan (Disaster Risk Reduction)', 'disaster', '(043) 442-0165', 'Municipal Hall, Poblacion I, Naujan, Oriental Mindoro', 13.3250, 121.2930),
('PNP Naujan Municipal Police Station', 'police', '(043) 442-0030', 'Poblacion II, Naujan, Oriental Mindoro', 13.3248, 121.2935),
('Naujan Municipal Hospital', 'medical', '(043) 442-0121', 'Poblacion I, Naujan, Oriental Mindoro', 13.3255, 121.2925),
('Bureau of Fire Protection – Naujan', 'fire', '(043) 442-0117', 'Poblacion I, Naujan, Oriental Mindoro', 13.3252, 121.2928),
('Naujan Municipal Tourism Office', 'tourism', '(043) 442-0100', 'Municipal Hall, Poblacion I, Naujan, Oriental Mindoro', 13.3250, 121.2930),
('Philippine Red Cross – Oriental Mindoro Chapter', 'medical', '(043) 288-5303', 'Calapan City, Oriental Mindoro (serves Naujan area)', 13.4117, 121.1767),
('Philippine Coast Guard – Calapan', 'disaster', '(043) 288-1090', 'Port of Calapan, Calapan City, Oriental Mindoro', 13.4120, 121.1770),
('National Emergency Hotline', 'disaster', '911', 'National hotline – available nationwide', NULL, NULL);
