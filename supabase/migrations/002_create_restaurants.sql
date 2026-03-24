-- restaurants table: stores restaurant information
create table if not exists public.restaurants (
  id uuid default gen_random_uuid() primary key,
  name_ja text not null,
  name_en text not null,
  description_ja text,
  description_en text,
  area text not null,
  cuisine text not null,
  budget_min integer,
  budget_max integer,
  address text,
  phone text,
  image_url text,
  is_premium boolean default false,
  rating numeric(2,1),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.restaurants enable row level security;

-- RLS policies: everyone can read, only service_role can modify
create policy "Anyone can view restaurants"
  on public.restaurants for select
  using (true);

-- Index for common queries
create index idx_restaurants_area on public.restaurants (area);
create index idx_restaurants_cuisine on public.restaurants (cuisine);
create index idx_restaurants_budget on public.restaurants (budget_min, budget_max);
