-- Ensure both anonymous and logged-in visitors can read availability tables.

grant select on public.bookings to anon, authenticated;
grant select on public.recurring_bookings to anon, authenticated;
grant select on public.blocked_slots to anon, authenticated;
grant select on public.recurring_overrides to anon, authenticated;

drop policy if exists "Public read bookings for availability" on public.bookings;
create policy "Public read bookings for availability"
  on public.bookings for select
  using (true);

drop policy if exists "Public read active recurring bookings" on public.recurring_bookings;
create policy "Public read active recurring bookings"
  on public.recurring_bookings for select
  using (active = true);

drop policy if exists "Public read active blocked slots" on public.blocked_slots;
create policy "Public read active blocked slots"
  on public.blocked_slots for select
  using (active = true);

drop policy if exists "Public read recurring overrides" on public.recurring_overrides;
create policy "Public read recurring overrides"
  on public.recurring_overrides for select
  using (true);
