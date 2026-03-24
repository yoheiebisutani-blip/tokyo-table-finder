-- Extend public.restaurants with additional nullable columns required by the
-- restaurant seed data. All columns are added with safe defaults and
-- IF NOT EXISTS guards so this migration can be re-run without failing.

alter table public.restaurants
  add column if not exists area_display_en text default '',
  add column if not exists area_display_ja text default '',
  add column if not exists cuisine_display_en text default '',
  add column if not exists cuisine_display_ja text default '',
  add column if not exists difficulty integer default 3 check (difficulty between 1 and 5),
  add column if not exists booking_method text default 'online',
  add column if not exists booking_tips_en text default '',
  add column if not exists english_support boolean default false,
  add column if not exists has_counter boolean default false,
  add column if not exists has_private_room boolean default false,
  add column if not exists tabelog_url text default '',
  add column if not exists google_maps_url text default '',
  add column if not exists website_url text default '',
  add column if not exists email text default '',
  add column if not exists address_en text default '',
  add column if not exists address_ja text default '',
  add column if not exists lunch_available boolean default true,
  add column if not exists dinner_available boolean default true,
  add column if not exists tags text[] default array[]::text[];
