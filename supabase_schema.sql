-- ============================================================
-- Travelholics — Full Database Schema
-- Run this entire script in Supabase SQL Editor to set up
-- a fresh project from scratch.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- TABLE 1: cruise_inquiries
-- Populated by the main site contact form
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cruise_inquiries (
    id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    name        TEXT                     NOT NULL,
    email       TEXT                     NOT NULL,
    phone       TEXT,
    message     TEXT                     NOT NULL,
    status      TEXT                     NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new', 'contacted', 'booked', 'closed'))
);

ALTER TABLE public.cruise_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public submissions"      ON public.cruise_inquiries;
DROP POLICY IF EXISTS "Allow authenticated viewing"   ON public.cruise_inquiries;
DROP POLICY IF EXISTS "Allow authenticated updates"   ON public.cruise_inquiries;

CREATE POLICY "Allow public submissions"
    ON public.cruise_inquiries FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated viewing"
    ON public.cruise_inquiries FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated updates"
    ON public.cruise_inquiries FOR UPDATE TO authenticated
    USING (true);


-- ------------------------------------------------------------
-- TABLE 2: duck_hunt_leads
-- Populated by the /duck-hunt page when a ship duck is found
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.duck_hunt_leads (
    id            UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    first_name    TEXT                     NOT NULL,
    email         TEXT                     NOT NULL,
    city          TEXT,
    phone         TEXT,
    duck_number   TEXT,
    batch         TEXT,
    ship          TEXT,
    source        TEXT,
    travel_reason TEXT
                      CHECK (travel_reason IN ('Vacation', 'Honeymoon', 'Anniversary', 'Family Reunion', 'Birthday', 'Other')),
    status        TEXT                     NOT NULL DEFAULT 'unclaimed'
                      CHECK (status IN ('unclaimed', 'claimed', 'fulfilled'))
);

ALTER TABLE public.duck_hunt_leads
    ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS newsletter_subscriber_id UUID,
    ADD COLUMN IF NOT EXISTS consent_text TEXT,
    ADD COLUMN IF NOT EXISTS consented_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.duck_hunt_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public duck hunt submissions"    ON public.duck_hunt_leads;
DROP POLICY IF EXISTS "Allow authenticated duck hunt viewing" ON public.duck_hunt_leads;
DROP POLICY IF EXISTS "Allow authenticated duck hunt updates" ON public.duck_hunt_leads;

CREATE POLICY "Allow public duck hunt submissions"
    ON public.duck_hunt_leads FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated duck hunt viewing"
    ON public.duck_hunt_leads FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated duck hunt updates"
    ON public.duck_hunt_leads FOR UPDATE TO authenticated
    USING (true);


-- ------------------------------------------------------------
-- TABLE 3: shop_waitlist
-- Populated by the /shop coming soon notify form
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shop_waitlist (
    id          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    first_name  TEXT                     NOT NULL,
    email       TEXT                     NOT NULL UNIQUE,
    source      TEXT                     NOT NULL DEFAULT 'shop-coming-soon'
);

ALTER TABLE public.shop_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public waitlist signups"     ON public.shop_waitlist;
DROP POLICY IF EXISTS "Allow authenticated waitlist view" ON public.shop_waitlist;

CREATE POLICY "Allow public waitlist signups"
    ON public.shop_waitlist FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated waitlist view"
    ON public.shop_waitlist FOR SELECT TO authenticated
    USING (true);


-- ------------------------------------------------------------
-- TABLE 4: newsletter_subscribers
-- Unified opt-in list for Duck Hunt, shop deals, cruise deals,
-- footer signups, future campaign pages, and email-platform sync.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    email               TEXT                     NOT NULL UNIQUE,
    first_name          TEXT,
    city                TEXT,
    source              TEXT                     NOT NULL DEFAULT 'website',
    interests           TEXT[]                   NOT NULL DEFAULT ARRAY['newsletter']::TEXT[],
    consent_status      TEXT                     NOT NULL DEFAULT 'subscribed'
                                               CHECK (consent_status IN ('subscribed', 'unsubscribed', 'pending')),
    consent_text        TEXT                     NOT NULL,
    consented_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    unsubscribed_at     TIMESTAMP WITH TIME ZONE,
    duck_hunt_lead_id   UUID                     REFERENCES public.duck_hunt_leads(id) ON DELETE SET NULL,
    ship                TEXT,
    duck_number         TEXT,
    batch               TEXT,
    metadata            JSONB                    NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_source_idx
    ON public.newsletter_subscribers (source);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_consent_status_idx
    ON public.newsletter_subscribers (consent_status);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_interests_idx
    ON public.newsletter_subscribers USING GIN (interests);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_newsletter_subscribers_updated_at ON public.newsletter_subscribers;
CREATE TRIGGER set_newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public newsletter signups"        ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated newsletter viewing" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated newsletter updates" ON public.newsletter_subscribers;

CREATE POLICY "Allow public newsletter signups"
    ON public.newsletter_subscribers FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated newsletter viewing"
    ON public.newsletter_subscribers FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated newsletter updates"
    ON public.newsletter_subscribers FOR UPDATE TO authenticated
    USING (true);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'duck_hunt_leads_newsletter_subscriber_id_fkey'
    ) THEN
        ALTER TABLE public.duck_hunt_leads
            ADD CONSTRAINT duck_hunt_leads_newsletter_subscriber_id_fkey
            FOREIGN KEY (newsletter_subscriber_id)
            REFERENCES public.newsletter_subscribers(id)
            ON DELETE SET NULL;
    END IF;
END $$;


-- ------------------------------------------------------------
-- Quick verification — run after the above to confirm setup:
--   SELECT COUNT(*) FROM public.cruise_inquiries;
--   SELECT COUNT(*) FROM public.duck_hunt_leads;
--   SELECT COUNT(*) FROM public.shop_waitlist;
--   SELECT COUNT(*) FROM public.newsletter_subscribers;
-- ------------------------------------------------------------
