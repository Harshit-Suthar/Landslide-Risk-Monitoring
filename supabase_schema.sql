-- NER Landslide Early Warning - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up tables and seed initial data.

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =========================================================
-- 1. USERS TABLE
-- =========================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('Admin', 'District Officer', 'Field Agent')),
  district text not null,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) for users
alter table public.users enable row level security;

-- Policies: allow read and write for authenticated users
create policy "Allow authenticated read users" on public.users
  for select using (true);

create policy "Allow authenticated insert users" on public.users
  for insert with check (true);

create policy "Allow authenticated update users" on public.users
  for update using (true);

create policy "Allow authenticated delete users" on public.users
  for delete using (true);

-- Seed initial users
insert into public.users (name, email, role, district, status)
values
  ('Dr. Arindam Sarmah', 'admin@ner-landslide.gov.in', 'Admin', 'Guwahati', 'Active'),
  ('Tsering Lhamo', 't.lhamo@arunachal.gov.in', 'District Officer', 'Itanagar', 'Active'),
  ('Lalremruata Sailo', 'l.sailo@mizoram.gov.in', 'District Officer', 'Aizawl', 'Active'),
  ('Kevisenuo Angami', 'k.angami@nagaland.gov.in', 'Field Agent', 'Kohima', 'Active'),
  ('Bantei Kharkongor', 'b.kharkongor@meghalaya.gov.in', 'District Officer', 'Shillong', 'Active'),
  ('Chinglen Meitei', 'c.meitei@manipur.gov.in', 'Field Agent', 'Imphal', 'Inactive')
on conflict (email) do nothing;


-- =========================================================
-- 2. LOCATIONS TABLE (Landslide Incidents & Monitoring Points)
-- =========================================================
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  district text not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  risk_level text not null check (risk_level in ('Low', 'Medium', 'High', 'Critical')),
  description text,
  status text not null default 'Monitored' check (status in ('Monitored', 'Resolved')),
  last_reported timestamptz default timezone('utc'::text, now()) not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) for locations
alter table public.locations enable row level security;

-- Policies: allow read and write for authenticated users
create policy "Allow authenticated read locations" on public.locations
  for select using (true);

create policy "Allow authenticated insert locations" on public.locations
  for insert with check (true);

create policy "Allow authenticated update locations" on public.locations
  for update using (true);

create policy "Allow authenticated delete locations" on public.locations
  for delete using (true);

-- Seed initial landslide monitoring locations across North Eastern Region
insert into public.locations (name, district, latitude, longitude, risk_level, description, status, last_reported)
values
  ('Nongthymmai Ridge', 'Shillong', 25.5682, 91.8933, 'Critical', 'Steep slope with heavy seepage observed following pre-monsoon downpour.', 'Monitored', now() - interval '2 hours'),
  ('NH-29 Kohima By-Pass', 'Kohima', 25.6747, 94.1103, 'High', 'Active subsidence along the highway corridor. Sinking zone active.', 'Monitored', now() - interval '5 hours'),
  ('Banderdewa Slope', 'Itanagar', 27.1264, 93.8188, 'Medium', 'Vegetation clearings on hillside causing mild erosion during rainfall.', 'Monitored', now() - interval '1 day'),
  ('Kamakhya Hill Western Flank', 'Guwahati', 26.1664, 91.7056, 'High', 'Dense settlement along fragile sandstone escarpment. Soil displacement detected.', 'Monitored', now() - interval '8 hours'),
  ('Durtlang Hills Sector 4', 'Aizawl', 23.7712, 92.7303, 'Critical', 'Massive vertical fractures visible in shale rock layers above road.', 'Monitored', now() - interval '45 minutes'),
  ('Baramura Hill Range', 'Agartala', 23.8315, 91.5645, 'Low', 'Stabilized roadside embankments with retaining walls intact.', 'Resolved', now() - interval '3 days'),
  ('Kangchup Foothills', 'Imphal', 24.8732, 93.8190, 'Medium', 'Seasonal stream overflow causing toe erosion at slope base.', 'Monitored', now() - interval '18 hours'),
  ('Tathangchen Ward', 'Gangtok', 27.3389, 98.6186, 'High', 'Perched water table causing pore pressure build-up along slope.', 'Monitored', now() - interval '4 hours');
