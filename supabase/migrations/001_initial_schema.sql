-- ==========================================================
-- VISHNU HOME PRODUCTS - FULL SUPABASE DATABASE SCHEMA
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table if not exists products (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  slug         text not null unique,
  description  text,
  ingredients  text,
  storage      text,
  category     text not null,
  brand        text default 'Vishnu Home Products',
  images       text[],
  sizes        jsonb not null default '[]'::jsonb,
  -- sizes example: [{"label":"300g","price":120,"mrp":145},{"label":"500g","price":180,"mrp":210}]
  badge        text,
  -- badge values: 'SALE' | 'NEW' | 'HOT' | 'FESTIVE' | 'COASTAL' | null
  is_featured  boolean default false,
  in_stock     boolean default true,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

-- Allow anyone to read products
alter table products enable row level security;
drop policy if exists "Anyone can view products" on products;
create policy "Anyone can view products"
  on products for select using (true);

drop policy if exists "Service role manages products" on products;
create policy "Service role manages products"
  on products for all using (auth.role() = 'service_role');


-- 2. ORDERS TABLE
create table if not exists orders (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid references auth.users(id) on delete set null,
  items               jsonb not null,
  -- items: [{product_id, name, slug, size, qty, unit_price, image}]
  subtotal            numeric not null,
  delivery_fee        numeric not null default 0,
  discount            numeric not null default 0,
  total               numeric not null,
  coupon_code         text,
  status              text not null default 'pending',
  -- status: pending | confirmed | processing | shipped | delivered | cancelled | refunded
  payment_status      text not null default 'unpaid',
  -- payment_status: unpaid | paid | failed | refunded
  razorpay_order_id   text,
  razorpay_payment_id text,
  razorpay_signature  text,
  shipping_name       text not null,
  shipping_phone      text not null,
  shipping_email      text not null,
  shipping_address    jsonb not null,
  -- shipping_address: {line1, line2, city, state, pincode}
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table orders enable row level security;

drop policy if exists "Users see own orders" on orders;
create policy "Users see own orders"
  on orders for select
  using (auth.uid() = user_id);

drop policy if exists "Authenticated users can create orders" on orders;
create policy "Authenticated users can create orders"
  on orders for insert
  with check (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Service role updates orders" on orders;
create policy "Service role updates orders"
  on orders for update
  using (auth.role() = 'service_role');


-- 3. WISHLIST TABLE
create table if not exists wishlist (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table wishlist enable row level security;

drop policy if exists "Users manage own wishlist" on wishlist;
create policy "Users manage own wishlist"
  on wishlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 4. REVIEWS TABLE
create table if not exists reviews (
  id         uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete cascade not null,
  rating     integer not null check (rating >= 1 and rating <= 5),
  review     text,
  name       text not null,
  approved   boolean default false,
  created_at timestamptz default now(),
  unique(product_id, user_id)
);

alter table reviews enable row level security;

drop policy if exists "Anyone can read approved reviews" on reviews;
create policy "Anyone can read approved reviews"
  on reviews for select using (approved = true);

drop policy if exists "Authenticated users can submit reviews" on reviews;
create policy "Authenticated users can submit reviews"
  on reviews for insert
  with check (auth.uid() = user_id);


-- 5. COUPONS TABLE
create table if not exists coupons (
  id              uuid default gen_random_uuid() primary key,
  code            text not null unique,
  discount_type   text not null, -- 'percent' | 'fixed'
  discount_value  numeric not null,
  min_order       numeric default 0,
  max_uses        integer,
  used_count      integer default 0,
  active          boolean default true,
  expires_at      timestamptz,
  created_at      timestamptz default now()
);

alter table coupons enable row level security;

drop policy if exists "Service role manages coupons" on coupons;
create policy "Service role manages coupons"
  on coupons for all using (auth.role() = 'service_role');

-- Insert Initial Coupons
insert into coupons (code, discount_type, discount_value, min_order, active)
values
  ('VISHNU10', 'percent', 10, 0, true),
  ('MANGALORE50', 'fixed', 50, 499, true),
  ('FESTIVE15', 'percent', 15, 799, true)
on conflict (code) do nothing;
