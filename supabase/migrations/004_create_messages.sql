-- generated_messages table: stores AI-generated reservation messages
create table if not exists public.generated_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  restaurant_name text not null,
  message_ja text not null,
  message_en text not null,
  reservation_date date,
  reservation_time text,
  party_size integer,
  special_requests text,
  allergies text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.generated_messages enable row level security;

-- RLS policies: users can view and create their own messages
create policy "Users can view own messages"
  on public.generated_messages for select
  using (auth.uid() = user_id);

create policy "Users can create own messages"
  on public.generated_messages for insert
  with check (auth.uid() = user_id);

-- Index
create index idx_messages_user on public.generated_messages (user_id, created_at desc);
