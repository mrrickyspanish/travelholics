-- Lets a campaign skip subscribers who carry any of a list of interests, so one
-- person is not enrolled in overlapping series. Duck Hunt finders and guide
-- downloaders are also tagged `newsletter`, so the general welcome series
-- excludes both, and each of them gets its own series instead.
ALTER TABLE public.email_campaigns
  ADD COLUMN IF NOT EXISTS exclude_interests text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.email_campaigns.exclude_interests IS
  'Subscribers carrying any of these interests are never enrolled in the campaign. Empty means no exclusion.';
