-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  business_name text,
  phone text,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text check (subscription_status in ('active', 'inactive', 'trialing', 'canceled')),
  subscription_plan text check (subscription_plan in ('monthly', 'yearly')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Clients table
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  last_interaction date,
  status text default 'active' check (status in ('active', 'inactive', 'prospect')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Devis (quotes) table
create table public.devis (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  title text not null,
  amount numeric(10, 2),
  status text default 'pending' check (status in ('pending', 'signed', 'refused', 'expired')),
  sent_at date not null,
  signed_at date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Relances (follow-ups) table
create table public.relances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  devis_id uuid references public.devis(id) on delete set null,
  type text not null check (type in ('devis', 'inactif', 'avis')),
  channel text not null check (channel in ('email', 'sms')),
  status text default 'sent' check (status in ('sent', 'responded', 'failed')),
  sent_at timestamptz not null,
  responded_at timestamptz,
  created_at timestamptz default now() not null
);

-- Avis (reviews) table
create table public.avis (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  requested_at timestamptz not null,
  responded boolean default false,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.devis enable row level security;
alter table public.relances enable row level security;
alter table public.avis enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Clients policies
create policy "Users can view own clients" on public.clients
  for select using (auth.uid() = user_id);

create policy "Users can insert own clients" on public.clients
  for insert with check (auth.uid() = user_id);

create policy "Users can update own clients" on public.clients
  for update using (auth.uid() = user_id);

create policy "Users can delete own clients" on public.clients
  for delete using (auth.uid() = user_id);

-- Devis policies
create policy "Users can view own devis" on public.devis
  for select using (auth.uid() = user_id);

create policy "Users can insert own devis" on public.devis
  for insert with check (auth.uid() = user_id);

create policy "Users can update own devis" on public.devis
  for update using (auth.uid() = user_id);

create policy "Users can delete own devis" on public.devis
  for delete using (auth.uid() = user_id);

-- Relances policies
create policy "Users can view own relances" on public.relances
  for select using (auth.uid() = user_id);

create policy "Users can insert own relances" on public.relances
  for insert with check (auth.uid() = user_id);

create policy "Users can update own relances" on public.relances
  for update using (auth.uid() = user_id);

-- Avis policies
create policy "Users can view own avis" on public.avis
  for select using (auth.uid() = user_id);

create policy "Users can insert own avis" on public.avis
  for insert with check (auth.uid() = user_id);

create policy "Users can update own avis" on public.avis
  for update using (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_clients_updated_at before update on public.clients
  for each row execute procedure public.handle_updated_at();

create trigger handle_devis_updated_at before update on public.devis
  for each row execute procedure public.handle_updated_at();
