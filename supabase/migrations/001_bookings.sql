-- Kidza Arena bookings table
-- Run in Supabase SQL Editor or via supabase db push

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  booking_type text not null check (booking_type in ('individual', 'team')),
  booking_date date not null,
  start_time time not null,
  duration_hours integer not null check (duration_hours >= 1 and duration_hours <= 3),
  price_ugx integer not null check (price_ugx > 0),
  session_period text not null check (session_period in ('day', 'night')),

  full_name text not null,
  phone text not null,
  email text not null,
  whatsapp text,
  preferred_contact text check (preferred_contact in ('phone', 'email', 'whatsapp')),

  player_count integer,
  skill_level text,
  match_type text,
  team_name text,
  notes text,

  status text not null default 'pending_approval'
    check (status in ('pending_approval', 'confirmed', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded'))
);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

-- Public can insert bookings (no auth required for now)
create policy "Anyone can create bookings"
  on public.bookings for insert
  with check (true);

-- Service role reads for availability; anon cannot read others' PII
create policy "Service role full access"
  on public.bookings for all
  using (auth.role() = 'service_role');

-- Allow anonymous read of date/time/duration only for availability checks via RPC or use service role in server actions

comment on table public.bookings is 'Kidza Arena pitch booking requests';
