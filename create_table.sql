create table api_keys (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  stripe_customer_id text not null,
  api_key uuid not null unique,
  revoked boolean default false,
  created_at timestamp with time zone default now()
);

-- Create an index for faster API key lookups
create index api_keys_api_key_idx on api_keys(api_key);

-- Create a policy that allows the service role to access everything
create policy "Service role full access"
  on api_keys
  for all
  using (true)
  with check (true);

-- Enable RLS but allow the service role to bypass
alter table api_keys enable row level security;
