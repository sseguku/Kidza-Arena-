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
