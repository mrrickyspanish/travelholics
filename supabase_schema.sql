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
    id           UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    first_name   TEXT                     NOT NULL,
    email        TEXT                     NOT NULL,
    city         TEXT,
    phone        TEXT,
    duck_number  TEXT,
    batch        TEXT,
    ship         TEXT,
    source       TEXT,
    travel_reason TEXT
                     CHECK (travel_reason IN ('Vacation', 'Honeymoon', 'Anniversary', 'Family Reunion', 'Birthday', 'Other')),
    status       TEXT                     NOT NULL DEFAULT 'unclaimed'
                     CHECK (status IN ('unclaimed', 'claimed', 'fulfilled'))
);

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
-- Quick verification — run after the above to confirm setup:
--   SELECT COUNT(*) FROM public.cruise_inquiries;
--   SELECT COUNT(*) FROM public.duck_hunt_leads;
-- ------------------------------------------------------------
