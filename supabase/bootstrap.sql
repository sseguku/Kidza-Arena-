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

drop policy if exists "Anyone can create bookings" on public.bookings;
drop policy if exists "Service role full access" on public.bookings;
drop policy if exists "Admins can read bookings" on public.bookings;
drop policy if exists "Admins can update bookings" on public.bookings;
drop policy if exists "Public read bookings for availability" on public.bookings;

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
-- Admin profiles, content tables, and RLS policies

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin policies for bookings
create policy "Admins can read bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update bookings"
  on public.bookings for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Site settings (pricing, general config)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;

create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

insert into public.site_settings (key, value) values
  ('pricing', '{"individualPriceUgx":10000,"teamHourlyPriceUgx":80000,"currency":"UGX"}'),
  ('general', '{"siteName":"Kidza Arena","bookingApprovalRequired":true,"maintenanceMode":false}')
on conflict (key) do nothing;

-- Media assets
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  type text not null default 'image' check (type in ('image', 'video')),
  category text,
  alt_text text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

drop policy if exists "Public read published media" on public.media_assets;
drop policy if exists "Admins manage media" on public.media_assets;

create policy "Public read published media"
  on public.media_assets for select
  using (is_published = true);

create policy "Admins manage media"
  on public.media_assets for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Academy programs
create table if not exists public.academy_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  age_group text,
  schedule text,
  price_ugx integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.academy_programs enable row level security;

drop policy if exists "Public read active academy programs" on public.academy_programs;
drop policy if exists "Admins manage academy programs" on public.academy_programs;

create policy "Public read active academy programs"
  on public.academy_programs for select
  using (is_active = true);

create policy "Admins manage academy programs"
  on public.academy_programs for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Tournaments
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_date date,
  end_date date,
  format text,
  prize_ugx integer,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  max_teams integer,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.tournaments enable row level security;

drop policy if exists "Public read published tournaments" on public.tournaments;
drop policy if exists "Admins manage tournaments" on public.tournaments;

create policy "Public read published tournaments"
  on public.tournaments for select
  using (is_published = true);

create policy "Admins manage tournaments"
  on public.tournaments for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
-- Recurring bookings, blocked slots, and overrides for Pitch Availability Center

create table if not exists public.recurring_bookings (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  booking_type text not null default 'team' check (booking_type in ('individual', 'team')),
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  duration_minutes integer not null,
  recurrence_type text not null default 'weekly'
    check (recurrence_type in ('weekly', 'monthly')),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recurring_end_after_start check (end_time > start_time)
);

create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  block_date date,
  day_of_week integer check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  duration_minutes integer not null,
  reason text,
  is_recurring boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint blocked_has_schedule check (
    block_date is not null or (is_recurring = true and day_of_week is not null)
  ),
  constraint blocked_end_after_start check (end_time > start_time)
);

create table if not exists public.recurring_overrides (
  id uuid primary key default gen_random_uuid(),
  recurring_booking_id uuid not null references public.recurring_bookings (id) on delete cascade,
  override_date date not null,
  action text not null default 'skip' check (action in ('skip', 'reschedule')),
  new_start_time time,
  new_end_time time,
  created_at timestamptz not null default now(),
  unique (recurring_booking_id, override_date)
);

create index if not exists recurring_bookings_dow_idx on public.recurring_bookings (day_of_week) where active = true;
create index if not exists blocked_slots_date_idx on public.blocked_slots (block_date) where active = true;
create index if not exists recurring_overrides_date_idx on public.recurring_overrides (override_date);

create unique index if not exists recurring_bookings_unique_weekly_slot
  on public.recurring_bookings (day_of_week, start_time, end_time)
  where active = true;

create unique index if not exists blocked_slots_unique_date_slot
  on public.blocked_slots (block_date, start_time, end_time)
  where active = true and is_recurring = false;

create unique index if not exists blocked_slots_unique_recurring_slot
  on public.blocked_slots (day_of_week, start_time, end_time)
  where active = true and is_recurring = true;

alter table public.recurring_bookings enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.recurring_overrides enable row level security;

