-- ============================================================
-- Duck Hunt shipping address
-- The claim form previously promised "we'll confirm your mailing
-- address" over a follow-up email — a second touchpoint that isn't
-- guaranteed to land. Capture the shipping address directly in the
-- claim form instead.
-- ============================================================

ALTER TABLE public.duck_hunt_leads
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address1 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address2 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city TEXT,
  ADD COLUMN IF NOT EXISTS shipping_state TEXT,
  ADD COLUMN IF NOT EXISTS shipping_zip TEXT;
