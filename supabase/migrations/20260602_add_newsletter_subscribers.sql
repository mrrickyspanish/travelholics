-- Travelholics newsletter foundation for Duck Hunt and sitewide opt-ins.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.duck_hunt_leads
  ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS newsletter_subscriber_id uuid,
  ADD COLUMN IF NOT EXISTS consent_text text,
  ADD COLUMN IF NOT EXISTS consented_at timestamptz;

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  email text NOT NULL UNIQUE,
  first_name text,
  city text,
  source text NOT NULL DEFAULT 'website',
  interests text[] NOT NULL DEFAULT ARRAY['newsletter']::text[],
  consent_status text NOT NULL DEFAULT 'subscribed'
    CHECK (consent_status IN ('subscribed', 'unsubscribed', 'pending')),
  consent_text text NOT NULL,
  consented_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  unsubscribed_at timestamptz,
  duck_hunt_lead_id uuid REFERENCES public.duck_hunt_leads(id) ON DELETE SET NULL,
  ship text,
  duck_number text,
  batch text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_source_idx
  ON public.newsletter_subscribers (source);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_consent_status_idx
  ON public.newsletter_subscribers (consent_status);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_interests_idx
  ON public.newsletter_subscribers USING gin (interests);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
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

DROP POLICY IF EXISTS "Allow public newsletter signups" ON public.newsletter_subscribers;
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
