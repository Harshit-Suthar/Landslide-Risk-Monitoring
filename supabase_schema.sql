-- ==============================================================================
-- NER Landslide Early Warning & Risk Monitoring System
-- Complete Supabase PostgreSQL Schema & Initial Data Seeder
-- Instructions: Paste and execute this entire script into your Supabase SQL Editor.
-- ==============================================================================

-- 1. Enable required extensions
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. USERS TABLE
-- ==============================================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('Admin', 'District Officer', 'Field Agent', 'Citizen')),
  district text not null default 'Shillong',
  phone text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Policies for public.users
drop policy if exists "Allow read users" on public.users;
create policy "Allow read users" on public.users
  for select using (true);

drop policy if exists "Allow insert users" on public.users;
create policy "Allow insert users" on public.users
  for insert with check (true);

drop policy if exists "Allow update users" on public.users;
create policy "Allow update users" on public.users
  for update using (true);

drop policy if exists "Allow delete users" on public.users;
create policy "Allow delete users" on public.users
  for delete using (true);

-- Seed initial admin and field staff users
insert into public.users (name, email, role, district, phone, status)
values
  ('Dr. Arindam Sarmah', 'admin@ner-landslide.gov.in', 'Admin', 'Guwahati', '+91 98640 12345', 'Active'),
  ('Tsering Lhamo', 't.lhamo@arunachal.gov.in', 'District Officer', 'Itanagar', '+91 94360 23456', 'Active'),
  ('Lalremruata Sailo', 'l.sailo@mizoram.gov.in', 'District Officer', 'Aizawl', '+91 94361 34567', 'Active'),
  ('Kevisenuo Angami', 'k.angami@nagaland.gov.in', 'Field Agent', 'Kohima', '+91 94362 45678', 'Active'),
  ('Bantei Kharkongor', 'b.kharkongor@meghalaya.gov.in', 'District Officer', 'Shillong', '+91 94363 56789', 'Active'),
  ('Priya Sharma', 'priya.sharma@example.com', 'Citizen', 'Shillong', '+91 98765 43210', 'Active'),
  ('Chinglen Meitei', 'c.meitei@manipur.gov.in', 'Field Agent', 'Imphal', '+91 94364 67890', 'Inactive')
on conflict (email) do nothing;


-- ==============================================================================
-- 3. LOCATIONS TABLE (Monitored Landslide Spots & Geotechnical Hotspots)
-- ==============================================================================
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

-- Enable Row Level Security (RLS)
alter table public.locations enable row level security;

-- Policies for public.locations (Public read access so visitors can view maps)
drop policy if exists "Allow read locations" on public.locations;
create policy "Allow read locations" on public.locations
  for select using (true);

drop policy if exists "Allow insert locations" on public.locations;
create policy "Allow insert locations" on public.locations
  for insert with check (true);

drop policy if exists "Allow update locations" on public.locations;
create policy "Allow update locations" on public.locations
  for update using (true);

drop policy if exists "Allow delete locations" on public.locations;
create policy "Allow delete locations" on public.locations
  for delete using (true);

-- Seed initial landslide monitoring locations across the 8 North Eastern States
insert into public.locations (name, district, latitude, longitude, risk_level, description, status, last_reported)
values
  ('Nongthymmai Ridge', 'Shillong', 25.5682, 91.8933, 'Critical', 'Steep slope with heavy seepage observed following pre-monsoon downpour.', 'Monitored', now() - interval '2 hours'),
  ('NH-29 Kohima By-Pass', 'Kohima', 25.6747, 94.1103, 'High', 'Active subsidence along the highway corridor. Sinking zone active.', 'Monitored', now() - interval '5 hours'),
  ('Banderdewa Slope', 'Itanagar', 27.1264, 93.8188, 'Medium', 'Vegetation clearings on hillside causing mild erosion during rainfall.', 'Monitored', now() - interval '1 day'),
  ('Kamakhya Hill Western Flank', 'Guwahati', 26.1664, 91.7056, 'High', 'Dense settlement along fragile sandstone escarpment. Soil displacement detected.', 'Monitored', now() - interval '8 hours'),
  ('Durtlang Hills Sector 4', 'Aizawl', 23.7712, 92.7303, 'Critical', 'Massive vertical fractures visible in shale rock layers above road.', 'Monitored', now() - interval '45 minutes'),
  ('Baramura Hill Range', 'Agartala', 23.8315, 91.5645, 'Low', 'Stabilized roadside embankments with retaining walls intact.', 'Resolved', now() - interval '3 days'),
  ('Kangchup Foothills', 'Imphal', 24.8732, 93.8190, 'Medium', 'Seasonal stream overflow causing toe erosion at slope base.', 'Monitored', now() - interval '18 hours'),
  ('Tathangchen Ward', 'Gangtok', 27.3389, 88.6065, 'High', 'Perched water table causing pore pressure build-up along slope.', 'Monitored', now() - interval '4 hours');


