-- Enable RLS
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text not null default 'cashier',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories
create table public.categories (
  id text primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table public.products (
  id text primary key,
  name text not null,
  category_id text references public.categories(id) on delete set null,
  price numeric not null,
  cost numeric not null,
  stock integer not null default 0,
  barcode text unique,
  image text,
  unit text not null default 'piece',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tables
create table public.tables (
  id text primary key,
  number integer unique not null,
  capacity integer not null default 4,
  status text not null default 'available',
  current_order_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders
create table public.orders (
  id text primary key,
  table_id text references public.tables(id) on delete set null,
  table_number integer,
  customer_name text,
  customer_count integer,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  tax numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  payment_method text not null default 'cash',
  status text not null default 'pending',
  notes text,
  created_by text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
create table public.order_items (
  id text primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric not null,
  customizations jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Categories are insertable by authenticated users" on public.categories for insert with check (auth.role() = 'authenticated');
create policy "Categories are updatable by authenticated users" on public.categories for update using (auth.role() = 'authenticated');
create policy "Categories are deletable by authenticated users" on public.categories for delete using (auth.role() = 'authenticated');

create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Products are insertable by authenticated users" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Products are updatable by authenticated users" on public.products for update using (auth.role() = 'authenticated');
create policy "Products are deletable by authenticated users" on public.products for delete using (auth.role() = 'authenticated');

create policy "Tables are viewable by everyone" on public.tables for select using (true);
create policy "Tables are insertable by authenticated users" on public.tables for insert with check (auth.role() = 'authenticated');
create policy "Tables are updatable by authenticated users" on public.tables for update using (auth.role() = 'authenticated');
create policy "Tables are deletable by authenticated users" on public.tables for delete using (auth.role() = 'authenticated');

create policy "Orders are viewable by everyone" on public.orders for select using (true);
create policy "Orders are insertable by authenticated users" on public.orders for insert with check (auth.role() = 'authenticated');
create policy "Orders are updatable by authenticated users" on public.orders for update using (auth.role() = 'authenticated');
create policy "Orders are deletable by authenticated users" on public.orders for delete using (auth.role() = 'authenticated');

create policy "Order items are viewable by everyone" on public.order_items for select using (true);
create policy "Order items are insertable by authenticated users" on public.order_items for insert with check (auth.role() = 'authenticated');
create policy "Order items are updatable by authenticated users" on public.order_items for update using (auth.role() = 'authenticated');
create policy "Order items are deletable by authenticated users" on public.order_items for delete using (auth.role() = 'authenticated');
