-- passes table: stores user subscription passes
create table if not exists public.passes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  pass_type text not null check (pass_type in ('7day', '14day', '30day')),
  stripe_session_id text,
  starts_at timestamptz default now() not null,
  expires_at timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.passes enable row level security;

-- RLS policies: users can only view their own passes
create policy "Users can view own passes"
  on public.passes for select
  using (auth.uid() = user_id);

-- Index for active pass lookup
create index idx_passes_user_active on public.passes (user_id, is_active, expires_at);