-- ==============================================================================
-- 4. REPORTS TABLE (Citizen Incident Reports & Field Verifications)
-- ==============================================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  incident_type text not null check (incident_type in ('Landslide', 'Slope Crack', 'Road Blockage', 'Flooding', 'Other')),
  latitude numeric(9,6),
  longitude numeric(9,6),
  district text not null,
  description text not null,
  media_url text,
  severity text not null check (severity in ('Minor', 'Moderate', 'Severe')),
  status text not null default 'Pending' check (status in ('Pending', 'Verified', 'Rejected')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.reports enable row level security;

-- Policies for public.reports
drop policy if exists "Allow read reports" on public.reports;
create policy "Allow read reports" on public.reports
  for select using (true);

drop policy if exists "Allow insert reports" on public.reports;
create policy "Allow insert reports" on public.reports
  for insert with check (true);

drop policy if exists "Allow update reports" on public.reports;
create policy "Allow update reports" on public.reports
  for update using (true);

drop policy if exists "Allow delete reports" on public.reports;
create policy "Allow delete reports" on public.reports
  for delete using (true);

-- Seed initial sample incident reports
insert into public.reports (incident_type, latitude, longitude, district, description, severity, status, created_at)
values
  ('Road Blockage', 25.6747, 94.1103, 'Kohima', 'Heavy rotational slide and rockfall blocking both lanes near Pagla Pahar.', 'Severe', 'Verified', now() - interval '25 minutes'),
  ('Slope Crack', 23.7712, 92.7303, 'Aizawl', 'New 20cm tensile crack opened above municipal residential road.', 'Severe', 'Verified', now() - interval '1 hour'),
  ('Landslide', 25.5682, 91.8933, 'Shillong', 'Retaining wall collapse with 15 cubic meters of saturated sandstone slip.', 'Moderate', 'Verified', now() - interval '2 hours'),
  ('Slope Crack', 26.1664, 91.7056, 'Guwahati', 'Fissures detected along hillside steps leading down to residential lane.', 'Moderate', 'Pending', now() - interval '4 hours'),
  ('Flooding', 24.8732, 93.8190, 'Imphal', 'Flash stream runoff eroding hillside culvert and access road berm.', 'Minor', 'Pending', now() - interval '6 hours');


-- ==============================================================================
-- 5. SUPABASE STORAGE (Public Bucket: incident-media)
-- ==============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'incident-media',
  'incident-media',
  true,
  52428800, -- 50MB limit per photo/video
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

-- Storage Policies for incident-media bucket
drop policy if exists "Public Access to Incident Media" on storage.objects;
create policy "Public Access to Incident Media"
  on storage.objects for select
  using ( bucket_id = 'incident-media' );

drop policy if exists "Allow Uploads to Incident Media" on storage.objects;
create policy "Allow Uploads to Incident Media"
  on storage.objects for insert
  with check ( bucket_id = 'incident-media' );

drop policy if exists "Allow Updates to Incident Media" on storage.objects;
create policy "Allow Updates to Incident Media"
  on storage.objects for update
  using ( bucket_id = 'incident-media' );


-- ==============================================================================
-- 6. AUTOMATIC USER SYNC (Auth Signup -> Public Users Table)
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role, district, phone, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'Citizen'),
    coalesce(new.raw_user_meta_data->>'district', 'Shillong'),
    new.raw_user_meta_data->>'phone',
    'Active'
  )
  on conflict (email) do update set
    name = excluded.name,
    role = excluded.role,
    district = excluded.district,
    phone = excluded.phone;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run after new Supabase auth sign-up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
