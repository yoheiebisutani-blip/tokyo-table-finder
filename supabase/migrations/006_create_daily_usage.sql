-- daily_usage table: tracks daily AI recommendation usage for free users
create table if not exists public.daily_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  usage_date date default current_date not null,
  recommend_count integer default 0 not null,
  created_at timestamptz default now() not null,
  unique (user_id, usage_date)
);

-- Enable RLS
alter table public.daily_usage enable row level security;

-- RLS policies: users can only view their own usage
create policy "Users can view own usage"
  on public.daily_usage for select
  using (auth.uid() = user_id);

-- Index
create index idx_daily_usage_user_date on public.daily_usage (user_id, usage_date);
