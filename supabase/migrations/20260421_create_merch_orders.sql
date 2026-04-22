create table if not exists public.merch_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  product_id text not null,
  product_name text not null,
  color text not null,
  size text not null,
  quantity integer not null default 1,
  amount_total integer,
  currency text default 'usd',
  customer_email text,
  customer_name text,
  payment_status text,
  source text default 'yotravelholic-shop',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists merch_orders_created_at_idx
  on public.merch_orders (created_at desc);

create index if not exists merch_orders_product_id_idx
  on public.merch_orders (product_id);
