-- favorites table: stores user's favorite restaurants
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (user_id, restaurant_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

-- RLS policies: users can manage their own favorites
create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Index
create index idx_favorites_user on public.favorites (user_id);