drop policy if exists "Public read active recurring bookings" on public.recurring_bookings;
drop policy if exists "Public read active blocked slots" on public.blocked_slots;
drop policy if exists "Public read recurring overrides" on public.recurring_overrides;
drop policy if exists "Admins manage recurring bookings" on public.recurring_bookings;
drop policy if exists "Admins manage blocked slots" on public.blocked_slots;
drop policy if exists "Admins manage recurring overrides" on public.recurring_overrides;

-- Public read active recurring/blocks for availability
create policy "Public read active recurring bookings"
  on public.recurring_bookings for select using (active = true);

create policy "Public read active blocked slots"
  on public.blocked_slots for select using (active = true);

create policy "Public read recurring overrides"
  on public.recurring_overrides for select using (true);

create policy "Admins manage recurring bookings"
  on public.recurring_bookings for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins manage blocked slots"
  on public.blocked_slots for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins manage recurring overrides"
  on public.recurring_overrides for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Seed recurring bookings (day_of_week: 0=Sun, 1=Mon … 6=Sat) — skip if slot already exists
insert into public.recurring_bookings (team_name, booking_type, day_of_week, start_time, end_time, duration_minutes)
select v.team_name, v.booking_type, v.day_of_week, v.start_time::time, v.end_time::time, v.duration_minutes
from (
  values
    ('Team One', 'team', 1, '21:00', '22:00', 60),
    ('Team One', 'team', 2, '21:00', '22:00', 60),
    ('Team One', 'team', 3, '21:00', '22:00', 60),
    ('Team One', 'team', 4, '21:00', '22:00', 60),
    ('Team Davie', 'team', 2, '19:00', '20:00', 60),
    ('Team Davie', 'team', 4, '20:00', '21:00', 60),
    ('Kakoolasi FC', 'team', 1, '22:00', '23:00', 60),
    ('Kakoolasi FC', 'team', 3, '20:00', '21:00', 60),
    ('Kakoolasi FC', 'team', 6, '21:00', '22:00', 60),
    ('Team Suubi', 'team', 5, '20:00', '21:30', 90),
    ('Hapi Pipo', 'team', 5, '18:00', '19:00', 60)
) as v(team_name, booking_type, day_of_week, start_time, end_time, duration_minutes)
where not exists (
  select 1
  from public.recurring_bookings rb
  where rb.day_of_week = v.day_of_week
    and rb.start_time = v.start_time::time
    and rb.end_time = v.end_time::time
    and rb.active = true
);
-- Allow publishable (anon) key to read bookings for pitch availability
-- @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

grant select on public.bookings to anon, authenticated;
grant select on public.recurring_bookings to anon, authenticated;
grant select on public.blocked_slots to anon, authenticated;
grant select on public.recurring_overrides to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

drop policy if exists "Public read bookings for availability" on public.bookings;
create policy "Public read bookings for availability"
  on public.bookings for select
  using (true);
-- Secure public booking submission (returns id without exposing all booking rows to anon)

create or replace function public.submit_booking_request(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.bookings (
    booking_type,
    booking_date,
    start_time,
    duration_hours,
    price_ugx,
    session_period,
    full_name,
    phone,
    email,
    whatsapp,
    preferred_contact,
    player_count,
    skill_level,
    match_type,
    team_name,
    notes,
    status,
    payment_status
  )
  values (
    payload ->> 'booking_type',
    (payload ->> 'booking_date')::date,
    (payload ->> 'start_time')::time,
    (payload ->> 'duration_hours')::integer,
    (payload ->> 'price_ugx')::integer,
    payload ->> 'session_period',
    payload ->> 'full_name',
    payload ->> 'phone',
    payload ->> 'email',
    nullif(payload ->> 'whatsapp', ''),
    nullif(payload ->> 'preferred_contact', ''),
    nullif(payload ->> 'player_count', '')::integer,
    nullif(payload ->> 'skill_level', ''),
    nullif(payload ->> 'match_type', ''),
    nullif(payload ->> 'team_name', ''),
    nullif(payload ->> 'notes', ''),
    'pending_approval',
    'unpaid'
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_booking_request(jsonb) from public;
grant execute on function public.submit_booking_request(jsonb) to anon, authenticated, service_role;
