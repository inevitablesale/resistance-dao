
-- Create user_profiles table for storing user profile information
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  address text not null unique,
  subdomain_handle text,
  linkedin_url text,
  email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index on address for faster lookups
create index if not exists user_profiles_address_idx on public.user_profiles (address);

-- Set up Row Level Security
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view any profile"
  on public.user_profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (address = auth.jwt() -> 'sub' or auth.role() = 'anon');

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (address = auth.jwt() -> 'sub' or auth.role() = 'anon')
  with check (address = auth.jwt() -> 'sub' or auth.role() = 'anon');
