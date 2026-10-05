insert into public.destinations (slug) values
  ('istanbul'), ('ankara'), ('izmir'), ('antalya'), ('nevsehir'), ('gaziantep');

insert into public.treatment_categories (slug, sort_order) values
  ('hair', 1), ('dental', 2), ('aesthetic-procedures', 3), ('eye-treatments', 4), ('weight-management', 5), ('cosmetic-surgery', 6);

insert into public.treatments (slug, category_slug, status) values
  ('hair-transplant', 'hair', 'open'),
  ('dental-treatment', 'dental', 'open'),
  ('aesthetic-procedures', 'aesthetic-procedures', 'preview'),
  ('eye-treatments', 'eye-treatments', 'preview'),
  ('weight-management', 'weight-management', 'preview'),
  ('cosmetic-surgery', 'cosmetic-surgery', 'preview');

insert into public.providers (slug, name, city_slug, is_demo, verification_status, languages, treatment_slugs, summary) values
  ('demo-northlight-hair', 'DEMO Northlight Hair Atelier', 'istanbul', true, 'unverified', array['en','tr','de'], array['hair-transplant'], 'Fictional Istanbul atelier.'),
  ('demo-bosphorus-crown', 'DEMO Bosphorus Crown Studio', 'istanbul', true, 'unverified', array['en','tr'], array['hair-transplant'], 'Fictional studio.'),
  ('demo-aegean-strand', 'DEMO Aegean Strand Studio', 'izmir', true, 'unverified', array['en','de'], array['hair-transplant'], 'Fictional Izmir studio.'),
  ('demo-cappadocia-follicle', 'DEMO Cappadocia Follicle House', 'nevsehir', true, 'unverified', array['en','tr'], array['hair-transplant'], 'Fictional Cappadocia house.'),
  ('demo-golden-horn-smile', 'DEMO Golden Horn Smile Room', 'istanbul', true, 'unverified', array['en','tr','de'], array['dental-treatment'], 'Fictional dental room.'),
  ('demo-turquoise-enamel', 'DEMO Turquoise Enamel Studio', 'antalya', true, 'unverified', array['en','de','tr'], array['dental-treatment'], 'Fictional Antalya studio.'),
  ('demo-levant-dental', 'DEMO Levant Dental Atelier', 'izmir', true, 'unverified', array['en','tr'], array['dental-treatment'], 'Fictional Izmir atelier.'),
  ('demo-marmara-care', 'DEMO Marmara Care Collective', 'istanbul', true, 'unverified', array['en','tr','de'], array['hair-transplant','dental-treatment'], 'Fictional collective.');

insert into public.packages (provider_id, slug, treatment_slug, title, summary, price_eur, nights, includes_hotel, includes_transfer, includes_consultation, is_demo)
select p.id, v.slug, v.treatment_slug, v.title, 'Simulated package estimate. Not a quote.', v.price_eur, v.nights, v.includes_hotel, v.includes_transfer, true, true
from (values
  ('demo-northlight-plan', 'demo-northlight-hair', 'hair-transplant', 'Planning outline', 2400, 3, false, true),
  ('demo-bosphorus-plan', 'demo-bosphorus-crown', 'hair-transplant', 'Stay and transfer outline', 3100, 4, true, true),
  ('demo-aegean-plan', 'demo-aegean-strand', 'hair-transplant', 'Coastal outline', 1900, 2, false, true),
  ('demo-cappadocia-plan', 'demo-cappadocia-follicle', 'hair-transplant', 'Stone city outline', 2100, 3, true, true),
  ('demo-golden-plan', 'demo-golden-horn-smile', 'dental-treatment', 'Dental visit outline', 1600, 3, false, true),
  ('demo-turquoise-plan', 'demo-turquoise-enamel', 'dental-treatment', 'Coast dental outline', 1400, 4, true, false),
  ('demo-levant-plan', 'demo-levant-dental', 'dental-treatment', 'Aegean dental outline', 1750, 3, true, true),
  ('demo-marmara-hair-plan', 'demo-marmara-care', 'hair-transplant', 'Collective hair outline', 2600, 3, true, true),
  ('demo-marmara-dental-plan', 'demo-marmara-care', 'dental-treatment', 'Collective dental outline', 1500, 2, false, true)
) as v(slug, provider_slug, treatment_slug, title, price_eur, nights, includes_hotel, includes_transfer)
join public.providers p on p.slug = v.provider_slug;

