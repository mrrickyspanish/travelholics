-- Group Trip lifecycle hardening
-- Keeps one confirmed inquiry tied to one Trip Hub and records conversion timing.

alter table public.group_cruise_inquiries
  add column if not exists converted_at timestamptz;

create unique index if not exists group_trips_inquiry_unique
  on public.group_trips (inquiry_id)
  where inquiry_id is not null;

-- Backfill conversion timestamps for any inquiry that has already been converted.
update public.group_cruise_inquiries
set converted_at = coalesce(converted_at, updated_at, created_at)
where converted_trip_id is not null
  and converted_at is null;
