
-- Create the push_subscriptions table
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- Optional, if logged in
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  expiration_time timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.push_subscriptions enable row level security;

-- Policies
-- 1. Review: Allow anon insert (since users might not be logged in for this app)
create policy "Allow anon insert" on public.push_subscriptions
  for insert with check (true);

-- 2. Allow users to read their own subscriptions (if needed later)
create policy "Allow users to read own" on public.push_subscriptions
  for select using (auth.uid() = user_id);
