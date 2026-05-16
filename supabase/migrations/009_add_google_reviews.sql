ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS google_review_url text,
  ADD COLUMN IF NOT EXISTS google_rating text,
  ADD COLUMN IF NOT EXISTS google_review_count text,
  ADD COLUMN IF NOT EXISTS google_review_1_author text,
  ADD COLUMN IF NOT EXISTS google_review_1_text text,
  ADD COLUMN IF NOT EXISTS google_review_1_rating text,
  ADD COLUMN IF NOT EXISTS google_review_2_author text,
  ADD COLUMN IF NOT EXISTS google_review_2_text text,
  ADD COLUMN IF NOT EXISTS google_review_2_rating text,
  ADD COLUMN IF NOT EXISTS google_review_3_author text,
  ADD COLUMN IF NOT EXISTS google_review_3_text text,
  ADD COLUMN IF NOT EXISTS google_review_3_rating text;
