-- Remove duplicate recurring bookings (keep earliest row per weekly slot)
delete from public.recurring_bookings a
using public.recurring_bookings b
where a.id > b.id
  and a.day_of_week = b.day_of_week
  and a.start_time = b.start_time
  and a.end_time = b.end_time
  and a.active = true
  and b.active = true;

-- Remove duplicate one-off blocked slots
delete from public.blocked_slots a
using public.blocked_slots b
where a.id > b.id
  and a.is_recurring = false
  and b.is_recurring = false
  and a.block_date = b.block_date
  and a.start_time = b.start_time
  and a.end_time = b.end_time
  and a.active = true
  and b.active = true;

-- Remove duplicate recurring blocked slots
delete from public.blocked_slots a
using public.blocked_slots b
where a.id > b.id
  and a.is_recurring = true
  and b.is_recurring = true
  and a.day_of_week = b.day_of_week
  and a.start_time = b.start_time
  and a.end_time = b.end_time
  and a.active = true
  and b.active = true;

-- One active team per weekly time slot
create unique index if not exists recurring_bookings_unique_weekly_slot
  on public.recurring_bookings (day_of_week, start_time, end_time)
  where active = true;

create unique index if not exists blocked_slots_unique_date_slot
  on public.blocked_slots (block_date, start_time, end_time)
  where active = true and is_recurring = false;

create unique index if not exists blocked_slots_unique_recurring_slot
  on public.blocked_slots (day_of_week, start_time, end_time)
  where active = true and is_recurring = true;
