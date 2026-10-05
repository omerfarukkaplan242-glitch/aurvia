-- Run in the Supabase SQL editor after you create your own account.
-- Replace the email. This does not contain a password or secret.
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'you@example.com'
);
