-- Mosaic Labs — inquiry submissions.
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- 1. Contact information
  name          text not null,
  company       text not null,
  email         text not null,
  dial_code     text,
  phone         text,
  role          text,
  website       text,

  -- 2. About the project
  project_types text[] not null default '{}',
  project_other text,
  requirements  text not null,
  data_types    text[] not null default '{}',
  data_other    text,

  -- 3. Final
  notes         text,

  source        text,

  constraint inquiries_name_len     check (char_length(name) between 1 and 200),
  constraint inquiries_company_len  check (char_length(company) between 1 and 200),
  constraint inquiries_email_shape  check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  constraint inquiries_dial_shape   check (dial_code is null or dial_code ~ '^\+[0-9]{1,4}$'),
  constraint inquiries_requirements check (char_length(requirements) between 20 and 1500),
  constraint inquiries_notes_len    check (notes is null or char_length(notes) <= 800),
  constraint inquiries_has_project  check (array_length(project_types, 1) >= 1),
  constraint inquiries_has_data     check (array_length(data_types, 1) >= 1)
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

-- Row level security: the public site may write, and nothing more.
alter table public.inquiries enable row level security;

drop policy if exists "anon can submit inquiries" on public.inquiries;
create policy "anon can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Deliberately no select/update/delete policy: the anon key cannot read the
-- table back. Read submissions from the dashboard or with the service role key.
