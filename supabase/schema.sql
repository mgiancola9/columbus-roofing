-- ============================================================================
-- GTA Roofing Estimates — Supabase schema
-- Replicates the Columbus schema exactly so the existing CRM works unchanged.
-- Run this in the new GTA project's SQL Editor (Supabase Dashboard → SQL Editor).
--
-- NOTE: column names match Columbus (e.g. `zip_code`) so the CRM needs no changes.
-- The lead-insert path only writes: first_name, last_name, phone, email, address,
-- source, status — the rest are populated by the CRM as a lead moves down the pipeline.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- contractors — our roofing clients (your parents' GTA network)
-- ---------------------------------------------------------------------------
create table if not exists contractors (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  contact_name text,
  phone        text,
  email        text,
  zip_codes    text[] default '{}',      -- service-area postal/zip prefixes
  specialties  text[] default '{}',
  active       boolean default true,
  lead_cap     integer,
  notes        text,
  created_at   timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- leads — every form submission (status flows down the pipeline)
-- new → qualifying → qualified → sent → quoted → won / lost / bad
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  first_name    text,
  last_name     text,
  phone         text,
  email         text,
  address       text,
  zip_code      text,
  service_type  text,
  source        text,
  status        text default 'new',
  lead_score    integer,
  contractor_id uuid references contractors (id) on delete set null,
  notes         text,
  created_at    timestamptz default now(),
  qualified_at  timestamptz,
  sent_at       timestamptz,
  quoted_at     timestamptz,
  closed_at     timestamptz
);

create index if not exists leads_status_idx       on leads (status);
create index if not exists leads_created_at_idx    on leads (created_at desc);
create index if not exists leads_contractor_id_idx on leads (contractor_id);

-- ---------------------------------------------------------------------------
-- lead_activity — audit log of status changes and assignments
-- ---------------------------------------------------------------------------
create table if not exists lead_activity (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid references leads (id) on delete cascade,
  action       text,
  old_value    text,
  new_value    text,
  performed_by text,
  created_at   timestamptz default now()
);

create index if not exists lead_activity_lead_id_idx on lead_activity (lead_id);

-- ---------------------------------------------------------------------------
-- leads_with_contractor — view joining leads + contractor name (used by CRM)
-- ---------------------------------------------------------------------------
create or replace view leads_with_contractor as
select
  l.*,
  c.name         as contractor_name,
  c.contact_name as contractor_contact_name,
  c.phone        as contractor_phone
from leads l
left join contractors c on c.id = l.contractor_id;

-- ============================================================================
-- Row Level Security — OPEN policies for MVP (mirrors Columbus).
-- TODO before production: restrict the anon key to INSERT-only on `leads`,
-- and move the CRM to an authenticated Supabase session. See GTA-MIGRATION.md.
-- ============================================================================
alter table leads        enable row level security;
alter table contractors  enable row level security;
alter table lead_activity enable row level security;

drop policy if exists "open_all_leads" on leads;
create policy "open_all_leads" on leads
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "open_all_contractors" on contractors;
create policy "open_all_contractors" on contractors
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "open_all_lead_activity" on lead_activity;
create policy "open_all_lead_activity" on lead_activity
  for all to anon, authenticated using (true) with check (true);