insert into public.flight_offers (id, is_demo, origin, destination, airline, depart_at, arrive_at, duration_minutes, price_eur, baggage) values
  ('demo-fl-lhr-ist', true, 'LHR', 'IST', 'DEMO Northline', '2026-11-12T09:20:00Z', '2026-11-12T15:05:00Z', 225, 240, '1 cabin + 1 checked 23kg'),
  ('demo-fl-fra-ist', true, 'FRA', 'IST', 'DEMO Skybridge', '2026-11-12T11:10:00Z', '2026-11-12T15:40:00Z', 210, 210, '1 cabin + 1 checked 23kg'),
  ('demo-fl-cdg-ist', true, 'CDG', 'IST', 'DEMO Harbor Wings', '2026-11-18T07:40:00Z', '2026-11-18T12:20:00Z', 220, 230, '1 cabin + 1 checked 23kg'),
  ('demo-fl-ams-ist', true, 'AMS', 'IST', 'DEMO Northline', '2026-11-18T13:05:00Z', '2026-11-18T17:50:00Z', 225, 205, '1 cabin + 1 checked 23kg'),
  ('demo-fl-jfk-ist', true, 'JFK', 'IST', 'DEMO Cinder Air', '2026-11-20T16:30:00Z', '2026-11-21T09:10:00Z', 580, 640, '1 cabin + 1 checked 23kg'),
  ('demo-fl-dxb-ist', true, 'DXB', 'IST', 'DEMO Skybridge', '2026-11-14T08:15:00Z', '2026-11-14T12:05:00Z', 290, 280, '1 cabin + 1 checked 23kg'),
  ('demo-fl-ber-ayt', true, 'BER', 'AYT', 'DEMO Harbor Wings', '2026-11-16T06:50:00Z', '2026-11-16T11:20:00Z', 210, 190, '1 cabin + 1 checked 23kg'),
  ('demo-fl-zrh-adb', true, 'ZRH', 'ADB', 'DEMO Cinder Air', '2026-11-22T10:00:00Z', '2026-11-22T14:05:00Z', 185, 220, '1 cabin + 1 checked 23kg');

insert into public.hotel_offers (id, is_demo, name, city_slug, rating, room_type, price_per_night_eur, cancellation) values
  ('demo-pera-house', true, 'DEMO Pera House', 'istanbul', 4.6, 'DEMO quiet double', 180, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-galata-rooms', true, 'DEMO Galata Rooms', 'istanbul', 4.4, 'DEMO quiet double', 150, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-karakoy-quay', true, 'DEMO Karakoy Quay', 'istanbul', 4.7, 'DEMO quiet double', 210, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-besiktas-court', true, 'DEMO Besiktas Court', 'istanbul', 4.5, 'DEMO quiet double', 170, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-antalya-shore', true, 'DEMO Antalya Shore Inn', 'antalya', 4.5, 'DEMO quiet double', 160, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-izmir-bay', true, 'DEMO Izmir Bay Lodge', 'izmir', 4.3, 'DEMO quiet double', 120, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-stone-court', true, 'DEMO Stone Court', 'nevsehir', 4.8, 'DEMO quiet double', 190, 'Simulation only: cancel up to 48 hours before arrival.'),
  ('demo-ankara-park', true, 'DEMO Ankara Park Rooms', 'ankara', 4.2, 'DEMO quiet double', 110, 'Simulation only: cancel up to 48 hours before arrival.');

insert into public.transfer_offers (id, is_demo, city_slug, route, vehicle, passengers, duration_minutes, price_eur) values
  ('demo-tr-ist-air-hotel', true, 'istanbul', 'airport_hotel', 'DEMO sedan', 3, 55, 45),
  ('demo-tr-ist-hotel-clinic', true, 'istanbul', 'hotel_clinic', 'DEMO sedan', 3, 30, 28),
  ('demo-tr-ist-clinic-hotel', true, 'istanbul', 'clinic_hotel', 'DEMO sedan', 3, 30, 28),
  ('demo-tr-ist-hotel-air', true, 'istanbul', 'hotel_airport', 'DEMO van', 6, 60, 62),
  ('demo-tr-ayt-air-hotel', true, 'antalya', 'airport_hotel', 'DEMO sedan', 3, 35, 32),
  ('demo-tr-ayt-hotel-air', true, 'antalya', 'hotel_airport', 'DEMO van', 6, 40, 48);

