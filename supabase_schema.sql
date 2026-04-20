-- Create event requests table
create table public.event_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  full_name text not null,
  event_name text not null,
  booking_person_details text,
  description text,
  pricing_details text,
  media_url text,
  status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup RLS (Row Level Security) and Policies
alter table public.event_requests enable row level security;

-- Policy: Everyone can read approved events
create policy "Public can read approved events"
  on public.event_requests for select
  using (status = 'approved');

-- Policy: Authenticated users can insert their own requests
create policy "Users can insert their own requests"
  on public.event_requests for insert
  with check (auth.uid() = user_id);

-- Policy: Authenticated users can view their own requests
create policy "Users can view their own requests"
  on public.event_requests for select
  using (auth.uid() = user_id);

-- Policy: Allow update for users (e.g. coordinators/admins). For simplicity, we can let authenticated users update their own pending requests, or assume coordinators will have a bypassed RLS logic (or specific role). Let's just allow all authenticated users to update for testing via UI, then restict later if needed.
create policy "Anyone can update events (Test Mode)"
  on public.event_requests for update
  using (true);

-- Create storage bucket for event media
insert into storage.buckets (id, name, public) values ('event-media', 'event-media', true);

-- Storage bucket policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'event-media' );

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check ( bucket_id = 'event-media' AND auth.role() = 'authenticated' );
