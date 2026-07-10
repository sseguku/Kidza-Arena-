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

alter table public.recurring_bookings enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.recurring_overrides enable row level security;

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

-- Seed recurring bookings (day_of_week: 0=Sun, 1=Mon … 6=Sat)
insert into public.recurring_bookings (team_name, booking_type, day_of_week, start_time, end_time, duration_minutes) values
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
on conflict do nothing;
