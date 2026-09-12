-- Travelholics Group Trip Phase 2.1
-- Server-side throttling support for shared Trip Hub access codes.

create table if not exists public.group_trip_access_attempts (
  trip_id uuid not null references public.group_trips(id) on delete cascade,
  client_key text not null,
  failure_count integer not null default 0 check (failure_count >= 0),
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now(),
  primary key (trip_id, client_key)
);

create index if not exists group_trip_access_attempts_locked_idx
  on public.group_trip_access_attempts (locked_until)
  where locked_until is not null;

alter table public.group_trip_access_attempts enable row level security;

create or replace function public.record_group_trip_access_failure(
  p_trip_id uuid,
  p_client_key text
)
returns table (failure_count integer, locked_until timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window interval := interval '15 minutes';
  v_lock interval := interval '10 minutes';
begin
  insert into public.group_trip_access_attempts as attempts (
    trip_id,
    client_key,
    failure_count,
    window_started_at,
    locked_until,
    updated_at
  )
  values (
    p_trip_id,
    p_client_key,
    1,
    v_now,
    null,
    v_now
  )
  on conflict (trip_id, client_key) do update
  set
    failure_count = case
      when attempts.window_started_at < v_now - v_window then 1
      else attempts.failure_count + 1
    end,
    window_started_at = case
      when attempts.window_started_at < v_now - v_window then v_now
      else attempts.window_started_at
    end,
    locked_until = case
      when attempts.locked_until is not null and attempts.locked_until > v_now then attempts.locked_until
      when (case when attempts.window_started_at < v_now - v_window then 1 else attempts.failure_count + 1 end) >= 5 then v_now + v_lock
      else null
    end,
    updated_at = v_now
  returning attempts.failure_count, attempts.locked_until
  into failure_count, locked_until;

  return next;
end;
$$;
