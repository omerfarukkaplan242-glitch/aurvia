alter table public.profiles enable row level security;
alter table public.patient_preferences enable row level security;
alter table public.treatment_categories enable row level security;
alter table public.treatments enable row level security;
alter table public.destinations enable row level security;
alter table public.providers enable row level security;
alter table public.provider_members enable row level security;
alter table public.packages enable row level security;
alter table public.provider_availability enable row level security;
alter table public.requests enable row level security;
alter table public.request_events enable row level security;
alter table public.journeys enable row level security;
alter table public.bookings enable row level security;
alter table public.trip_drafts enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.documents enable row level security;
alter table public.commission_rules enable row level security;
alter table public.commission_entries enable row level security;
alter table public.transactions enable row level security;
alter table public.coupons enable row level security;
alter table public.content_pages enable row level security;
alter table public.translations enable row level security;
alter table public.analytics_events enable row level security;
alter table public.admin_settings enable row level security;
alter table public.fx_rates enable row level security;
alter table public.flight_offers enable row level security;
alter table public.hotel_offers enable row level security;
alter table public.transfer_offers enable row level security;
alter table public.car_offers enable row level security;
alter table public.esim_plans enable row level security;
alter table public.insurance_plans enable row level security;
alter table public.experiences enable row level security;
alter table public.contact_messages enable row level security;
alter table public.rate_limits enable row level security;

grant select on public.treatment_categories, public.treatments, public.destinations, public.providers, public.packages, public.provider_availability, public.flight_offers, public.hotel_offers, public.transfer_offers, public.car_offers, public.esim_plans, public.insurance_plans, public.experiences, public.fx_rates, public.content_pages, public.coupons to anon, authenticated;
grant select, insert, update on public.profiles, public.patient_preferences, public.requests, public.journeys, public.bookings, public.trip_drafts, public.conversations, public.messages, public.notifications, public.documents, public.transactions to authenticated;
grant select, insert on public.analytics_events, public.contact_messages to anon, authenticated;
grant select on public.analytics_events, public.contact_messages, public.request_events, public.commission_entries, public.translations, public.admin_settings, public.provider_members, public.commission_rules to authenticated;
grant insert, update on public.packages, public.providers, public.provider_availability, public.commission_rules, public.content_pages, public.translations, public.admin_settings, public.coupons to authenticated;
grant select, insert on public.conversations, public.messages to authenticated;

create policy categories_read on public.treatment_categories for select to anon, authenticated using (true);
create policy treatments_read on public.treatments for select to anon, authenticated using (true);
create policy destinations_read on public.destinations for select to anon, authenticated using (true);
create policy fx_read on public.fx_rates for select to anon, authenticated using (true);
create policy content_read on public.content_pages for select to anon, authenticated using (true);
create policy coupons_read on public.coupons for select to anon, authenticated using (active or public.is_admin());

create policy providers_read on public.providers for select to anon, authenticated using (deleted_at is null or public.is_admin() or public.is_provider_member(id));
create policy providers_update on public.providers for update to authenticated using (public.is_provider_member(id)) with check (public.is_provider_member(id));
create policy providers_admin_insert on public.providers for insert to authenticated with check (public.is_admin());

create policy packages_read on public.packages for select to anon, authenticated using (deleted_at is null or public.is_admin());
create policy packages_update on public.packages for update to authenticated using (public.is_provider_member(provider_id)) with check (public.is_provider_member(provider_id));
create policy availability_read on public.provider_availability for select to anon, authenticated using (true);
create policy availability_write on public.provider_availability for insert to authenticated with check (public.is_provider_member(provider_id));

create policy members_read on public.provider_members for select to authenticated using (user_id = auth.uid() or public.is_admin() or public.is_provider_member(provider_id));

create policy profiles_select on public.profiles for select to authenticated
using (
  id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.requests r
    join public.provider_members pm on pm.provider_id = r.provider_id
    where r.patient_id = profiles.id and pm.user_id = auth.uid() and r.deleted_at is null
  )
);
create policy profiles_update on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check ((id = auth.uid() and role = public.current_profile_role()) or public.is_admin());

create policy prefs_own on public.patient_preferences for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy requests_select on public.requests for select to authenticated
using (patient_id = auth.uid() or public.is_admin() or public.is_provider_member(provider_id));
create policy requests_insert on public.requests for insert to authenticated
with check (patient_id = auth.uid() and status = 'submitted');
create policy requests_update on public.requests for update to authenticated
using (public.is_admin() or public.is_provider_member(provider_id) or patient_id = auth.uid())
with check (public.is_admin() or public.is_provider_member(provider_id) or (patient_id = auth.uid() and status in ('submitted', 'cancelled')));

