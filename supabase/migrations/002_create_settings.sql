-- Site settings table (single row, id always = 1)
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  company_name text NOT NULL DEFAULT 'Cartago Motors',
  hero_tagline text NOT NULL DEFAULT 'Spécialiste export automobile',
  hero_title text NOT NULL DEFAULT 'Voitures Premium pour l''export',
  hero_description text NOT NULL DEFAULT 'Sélection rigoureuse de véhicules haut de gamme. Accompagnement complet jusqu''à la livraison au Maghreb.',
  about_text text,
  phone text,
  whatsapp text,
  email text,
  address text,
  facebook_url text,
  instagram_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS: public can read, service role writes (bypasses RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
