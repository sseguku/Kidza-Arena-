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
