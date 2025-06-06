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

-- Create user sandbox sessions table
create table user_sandbox_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  app_name text not null unique,
  sandbox_url text not null,
  sandbox_password text not null,
  session_start_time timestamp with time zone default now(),
  session_duration_minutes integer default 30,
  session_expired boolean default false,
  deployment_status text default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create an index for faster user lookups
create index user_sandbox_sessions_user_id_idx on user_sandbox_sessions(user_id);

-- Create a policy for users to access their own sessions
create policy "Users can view their own sessions"
  on user_sandbox_sessions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on user_sandbox_sessions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on user_sandbox_sessions
  for update
  using (auth.uid() = user_id);

-- Enable RLS
alter table user_sandbox_sessions enable row level security;
