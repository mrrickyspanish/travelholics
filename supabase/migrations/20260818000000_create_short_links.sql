-- ============================================================
-- Travelholics short links
-- Slug-based redirects for QR codes and shareable short URLs,
-- with click tracking. Public redirects are served from /s/[slug].
-- ============================================================

-- Defined with CREATE OR REPLACE so this migration is self-contained even if
-- an earlier migration that also declares it hasn't run yet.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.short_links (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  slug             TEXT NOT NULL UNIQUE,
  destination_url  TEXT NOT NULL,
  label            TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  click_count      INTEGER NOT NULL DEFAULT 0,
  last_clicked_at  TIMESTAMP WITH TIME ZONE,
  created_by       TEXT,
  CONSTRAINT short_links_slug_format CHECK (slug ~ '^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$')
);

DROP TRIGGER IF EXISTS set_short_links_updated_at ON public.short_links;
CREATE TRIGGER set_short_links_updated_at
  BEFORE UPDATE ON public.short_links
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS short_links_created_at_idx ON public.short_links (created_at DESC);

ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage short links" ON public.short_links;
CREATE POLICY "Authenticated can manage short links"
  ON public.short_links FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Atomic click increment + destination lookup for the public /s/[slug]
-- redirect route, which reads through the service-role client rather than
-- an anon RLS policy.
CREATE OR REPLACE FUNCTION public.register_short_link_click(link_slug TEXT)
RETURNS TABLE (destination_url TEXT) AS $$
  UPDATE public.short_links
  SET click_count = click_count + 1,
      last_clicked_at = timezone('utc', now())
  WHERE slug = link_slug AND is_active
  RETURNING short_links.destination_url;
$$ LANGUAGE sql;
