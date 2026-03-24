-- per_use_charges table: tracks single-message purchases
create table if not exists public.per_use_charges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  stripe_session_id text,
  is_used boolean default false,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.per_use_charges enable row level security;

-- RLS policies: users can only view their own charges
create policy "Users can view own charges"
  on public.per_use_charges for select
  using (auth.uid() = user_id);

-- Index
create index idx_per_use_charges_user on public.per_use_charges (user_id, is_used);
