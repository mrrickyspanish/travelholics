-- Travelholics Group Cruise Service V1
-- Inquiry -> trip -> traveling party lifecycle for the white-glove group cruise experience.

create extension if not exists pgcrypto;

create table if not exists public.group_cruise_inquiries (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new','contacted','planning','confirmed','closed_lost')),
  source text not null default 'group-cruises-page',
  leader_name text not null,
  email text not null,
  phone text,
  preferred_contact text check (preferred_contact in ('phone','text','email')),
  sms_consent boolean not null default false,
  group_type text,
  estimated_group_size integer check (estimated_group_size is null or estimated_group_size > 0),
  cruise_stage text not null default 'help' check (cruise_stage in ('specific','help')),
  destination text,
  preferred_dates text,
  budget_range text,
  cruise_line text,
  ship text,
  sailing_date date,
  notes text,
  converted_trip_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_trips (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.group_cruise_inquiries(id) on delete set null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  name text not null,
  destination text not null,
  cruise_line text not null,
  ship text not null,
  sail_date date not null,
  return_date date,
  departure_port text,
  hero_image_url text,
  overview text,
  access_code text not null,
  group_leader_name text not null,
  group_leader_email text not null,
  group_leader_phone text,
  leader_access_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  price_display text not null default 'both' check (price_display in ('per_person','cabin_total','both')),
  booking_request_note text,
  created_by text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.group_cruise_inquiries
  add constraint group_cruise_inquiries_converted_trip_fk
  foreign key (converted_trip_id) references public.group_trips(id) on delete set null;

create table if not exists public.group_trip_cabin_offers (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.group_trips(id) on delete cascade,
  name text not null,
  description text,
  occupancy_label text,
  per_person_price numeric(10,2),
  cabin_total_price numeric(10,2),
  availability_note text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_trip_itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.group_trips(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  port text,
  arrival_time text,
  departure_time text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.group_trip_deadlines (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.group_trips(id) on delete cascade,
  title text not null,
  deadline_date date not null,
  description text,
  reminder_days_before integer[] not null default '{}',
  audience_statuses text[] not null default array['submitted','contacted','booking_in_progress','booked']::text[],
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_trip_parties (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.group_trips(id) on delete cascade,
  primary_name text not null,
  email text not null,
  phone text,
  party_size integer check (party_size is null or party_size > 0),
  cabin_offer_id uuid references public.group_trip_cabin_offers(id) on delete set null,
  cabin_preference text,
  notes text,
  status text not null default 'invited' check (status in ('invited','submitted','contacted','booking_in_progress','booked','travel_ready')),
  invited_by_group_leader boolean not null default false,
  submitted_at timestamptz,
  booked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists group_trip_parties_trip_email_unique
  on public.group_trip_parties (trip_id, lower(email));

create table if not exists public.group_trip_party_members (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.group_trip_parties(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_trip_email_log (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.group_trips(id) on delete cascade,
  party_id uuid references public.group_trip_parties(id) on delete cascade,
  event_key text not null unique,
  email_type text not null,
  recipient text not null,
  sent_at timestamptz not null default now()
);

create index if not exists group_cruise_inquiries_status_idx on public.group_cruise_inquiries(status, created_at desc);
create index if not exists group_trips_status_idx on public.group_trips(status, sail_date);
create index if not exists group_trip_parties_trip_status_idx on public.group_trip_parties(trip_id, status);
create index if not exists group_trip_deadlines_trip_date_idx on public.group_trip_deadlines(trip_id, deadline_date);

-- Keep public access server-mediated. Service-role APIs can access these tables;
-- browsers never receive direct table permissions.
alter table public.group_cruise_inquiries enable row level security;
alter table public.group_trips enable row level security;
alter table public.group_trip_cabin_offers enable row level security;
alter table public.group_trip_itinerary_items enable row level security;
alter table public.group_trip_deadlines enable row level security;
alter table public.group_trip_parties enable row level security;
alter table public.group_trip_party_members enable row level security;
alter table public.group_trip_email_log enable row level security;

create or replace function public.touch_group_trip_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_group_cruise_inquiries_updated_at on public.group_cruise_inquiries;
create trigger touch_group_cruise_inquiries_updated_at before update on public.group_cruise_inquiries
for each row execute function public.touch_group_trip_updated_at();

drop trigger if exists touch_group_trips_updated_at on public.group_trips;
create trigger touch_group_trips_updated_at before update on public.group_trips
for each row execute function public.touch_group_trip_updated_at();

drop trigger if exists touch_group_trip_cabin_offers_updated_at on public.group_trip_cabin_offers;
create trigger touch_group_trip_cabin_offers_updated_at before update on public.group_trip_cabin_offers
for each row execute function public.touch_group_trip_updated_at();

drop trigger if exists touch_group_trip_deadlines_updated_at on public.group_trip_deadlines;
create trigger touch_group_trip_deadlines_updated_at before update on public.group_trip_deadlines
for each row execute function public.touch_group_trip_updated_at();

drop trigger if exists touch_group_trip_parties_updated_at on public.group_trip_parties;
create trigger touch_group_trip_parties_updated_at before update on public.group_trip_parties
for each row execute function public.touch_group_trip_updated_at();
