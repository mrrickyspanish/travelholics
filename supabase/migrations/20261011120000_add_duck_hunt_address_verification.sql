-- ============================================================
-- Duck Hunt address verification
--
-- Addresses are checked against the USPS Addresses API on submit. The
-- check is advisory: an address USPS cannot confirm is still accepted,
-- because new construction, rural routes and APO/FPO addresses can be
-- perfectly real and still fail verification, and a hard block would
-- lose real winners.
--
-- So the result is recorded instead, and Yolanda can eyeball anything
-- that is not 'verified' before paying for postage.
--
--   verified             USPS confirmed it delivers there (DPV = Y)
--   unconfirmed_accepted USPS could not confirm; the entrant chose to
--                        use the address anyway
--   unchecked            verification did not run (not configured, or
--                        USPS was unreachable) — never blocks a claim
-- ============================================================

ALTER TABLE public.duck_hunt_leads
  ADD COLUMN IF NOT EXISTS address_verification TEXT,
  ADD COLUMN IF NOT EXISTS address_verified_at TIMESTAMPTZ;

COMMENT ON COLUMN public.duck_hunt_leads.address_verification IS
  'USPS check result: verified | unconfirmed_accepted | unchecked. Advisory, never blocks a claim.';

-- Shipping queue: pull everything that still needs a human look.
CREATE INDEX IF NOT EXISTS duck_hunt_leads_address_verification_idx
  ON public.duck_hunt_leads (address_verification)
  WHERE address_verification IS DISTINCT FROM 'verified';
