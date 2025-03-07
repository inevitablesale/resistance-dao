
create table if not exists journal_entries (
    id serial primary key,
    wallet_address text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for faster queries
create index if not exists journal_entries_wallet_address_idx on journal_entries(wallet_address);
create index if not exists journal_entries_created_at_idx on journal_entries(created_at);

-- Create policies for security
alter table journal_entries enable row level security;

-- Policy to allow users to only read their own entries
create policy "Users can view their own journal entries"
on journal_entries for select
using (wallet_address = auth.jwt() -> 'wallet_address');

-- Policy to allow users to insert their own entries
create policy "Users can insert their own journal entries"
on journal_entries for insert
with check (wallet_address = auth.jwt() -> 'wallet_address');
