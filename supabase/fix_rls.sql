
-- Fix RLS Policies for push_subscriptions
-- The previous error "violates row-level security policy" happened because 'upsert' needs UPDATE permission too.

-- 1. Reset Policies
drop policy if exists "Allow anon insert" on public.push_subscriptions;
drop policy if exists "Allow users to read own" on public.push_subscriptions;
drop policy if exists "Enable insert for all users" on public.push_subscriptions;
drop policy if exists "Enable update for all users" on public.push_subscriptions;
drop policy if exists "Enable select for all users" on public.push_subscriptions;

-- 2. Allow Everything (for now, since this is a public PWA without login)
create policy "Enable insert for all users" 
on public.push_subscriptions for insert 
with check (true);

create policy "Enable update for all users" 
on public.push_subscriptions for update 
using (true);

create policy "Enable select for all users" 
on public.push_subscriptions for select 
using (true);
