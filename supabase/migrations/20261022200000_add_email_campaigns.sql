-- ============================================================
-- Email drip campaigns
--
-- Supabase stays the single source of truth for consent. Nothing here
-- duplicates the subscriber list anywhere else: a second copy in a hosted
-- tool means two answers to "has this person unsubscribed", and the wrong
-- answer sends mail to someone who asked you to stop.
--
-- Three tables:
--   email_campaigns        the drip and its entry rule
--   email_campaign_steps   ordered messages, each a delay from enrollment
--   email_campaign_enrollments  who is in a drip, and since when
--   email_sends            the ledger -- one row per (enrollment, step)
--
-- The ledger is the part that matters. A cron that retries, overlaps, or
-- runs twice will double-send without it, and a subscriber who gets the
-- same email twice is the fastest way to earn a spam complaint.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  -- Campaigns ship as 'draft' and send nothing. Activating is a deliberate
  -- act, because the copy is the owner's and needs her sign-off first.
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'paused')),
  -- Only subscribers who joined at or after this moment are ever enrolled.
  -- Without it, activating a campaign would enrol the entire back catalogue
  -- and blast years of subscribers at once -- which is both a bad experience
  -- and the classic way to destroy a sending reputation overnight.
  enroll_from timestamptz NOT NULL DEFAULT timezone('utc', now()),
  -- Optional targeting against newsletter_subscribers.interests.
  required_interest text
);

CREATE TABLE IF NOT EXISTS public.email_campaign_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  position int NOT NULL,
  -- Hours after enrollment, not after the previous step: a delay measured
  -- from a previous send drifts every time a run is late or a step fails.
  delay_hours int NOT NULL CHECK (delay_hours >= 0),
  template_key text NOT NULL,
  subject text NOT NULL,
  UNIQUE (campaign_id, position)
);

CREATE TABLE IF NOT EXISTS public.email_campaign_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'cancelled')),
  UNIQUE (campaign_id, subscriber_id)
);

CREATE TABLE IF NOT EXISTS public.email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.email_campaign_enrollments(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.email_campaign_steps(id) ON DELETE CASCADE,
  email text NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  sent_at timestamptz,
  provider_message_id text,
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  -- The idempotency guard. A worker claims a send by inserting this row
  -- before calling the mail provider; the conflict is what stops a second
  -- worker, a retry, or an overlapping run from sending the same message
  -- twice.
  UNIQUE (enrollment_id, step_id)
);

COMMENT ON COLUMN public.email_sends.status IS
  'pending = claimed, not yet confirmed sent. sent = provider accepted it. failed = provider rejected it and it may be retried. A row stuck at pending means the worker died mid-send; it is deliberately NOT retried, because the provider may already have delivered it and a duplicate is worse than a miss.';

-- Work queues: the worker asks "which enrollments are active" and "what has
-- this enrollment already been sent".
CREATE INDEX IF NOT EXISTS email_campaign_enrollments_active_idx
  ON public.email_campaign_enrollments (campaign_id, status)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS email_sends_enrollment_idx
  ON public.email_sends (enrollment_id);

CREATE INDEX IF NOT EXISTS email_sends_retryable_idx
  ON public.email_sends (status, attempts)
  WHERE status = 'failed';

DROP TRIGGER IF EXISTS set_email_campaigns_updated_at ON public.email_campaigns;
CREATE TRIGGER set_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- These tables are operated entirely by the service role from cron. No anon
-- or authenticated policy is granted, so RLS denies everything else.
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;
