-- ================================================================
-- IEEE Quest Career 1.0 - Event Registrations Table
-- Run this SQL in Supabase Dashboard > SQL Editor
-- ================================================================

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  national_id TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  college TEXT NOT NULL,
  university TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraints for duplicate prevention
ALTER TABLE public.event_registrations
  ADD CONSTRAINT unique_event_reg_email UNIQUE (email),
  ADD CONSTRAINT unique_event_reg_phone UNIQUE (phone),
  ADD CONSTRAINT unique_event_reg_national_id UNIQUE (national_id);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public registration form)
CREATE POLICY "Allow anonymous inserts on event_registrations"
  ON public.event_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous selects (for duplicate checking)
CREATE POLICY "Allow anonymous selects on event_registrations"
  ON public.event_registrations
  FOR SELECT
  TO anon
  USING (true);
