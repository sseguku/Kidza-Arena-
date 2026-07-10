-- Allow publishable (anon) key to read bookings for pitch availability
-- @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

grant select on public.bookings to anon;
grant select on public.recurring_bookings to anon;
grant select on public.blocked_slots to anon;
grant select on public.recurring_overrides to anon;
grant select on public.site_settings to anon;

create policy "Public read bookings for availability"
  on public.bookings for select
  to anon
  using (true);
