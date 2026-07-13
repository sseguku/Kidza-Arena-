-- Grant admin access to a Supabase Auth user
-- Run in Supabase Dashboard → SQL Editor
-- Change the email below if needed

insert into public.profiles (id, email, full_name, role)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', 'Admin'),
  'admin'
from auth.users
where email = 'admin@kidzaarena.com'
on conflict (id) do update
  set role = 'admin', email = excluded.email;

-- Verify (should show role = admin)
select u.email, p.role, p.full_name
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'admin@kidzaarena.com';
