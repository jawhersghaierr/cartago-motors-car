-- ============================================================
-- Cartago Motors — Cars table
-- Run this in the Supabase SQL editor
-- ============================================================

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand           TEXT NOT NULL,
  model           TEXT NOT NULL,
  year            INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
  vin             TEXT,
  plate_number    TEXT,
  fuel            TEXT NOT NULL CHECK (fuel IN ('Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL')),
  engine          TEXT,
  transmission    TEXT NOT NULL CHECK (transmission IN ('Manuelle', 'Automatique', 'Semi-automatique')),
  horsepower      INTEGER CHECK (horsepower > 0),
  color           TEXT,
  price           NUMERIC(12, 2) CHECK (price >= 0),
  status          TEXT NOT NULL DEFAULT 'available'
                    CHECK (status IN ('available', 'reserved', 'sold')),
  images          JSONB NOT NULL DEFAULT '[]',
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cars_status     ON cars (status);
CREATE INDEX IF NOT EXISTS idx_cars_brand      ON cars (brand);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cars_updated_at ON cars;
CREATE TRIGGER cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Public read access (modify if you want to restrict)
CREATE POLICY "public_read_cars" ON cars
  FOR SELECT USING (true);

-- Service role has full access (bypasses RLS automatically)

-- ============================================================
-- Storage bucket — run in Supabase dashboard or via CLI:
--
--   supabase storage create car-images --public
--
-- Or in the SQL editor:
--   INSERT INTO storage.buckets (id, name, public)
--   VALUES ('car-images', 'car-images', true)
--   ON CONFLICT (id) DO NOTHING;
-- ============================================================
