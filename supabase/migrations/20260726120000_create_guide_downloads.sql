-- ------------------------------------------------------------
-- guide_downloads
-- Populated by /api/guides/unlock when someone trades a name and
-- email for one of the free guides on /guides.
--
-- One row per person per guide: the unique constraint lets a repeat
-- download be recognised (and the file handed over again) without
-- inflating the lead count.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guide_downloads (
    id            UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    first_name    TEXT                     NOT NULL,
    email         TEXT                     NOT NULL,
    guide_id      TEXT                     NOT NULL,
    guide_title   TEXT                     NOT NULL,
    source        TEXT                     NOT NULL DEFAULT 'guides',
    consent_text  TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS guide_downloads_email_guide_idx
    ON public.guide_downloads (email, guide_id);

CREATE INDEX IF NOT EXISTS guide_downloads_guide_id_idx
    ON public.guide_downloads (guide_id);

CREATE INDEX IF NOT EXISTS guide_downloads_created_at_idx
    ON public.guide_downloads (created_at DESC);

ALTER TABLE public.guide_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public guide downloads"      ON public.guide_downloads;
DROP POLICY IF EXISTS "Allow authenticated guide viewing" ON public.guide_downloads;

CREATE POLICY "Allow public guide downloads"
    ON public.guide_downloads FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated guide viewing"
    ON public.guide_downloads FOR SELECT TO authenticated
    USING (true);