create policy request_events_read on public.request_events for select to authenticated
using (
  public.is_admin() or exists (
    select 1 from public.requests r
    where r.id = request_id and (r.patient_id = auth.uid() or public.is_provider_member(r.provider_id))
  )
);

create policy journeys_all on public.journeys for all to authenticated
using (patient_id = auth.uid() or public.is_admin() or public.is_provider_member(provider_id))
with check (patient_id = auth.uid() or public.is_admin() or public.is_provider_member(provider_id));

create policy bookings_all on public.bookings for all to authenticated
using (patient_id = auth.uid() or public.is_admin())
with check (patient_id = auth.uid() or public.is_admin());

create policy drafts_own on public.trip_drafts for all to authenticated
using (patient_id = auth.uid() or public.is_admin())
with check (patient_id = auth.uid() or public.is_admin());

create policy conversations_rw on public.conversations for all to authenticated
using (patient_id = auth.uid() or public.is_admin() or public.is_provider_member(provider_id))
with check (patient_id = auth.uid() or public.is_admin() or public.is_provider_member(provider_id));

create policy messages_select on public.messages for select to authenticated
using (exists (
  select 1 from public.conversations c
  where c.id = conversation_id and (c.patient_id = auth.uid() or public.is_admin() or public.is_provider_member(c.provider_id))
));
create policy messages_insert on public.messages for insert to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.patient_id = auth.uid() or public.is_provider_member(c.provider_id) or public.is_admin())
  )
);

create policy notifications_own on public.notifications for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy notifications_read on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy documents_rw on public.documents for all to authenticated
using (
  owner_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.requests r
    where r.id = documents.request_id and public.is_provider_member(r.provider_id)
  )
)
with check (owner_id = auth.uid() or public.is_admin());

create policy rules_read on public.commission_rules for select to authenticated using (public.is_admin() or exists (select 1 from public.provider_members pm where pm.user_id = auth.uid()));
create policy rules_admin on public.commission_rules for insert to authenticated with check (public.is_admin());
create policy rules_admin_update on public.commission_rules for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy entries_read on public.commission_entries for select to authenticated using (public.is_admin() or public.is_provider_member(provider_id));

create policy tx_read on public.transactions for select to authenticated using (patient_id = auth.uid() or public.is_admin());
create policy tx_insert on public.transactions for insert to authenticated with check (patient_id = auth.uid() or public.is_admin());

create policy analytics_insert on public.analytics_events for insert to anon, authenticated
with check (user_id is null or user_id = auth.uid());
create policy analytics_admin on public.analytics_events for select to authenticated using (public.is_admin());

create policy contact_insert on public.contact_messages for insert to anon, authenticated with check (char_length(message) >= 10);
create policy contact_admin on public.contact_messages for select to authenticated using (public.is_admin());

create policy settings_admin on public.admin_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy translations_read on public.translations for select to anon, authenticated using (true);
create policy translations_admin on public.translations for insert to authenticated with check (public.is_admin());
create policy translations_admin_update on public.translations for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy content_admin on public.content_pages for insert to authenticated with check (public.is_admin());
create policy content_admin_update on public.content_pages for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy flights_read on public.flight_offers for select to anon, authenticated using (true);
create policy hotels_read on public.hotel_offers for select to anon, authenticated using (true);
create policy transfers_read on public.transfer_offers for select to anon, authenticated using (true);
create policy cars_read on public.car_offers for select to anon, authenticated using (true);
create policy esim_read on public.esim_plans for select to anon, authenticated using (true);
create policy insurance_read on public.insurance_plans for select to anon, authenticated using (true);
create policy experiences_read on public.experiences for select to anon, authenticated using (true);
create policy inventory_admin_flights on public.flight_offers for insert to authenticated with check (public.is_admin());
create policy inventory_admin_hotels on public.hotel_offers for insert to authenticated with check (public.is_admin());
create policy inventory_admin_transfers on public.transfer_offers for insert to authenticated with check (public.is_admin());
create policy inventory_admin_cars on public.car_offers for insert to authenticated with check (public.is_admin());
create policy inventory_admin_experiences on public.experiences for insert to authenticated with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 10485760, array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy documents_storage_read on storage.objects for select to authenticated
using (bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy documents_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy documents_storage_delete on storage.objects for delete to authenticated
using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
