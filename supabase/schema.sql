-- ============================================================
-- Campus Companion — Supabase Schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`)
-- after creating a fresh project. Creates all tables, indexes,
-- constraints, and Row Level Security policies.
-- ============================================================
-- ---------- UNITS ----------
create table if not exists public.units (
    id uuid primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    code text,
    credits int not null default 3,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table public.units enable row level security;
drop policy if exists "Users manage own units" on public.units;
create policy "Users manage own units" on public.units for all using (auth.uid() = user_id);
-- ---------- TIMETABLE ----------
create table if not exists public.timetable (
    id uuid primary key,
    user_id uuid references auth.users on delete cascade not null,
    unit_id uuid references public.units(id) on delete cascade not null,
    day_of_week int not null check (
        day_of_week between 1 and 7
    ),
    start_time text not null,
    end_time text not null,
    room text,
    lecturer text,
    updated_at timestamptz default now()
);
alter table public.timetable enable row level security;
drop policy if exists "Users manage own timetable" on public.timetable;
create policy "Users manage own timetable" on public.timetable for all using (auth.uid() = user_id);
-- ---------- ASSIGNMENTS ----------
create table if not exists public.assignments (
    id uuid primary key,
    user_id uuid references auth.users on delete cascade not null,
    unit_id uuid references public.units(id) on delete cascade not null,
    title text not null,
    description text,
    due_date timestamptz not null,
    completed boolean default false,
    updated_at timestamptz default now()
);
alter table public.assignments enable row level security;
drop policy if exists "Users manage own assignments" on public.assignments;
create policy "Users manage own assignments" on public.assignments for all using (auth.uid() = user_id);
-- ---------- NOTES ----------
create table if not exists public.notes (
    id uuid primary key,
    user_id uuid references auth.users on delete cascade not null,
    unit_id uuid references public.units(id) on delete cascade not null,
    content text,
    updated_at timestamptz default now()
);
alter table public.notes enable row level security;
drop policy if exists "Users manage own notes" on public.notes;
create policy "Users manage own notes" on public.notes for all using (auth.uid() = user_id);
-- ---------- GPA ENTRIES ----------
-- NOTE: Using "gpaEntries" (camelCase) to match Dexie.
-- If your Supabase table is gpa_entries, change this to public.gpa_entries.
create table if not exists public."gpaEntries" (
    id uuid primary key,
    user_id uuid references auth.users on delete cascade not null,
    unit_id uuid references public.units(id) on delete cascade not null,
    percentage numeric not null check (
        percentage >= 0
        and percentage <= 100
    ),
    credits int not null,
    semester text not null,
    updated_at timestamptz default now()
);
alter table public."gpaEntries" enable row level security;
drop policy if exists "Users manage own gpa entries" on public."gpaEntries";
create policy "Users manage own gpa entries" on public."gpaEntries" for all using (auth.uid() = user_id);
-- ---------- INDEXES for sync performance ----------
create index if not exists idx_units_user_updated on public.units (user_id, updated_at);
create index if not exists idx_timetable_user_updated on public.timetable (user_id, updated_at);
create index if not exists idx_assignments_user_updated on public.assignments (user_id, updated_at);
create index if not exists idx_notes_user_updated on public.notes (user_id, updated_at);
create index if not exists idx_gpaEntries_user_updated on public."gpaEntries" (user_id, updated_at);