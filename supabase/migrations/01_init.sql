-- ============================================================
-- Naujan Route — Database Migration
-- Municipality of Naujan, Oriental Mindoro, Philippines
-- ============================================================

-- Enable PostGIS for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- ATTRACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('nature', 'heritage', 'adventure', 'hot-springs', 'waterfall', 'lake', 'river', 'resort', 'viewpoint', 'beach', 'park')),
  description TEXT,
  coordinates GEOMETRY(Point, 4326),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  barangay TEXT,
  entrance_fee TEXT DEFAULT 'Free',
  opening_hours TEXT DEFAULT 'Open 24 hours',
  contact_number TEXT,
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-populate geometry from lat/lng
CREATE OR REPLACE FUNCTION set_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  NEW.coordinates := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_coordinates
  BEFORE INSERT OR UPDATE ON attractions
  FOR EACH ROW
  EXECUTE FUNCTION set_coordinates();

CREATE INDEX idx_attractions_category ON attractions(category);
CREATE INDEX idx_attractions_slug ON attractions(slug);
CREATE INDEX idx_attractions_coordinates ON attractions USING GIST(coordinates);

-- ============================================================
-- ACTIVITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cost TEXT DEFAULT 'Free',
  duration_mins INTEGER
);

CREATE INDEX idx_activities_attraction ON activities(attraction_id);

-- ============================================================
-- PHOTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT
);

CREATE INDEX idx_photos_attraction ON photos(attraction_id);

-- ============================================================
-- ROUTES
-- ============================================================
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  route_type TEXT NOT NULL CHECK (route_type IN ('suggested_loop', 'shortcut', 'alternative')),
  distance_km NUMERIC(6,2),
  estimated_time_mins INTEGER,
  road_condition TEXT CHECK (road_condition IN ('paved', 'unpaved', 'rough', 'mixed')),
  geojson_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_routes_type ON routes(route_type);

-- ============================================================
-- TRANSPORT MATRIX (Fare Computation)
-- ============================================================
CREATE TABLE IF NOT EXISTS transport_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('tricycle', 'jeepney', 'boat')),
  base_fare NUMERIC(8,2) NOT NULL,
  base_km NUMERIC(6,2) DEFAULT 1.0,
  per_km_rate NUMERIC(8,2) DEFAULT 0.0,
  special_trip_rate NUMERIC(8,2) DEFAULT 0.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('disaster', 'police', 'medical', 'fire', 'government', 'tourism')),
  phone_number TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_emergency_category ON emergency_contacts(category);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Public read access for all tourists (anonymous)
CREATE POLICY "Public read access" ON attractions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON activities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON photos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON routes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transport_matrix FOR SELECT USING (true);
CREATE POLICY "Public read access" ON emergency_contacts FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated write" ON attractions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON activities FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON photos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON routes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON transport_matrix FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON emergency_contacts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
