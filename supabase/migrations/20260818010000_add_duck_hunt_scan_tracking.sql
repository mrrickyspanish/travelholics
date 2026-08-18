-- ============================================================
-- Duck Hunt scan tracking
-- Every QR scan is now logged as its own event (not just a click
-- counter), and a completed claim can be joined back to the exact
-- scan that produced it. short_links also gains a metadata column
-- so campaign-specific fields (ship, sail date, duck number) can be
-- stored without a schema change per campaign type.
-- ============================================================

ALTER TABLE public.short_links
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS public.short_link_scans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_link_id UUID NOT NULL REFERENCES public.short_links(id) ON DELETE CASCADE,
  scanned_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  user_agent    TEXT,
  referer       TEXT
);

CREATE INDEX IF NOT EXISTS short_link_scans_short_link_id_idx ON public.short_link_scans (short_link_id);
CREATE INDEX IF NOT EXISTS short_link_scans_scanned_at_idx ON public.short_link_scans (scanned_at DESC);

ALTER TABLE public.short_link_scans ENABLE ROW LEVEL SECURITY;

-- Scans are written by the public /s/[slug] redirect through the
-- service-role client, so no anon insert policy is needed — only the
-- admin-facing read is exposed via RLS.
DROP POLICY IF EXISTS "Authenticated can read short link scans" ON public.short_link_scans;
CREATE POLICY "Authenticated can read short link scans"
  ON public.short_link_scans FOR SELECT TO authenticated
  USING (true);

ALTER TABLE public.duck_hunt_leads
  ADD COLUMN IF NOT EXISTS cruise TEXT,
  ADD COLUMN IF NOT EXISTS scan_id UUID REFERENCES public.short_link_scans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS duck_hunt_leads_scan_id_idx ON public.duck_hunt_leads (scan_id);

-- Replaces the previous single-column version: also returns the short
-- link's id so the redirect route can log a scan event against it.
-- CREATE OR REPLACE can't change a function's return type, so the old
-- signature has to be dropped first.
DROP FUNCTION IF EXISTS public.register_short_link_click(TEXT);

CREATE FUNCTION public.register_short_link_click(link_slug TEXT)
RETURNS TABLE (id UUID, destination_url TEXT) AS $$
  UPDATE public.short_links
  SET click_count = click_count + 1,
      last_clicked_at = timezone('utc', now())
  WHERE slug = link_slug AND is_active
  RETURNING short_links.id, short_links.destination_url;
$$ LANGUAGE sql;
