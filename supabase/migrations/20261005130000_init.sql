-- AURVIA initial schema. Demo rows are fictional and cannot be marked verified.

create extension if not exists pgcrypto;

create type public.app_role as enum ('patient', 'provider', 'provider_staff', 'admin');
create type public.verification_status as enum ('unverified', 'pending', 'verified');
create type public.request_status as enum ('draft', 'submitted', 'in_review', 'responded', 'accepted', 'declined', 'cancelled');
create type public.journey_stage as enum ('consultation', 'provider_selection', 'trip_planning', 'flight', 'hotel', 'transfer', 'treatment', 'recovery', 'return', 'completed');
create type public.booking_status as enum ('draft', 'requested', 'confirmed', 'cancelled', 'completed');
create type public.document_category as enum ('passport', 'travel', 'treatment', 'booking', 'invoice', 'other');
create type public.commission_mode as enum ('percentage', 'fixed');
create type public.service_kind as enum ('treatment', 'hotel', 'transfer', 'car', 'esim', 'insurance', 'experience');
create type public.payment_status as enum ('simulated', 'pending', 'authorized', 'captured', 'failed', 'refunded');
create type public.notification_kind as enum ('request', 'provider_response', 'message', 'booking', 'journey', 'document');
create type public.analytics_event as enum (
  'landing_view', 'treatment_view', 'provider_view', 'search_started', 'provider_selected',
  'comparison_started', 'trip_started', 'flight_selected', 'hotel_selected', 'transfer_selected',
  'trip_completed', 'lead_submitted', 'signup', 'login'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'patient',
  full_name text not null default '',
  country text,
  preferred_language text not null default 'en' check (preferred_language in ('en','de','tr','fr','ar','nl','ru')),
  preferred_currency text not null default 'EUR' check (preferred_currency in ('EUR','USD','GBP','TRY')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.patient_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  treatment_slug text,
  destination_slug text,
  travel_window text,
  budget_max integer check (budget_max is null or budget_max >= 0),
  currency text not null default 'EUR' check (currency in ('EUR','USD','GBP','TRY')),
  travelers integer not null default 1 check (travelers between 1 and 12),
  hotel_preference text,
  flight_preference text,
  transfer_preference text,
  notes text check (char_length(coalesce(notes, '')) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.treatment_categories (
  slug text primary key,
  sort_order integer not null default 0
);

create table public.treatments (
  slug text primary key,
  category_slug text not null references public.treatment_categories (slug),
  status text not null default 'preview' check (status in ('open', 'preview')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.destinations (
  slug text primary key,
  country_code text not null default 'TR',
  created_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city_slug text not null references public.destinations (slug),
  is_demo boolean not null default true,
  verification_status public.verification_status not null default 'unverified',
  languages text[] not null default '{}',
  treatment_slugs text[] not null default '{}',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint providers_demo_not_verified check (not is_demo or verification_status <> 'verified')
);

create table public.provider_members (
  provider_id uuid not null references public.providers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  member_role public.app_role not null default 'provider',
  created_at timestamptz not null default now(),
  primary key (provider_id, user_id),
  constraint provider_member_role check (member_role in ('provider', 'provider_staff'))
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  slug text not null,
  treatment_slug text not null,
  title text not null,
  summary text not null default '',
  price_eur integer not null check (price_eur >= 0),
  nights integer not null default 0 check (nights >= 0),
  includes_hotel boolean not null default false,
  includes_transfer boolean not null default false,
  includes_consultation boolean not null default true,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (provider_id, slug)
);

create table public.provider_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  note text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid references public.providers (id),
  treatment_slug text not null,
  destination_slug text,
  status public.request_status not null default 'submitted',
  budget_max integer,
  currency text not null default 'EUR',
  language text not null default 'en',
  note text check (char_length(coalesce(note, '')) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  from_status public.request_status,
  to_status public.request_status not null,
  created_at timestamptz not null default now()
);

create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  request_id uuid references public.requests (id),
  provider_id uuid references public.providers (id),
  stage public.journey_stage not null default 'consultation',
  title text not null default 'My journey',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  patient_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  reference text not null,
  amount_eur integer not null default 0 check (amount_eur >= 0),
  status public.booking_status not null default 'requested',
  simulated boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.trip_drafts (
  patient_id uuid primary key references public.profiles (id) on delete cascade,
  payload jsonb not null,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (octet_length(payload::text) < 20000)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  request_id uuid references public.requests (id),
  created_at timestamptz not null default now(),
  unique (patient_id, provider_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text not null check (char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.notification_kind not null,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  request_id uuid references public.requests (id),
  category public.document_category not null default 'other',
  storage_path text not null unique,
  filename text not null,
  mime text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  service public.service_kind not null,
  mode public.commission_mode not null,
  value numeric(10,2) not null check (value >= 0),
  provider_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.commission_entries (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references public.commission_rules (id),
  provider_id uuid references public.providers (id),
  amount_eur integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  request_id uuid references public.requests (id),
  reference text not null,
  amount_eur integer not null default 0 check (amount_eur >= 0),
  currency text not null,
  status public.payment_status not null default 'simulated',
  provider text not null default 'simulation',
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent_off numeric(5,2) check (percent_off is null or percent_off between 0 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.content_pages (
  slug text not null,
  locale text not null check (locale in ('en','de','tr','fr','ar','nl','ru')),
  title text not null,
  body text not null,
  updated_at timestamptz not null default now(),
  primary key (slug, locale)
);

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  namespace text not null,
  message_key text not null,
  locale text not null check (locale in ('en','de','tr','fr','ar','nl','ru')),
  value text not null,
  updated_at timestamptz not null default now(),
  unique (namespace, message_key, locale)
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  event_name public.analytics_event not null,
  path text not null,
  locale text not null,
  treatment_slug text,
  provider_slug text,
  created_at timestamptz not null default now()
);

create table public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.fx_rates (
  currency text primary key check (currency in ('EUR','USD','GBP','TRY')),
  rate numeric(12,4) not null,
  simulated boolean not null default true,
  as_of date not null,
  updated_at timestamptz not null default now()
);

create table public.flight_offers (
  id text primary key,
  is_demo boolean not null default true,
  origin text not null,
  destination text not null,
  airline text not null,
  depart_at timestamptz not null,
  arrive_at timestamptz not null,
  duration_minutes integer not null,
  price_eur integer not null,
  baggage text not null
);

create table public.hotel_offers (
  id text primary key,
  is_demo boolean not null default true,
  name text not null,
  city_slug text not null,
  rating numeric(2,1) not null,
  room_type text not null,
  price_per_night_eur integer not null,
  cancellation text not null
);

create table public.transfer_offers (
  id text primary key,
  is_demo boolean not null default true,
  city_slug text not null,
  route text not null,
  vehicle text not null,
  passengers integer not null,
  duration_minutes integer not null,
  price_eur integer not null
);

create table public.car_offers (
  id text primary key,
  is_demo boolean not null default true,
  name text not null,
  city_slug text not null,
  transmission text not null,
  seats integer not null,
  luggage integer not null,
  price_per_day_eur integer not null
);

create table public.esim_plans (
  id text primary key,
  is_demo boolean not null default true,
  name text not null,
  data_gb integer not null,
  days integer not null,
  price_eur integer not null,
  destination text not null default 'TR'
);

create table public.insurance_plans (
  id text primary key,
  is_demo boolean not null default true,
  name text not null,
  summary text not null,
  days integer not null,
  price_eur integer not null
);

create table public.experiences (
  id text primary key,
  is_demo boolean not null default true,
  city_slug text not null,
  name text not null,
  summary text not null,
  hours integer not null,
  price_eur integer not null
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null,
  message text not null check (char_length(message) between 10 and 2000),
  locale text not null,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (user_id, action, window_start)
);

create index providers_city_idx on public.providers (city_slug);
create index providers_deleted_idx on public.providers (deleted_at);
create index packages_provider_idx on public.packages (provider_id, treatment_slug);
create index requests_patient_idx on public.requests (patient_id, status);
create index requests_provider_idx on public.requests (provider_id, status);
create index journeys_patient_idx on public.journeys (patient_id);
create index messages_conversation_idx on public.messages (conversation_id, created_at);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index documents_owner_idx on public.documents (owner_id);
create index analytics_created_idx on public.analytics_events (created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and deleted_at is null);
$$;

create or replace function public.current_profile_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_provider_member(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.provider_members
    where provider_id = target and user_id = auth.uid()
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, preferred_language)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'locale', 'en'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role then
    raise exception 'role changes are admin-only';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role before update on public.profiles
for each row execute function public.protect_profile_role();

create or replace function public.protect_provider_trust()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.is_demo is distinct from old.is_demo
     or new.verification_status is distinct from old.verification_status
     or new.slug is distinct from old.slug then
    raise exception 'trust fields are admin-only';
  end if;
  return new;
end;
$$;

create trigger providers_protect_trust before update on public.providers
for each row execute function public.protect_provider_trust();

create or replace function public.audit_request_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events (request_id, actor_id, to_status)
    values (new.id, auth.uid(), new.status);
  elsif new.status is distinct from old.status then
    insert into public.request_events (request_id, actor_id, from_status, to_status)
    values (new.id, auth.uid(), old.status, new.status);
  end if;
  return new;
end;
$$;

create trigger requests_audit after insert or update on public.requests
for each row execute function public.audit_request_status();

create or replace function public.notify_new_request()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, kind, title, body, href)
  select pm.user_id, 'request', 'New request', 'A patient submitted a request.', '/provider'
  from public.provider_members pm
  where pm.provider_id = new.provider_id;
  return new;
end;
$$;

create trigger requests_notify after insert on public.requests
for each row execute function public.notify_new_request();

create or replace function public.notify_message()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  convo public.conversations;
begin
  select * into convo from public.conversations where id = new.conversation_id;
  insert into public.notifications (user_id, kind, title, body, href)
  select pm.user_id, 'message', 'New message', 'You have a new message.', '/messages'
  from public.provider_members pm
  where pm.provider_id = convo.provider_id and pm.user_id <> new.sender_id;
  if convo.patient_id <> new.sender_id then
    insert into public.notifications (user_id, kind, title, body, href)
    values (convo.patient_id, 'message', 'New message', 'You have a new message.', '/messages');
  end if;
  return new;
end;
$$;

create trigger messages_notify after insert on public.messages
for each row execute function public.notify_message();

create or replace function public.consume_rate_limit(action text, max_hits integer, window_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  window_start timestamptz;
  current_hits integer;
begin
  if auth.uid() is null then
    return false;
  end if;
  if action !~ '^[a-z_]{1,40}$' or max_hits < 1 or max_hits > 100 or window_seconds < 10 or window_seconds > 86400 then
    return false;
  end if;
  window_start := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);
  insert into public.rate_limits as rl (user_id, action, window_start, hits)
  values (auth.uid(), action, window_start, 1)
  on conflict (user_id, action, window_start)
  do update set hits = rl.hits + 1
  returning hits into current_hits;
  return current_hits <= max_hits;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_provider_member(uuid) to authenticated;
grant execute on function public.current_profile_role() to authenticated;
