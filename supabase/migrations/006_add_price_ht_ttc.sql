ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_ht integer;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_ttc integer;
-- Migrer les données existantes vers price_ttc
UPDATE cars SET price_ttc = price::integer WHERE price IS NOT NULL;
