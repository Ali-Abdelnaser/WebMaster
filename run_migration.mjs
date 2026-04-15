// Run the event_registrations table migration via Supabase REST API
// Usage: node run_migration.mjs

import fs from 'fs';

// Parse .env file
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) {
        env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY; // Need service_role for DDL, but let's try anon first

// SQL statements to run individually
const statements = [
  `CREATE TABLE IF NOT EXISTS public.event_registrations (
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
  )`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_event_reg_email') THEN
      ALTER TABLE public.event_registrations ADD CONSTRAINT unique_event_reg_email UNIQUE (email);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_event_reg_phone') THEN
      ALTER TABLE public.event_registrations ADD CONSTRAINT unique_event_reg_phone UNIQUE (phone);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_event_reg_national_id') THEN
      ALTER TABLE public.event_registrations ADD CONSTRAINT unique_event_reg_national_id UNIQUE (national_id);
    END IF;
  END $$`,
  `ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous inserts on event_registrations') THEN
      CREATE POLICY "Allow anonymous inserts on event_registrations"
        ON public.event_registrations FOR INSERT TO anon WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous selects on event_registrations') THEN
      CREATE POLICY "Allow anonymous selects on event_registrations"
        ON public.event_registrations FOR SELECT TO anon USING (true);
    END IF;
  END $$`
];

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ query: sql })
  });
  return res;
}

async function main() {
  console.log('🚀 Running event_registrations migration...\n');
  console.log(`URL: ${SUPABASE_URL}`);
  
  // Try using the Supabase SQL endpoint directly
  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i];
    const label = sql.substring(0, 60).replace(/\n/g, ' ').trim();
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({})
      });
      
      console.log(`[${i+1}/${statements.length}] ${label}... Status: ${res.status}`);
    } catch (err) {
      console.log(`[${i+1}/${statements.length}] ${label}... Error: ${err.message}`);
    }
  }
  
  console.log('\n⚠️  Note: The Supabase REST API (anon key) cannot run DDL statements.');
  console.log('📋 Please run the SQL manually in Supabase Dashboard > SQL Editor.');
  console.log('📝 File: supabase_event_registrations_migration.sql');
}

main();