insert into public.car_offers (id, is_demo, name, city_slug, transmission, seats, luggage, price_per_day_eur) values
  ('demo-car-city', true, 'DEMO City Compact', 'istanbul', 'automatic', 5, 2, 42),
  ('demo-car-estate', true, 'DEMO Estate', 'istanbul', 'automatic', 5, 4, 68),
  ('demo-car-aegean', true, 'DEMO Aegean Hatch', 'izmir', 'manual', 5, 2, 36),
  ('demo-car-coast', true, 'DEMO Coast Wagon', 'antalya', 'automatic', 5, 3, 54),
  ('demo-car-stone', true, 'DEMO Stone SUV', 'nevsehir', 'automatic', 5, 4, 79),
  ('demo-car-capital', true, 'DEMO Capital Sedan', 'ankara', 'automatic', 5, 3, 48);

insert into public.esim_plans (id, is_demo, name, data_gb, days, price_eur) values
  ('demo-esim-5', true, 'DEMO Türkiye Data Pass 5GB', 5, 7, 12),
  ('demo-esim-10', true, 'DEMO Türkiye Data Pass 10GB', 10, 15, 18),
  ('demo-esim-20', true, 'DEMO Türkiye Data Pass 20GB', 20, 30, 29);

insert into public.insurance_plans (id, is_demo, name, summary, days, price_eur) values
  ('demo-cover-outline', true, 'DEMO travel cover outline', 'Not a policy and not medical cover.', 14, 36),
  ('demo-cover-extended', true, 'DEMO extended stay outline', 'Not an insurance contract.', 30, 58);

insert into public.experiences (id, is_demo, city_slug, name, summary, hours, price_eur) values
  ('demo-exp-bosphorus', true, 'istanbul', 'DEMO Bosphorus hour', 'Fictional hosted hour.', 4, 70),
  ('demo-exp-bazaar', true, 'istanbul', 'DEMO bazaar walk', 'Fictional hosted hour.', 3, 40),
  ('demo-exp-agora', true, 'izmir', 'DEMO agora morning', 'Fictional hosted hour.', 3, 35),
  ('demo-exp-coast', true, 'antalya', 'DEMO coast path', 'Fictional hosted hour.', 4, 45),
  ('demo-exp-oldtown', true, 'antalya', 'DEMO old-town lanes', 'Fictional hosted hour.', 2, 25),
  ('demo-exp-dawn', true, 'nevsehir', 'DEMO valley dawn', 'Fictional hosted hour.', 3, 80),
  ('demo-exp-valley', true, 'nevsehir', 'DEMO valley terrace', 'Fictional hosted hour.', 2, 30),
  ('demo-exp-citadel', true, 'ankara', 'DEMO citadel hour', 'Fictional hosted hour.', 2, 28),
  ('demo-exp-kitchen', true, 'gaziantep', 'DEMO kitchen table', 'Fictional hosted hour.', 3, 55),
  ('demo-exp-mosaic', true, 'gaziantep', 'DEMO mosaic room', 'Fictional hosted hour.', 2, 22);

insert into public.commission_rules (service, mode, value, provider_slug) values
  ('treatment', 'percentage', 8, null),
  ('hotel', 'percentage', 5, null),
  ('transfer', 'percentage', 6, null),
  ('car', 'percentage', 4, null),
  ('esim', 'percentage', 10, null),
  ('insurance', 'percentage', 0, null),
  ('experience', 'percentage', 7, null),
  ('treatment', 'percentage', 6, 'demo-marmara-care');

insert into public.fx_rates (currency, rate, simulated, as_of) values
  ('EUR', 1, true, '2026-10-01'),
  ('USD', 1.08, true, '2026-10-01'),
  ('GBP', 0.85, true, '2026-10-01'),
  ('TRY', 47.2, true, '2026-10-01');

insert into public.admin_settings (key, value) values
  ('demo_mode', '{"enabled": true, "label": "DEMO / SIMULATION"}'::jsonb);

insert into public.coupons (code, percent_off, active) values ('DEMO10', 10, false);
