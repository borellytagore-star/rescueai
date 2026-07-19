/*
# RescueAI — initial schema

## Overview
Creates the full data layer for the RescueAI emergency response app. The app has
NO sign-in screen, so this is a single-tenant schema: every table is readable and
writable by the anon-key frontend client. There are no `user_id` columns and no
foreign keys to `auth.users`.

## New Tables

1. `emergencies`
   - Core emergency report record.
   - `id` uuid PK
   - `description` text — what the user reported
   - `type` text — emergency category (cardiac, respiratory, trauma, burn, stroke,
     bleeding, fracture, allergic, poisoning, other)
   - `severity` text — low | moderate | high | critical
   - `status` text — active | resolved | archived (default active)
   - `lat` numeric, `lng` numeric, `location_label` text — geolocation
   - `image_uri` text — data URI of uploaded scene photo
   - `voice_transcript` text — transcribed voice report
   - `created_at` timestamptz (default now())
   - `resolved_at` timestamptz — set when status moves to resolved

2. `emergency_analyses`
   - AI analysis result for one emergency (1:1 with emergencies).
   - `id` uuid PK
   - `emergency_id` uuid FK → emergencies(id) ON DELETE CASCADE
   - `emergency_type` text, `severity` text, `confidence` int, `risk_score` int
   - `recommended_action` text, `response_priority` text, `warning` text
   - `created_at` timestamptz

3. `first_aid_steps`
   - Ordered first-aid steps attached to an analysis.
   - `id` uuid PK
   - `analysis_id` uuid FK → emergency_analyses(id) ON DELETE CASCADE
   - `step_number` int, `title` text, `description` text

4. `first_aid_dos_donts`
   - Do's and Don'ts lists for an analysis.
   - `id` uuid PK
   - `analysis_id` uuid FK → emergency_analyses(id) ON DELETE CASCADE
   - `kind` text — 'do' | 'dont'
   - `text` text

5. `emergency_contacts`
   - User's saved emergency contacts (managed in Settings).
   - `id` uuid PK
   - `name` text, `relation` text, `phone` text
   - `created_at` timestamptz

6. `user_settings`
   - App preferences. Single row (enforced by app logic).
   - `id` uuid PK (always a fixed sentinel)
   - `language` text (en | es | fr | hi, default en)
   - `theme` text (light | dark | system, default system)
   - `high_contrast` boolean (default false)
   - `voice_navigation` boolean (default false)
   - `notifications` boolean (default true)
   - `updated_at` timestamptz

7. `user_profile`
   - Medical profile shared with responders during an emergency.
   - `id` uuid PK (single row)
   - `name` text, `blood_type` text, `allergies` text, `medical_conditions` text
   - `updated_at` timestamptz

8. `facilities`
   - Cached nearby-help facilities (hospitals, police, fire, shelters).
   - `id` uuid PK
   - `name` text, `type` text (hospital | police | fire | shelter)
   - `lat` numeric, `lng` numeric, `address` text, `phone` text
   - `open_24h` boolean, `rating` numeric
   - `created_at` timestamptz

## Security
- RLS enabled on every table.
- All policies use `TO anon, authenticated` because this is a single-tenant,
  no-auth app and the data is intentionally shared with the anon-key client.
- 4 policies per table (SELECT / INSERT / UPDATE / DELETE).

## Notes
1. No `user_id` columns — no sign-in screen in the app.
2. Foreign keys use ON DELETE CASCADE so deleting an emergency also removes its
   analysis, first-aid steps, and do's/don'ts automatically.
3. Indexes added on `emergencies.created_at` and `emergency_analyses.emergency_id`
   for the common query paths.
*/

-- 1. emergencies
CREATE TABLE IF NOT EXISTS emergencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL DEFAULT '',
  type text,
  severity text,
  status text NOT NULL DEFAULT 'active',
  lat numeric,
  lng numeric,
  location_label text,
  image_uri text,
  voice_transcript text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_emergencies_created_at
  ON emergencies (created_at DESC);

ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_emergencies" ON emergencies;
CREATE POLICY "anon_select_emergencies" ON emergencies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_emergencies" ON emergencies;
CREATE POLICY "anon_insert_emergencies" ON emergencies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_emergencies" ON emergencies;
CREATE POLICY "anon_update_emergencies" ON emergencies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_emergencies" ON emergencies;
CREATE POLICY "anon_delete_emergencies" ON emergencies FOR DELETE
  TO anon, authenticated USING (true);

-- 2. emergency_analyses
CREATE TABLE IF NOT EXISTS emergency_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id uuid NOT NULL REFERENCES emergencies(id) ON DELETE CASCADE,
  emergency_type text NOT NULL,
  severity text NOT NULL,
  confidence int NOT NULL DEFAULT 0,
  risk_score int NOT NULL DEFAULT 0,
  recommended_action text NOT NULL DEFAULT '',
  response_priority text NOT NULL DEFAULT 'standard',
  warning text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_emergency_analyses_emergency_id
  ON emergency_analyses (emergency_id);

ALTER TABLE emergency_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_emergency_analyses" ON emergency_analyses;
CREATE POLICY "anon_select_emergency_analyses" ON emergency_analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_emergency_analyses" ON emergency_analyses;
CREATE POLICY "anon_insert_emergency_analyses" ON emergency_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_emergency_analyses" ON emergency_analyses;
CREATE POLICY "anon_update_emergency_analyses" ON emergency_analyses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_emergency_analyses" ON emergency_analyses;
CREATE POLICY "anon_delete_emergency_analyses" ON emergency_analyses FOR DELETE
  TO anon, authenticated USING (true);

-- 3. first_aid_steps
CREATE TABLE IF NOT EXISTS first_aid_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES emergency_analyses(id) ON DELETE CASCADE,
  step_number int NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_first_aid_steps_analysis_id
  ON first_aid_steps (analysis_id);

ALTER TABLE first_aid_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_first_aid_steps" ON first_aid_steps;
CREATE POLICY "anon_select_first_aid_steps" ON first_aid_steps FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_first_aid_steps" ON first_aid_steps;
CREATE POLICY "anon_insert_first_aid_steps" ON first_aid_steps FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_first_aid_steps" ON first_aid_steps;
CREATE POLICY "anon_update_first_aid_steps" ON first_aid_steps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_first_aid_steps" ON first_aid_steps;
CREATE POLICY "anon_delete_first_aid_steps" ON first_aid_steps FOR DELETE
  TO anon, authenticated USING (true);

-- 4. first_aid_dos_donts
CREATE TABLE IF NOT EXISTS first_aid_dos_donts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES emergency_analyses(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('do', 'dont')),
  text text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_first_aid_dos_donts_analysis_id
  ON first_aid_dos_donts (analysis_id);

ALTER TABLE first_aid_dos_donts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_first_aid_dos_donts" ON first_aid_dos_donts;
CREATE POLICY "anon_select_first_aid_dos_donts" ON first_aid_dos_donts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_first_aid_dos_donts" ON first_aid_dos_donts;
CREATE POLICY "anon_insert_first_aid_dos_donts" ON first_aid_dos_donts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_first_aid_dos_donts" ON first_aid_dos_donts;
CREATE POLICY "anon_update_first_aid_dos_donts" ON first_aid_dos_donts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_first_aid_dos_donts" ON first_aid_dos_donts;
CREATE POLICY "anon_delete_first_aid_dos_donts" ON first_aid_dos_donts FOR DELETE
  TO anon, authenticated USING (true);

-- 5. emergency_contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  relation text NOT NULL DEFAULT '',
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_emergency_contacts" ON emergency_contacts;
CREATE POLICY "anon_select_emergency_contacts" ON emergency_contacts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_emergency_contacts" ON emergency_contacts;
CREATE POLICY "anon_insert_emergency_contacts" ON emergency_contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_emergency_contacts" ON emergency_contacts;
CREATE POLICY "anon_update_emergency_contacts" ON emergency_contacts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_emergency_contacts" ON emergency_contacts;
CREATE POLICY "anon_delete_emergency_contacts" ON emergency_contacts FOR DELETE
  TO anon, authenticated USING (true);

-- 6. user_settings
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  language text NOT NULL DEFAULT 'en',
  theme text NOT NULL DEFAULT 'system',
  high_contrast boolean NOT NULL DEFAULT false,
  voice_navigation boolean NOT NULL DEFAULT false,
  notifications boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_user_settings" ON user_settings;
CREATE POLICY "anon_select_user_settings" ON user_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_settings" ON user_settings;
CREATE POLICY "anon_insert_user_settings" ON user_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_user_settings" ON user_settings;
CREATE POLICY "anon_update_user_settings" ON user_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_settings" ON user_settings;
CREATE POLICY "anon_delete_user_settings" ON user_settings FOR DELETE
  TO anon, authenticated USING (true);

-- 7. user_profile
CREATE TABLE IF NOT EXISTS user_profile (
  id uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  name text NOT NULL DEFAULT '',
  blood_type text NOT NULL DEFAULT '',
  allergies text NOT NULL DEFAULT '',
  medical_conditions text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_user_profile" ON user_profile;
CREATE POLICY "anon_select_user_profile" ON user_profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_profile" ON user_profile;
CREATE POLICY "anon_insert_user_profile" ON user_profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_user_profile" ON user_profile;
CREATE POLICY "anon_update_user_profile" ON user_profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_profile" ON user_profile;
CREATE POLICY "anon_delete_user_profile" ON user_profile FOR DELETE
  TO anon, authenticated USING (true);

-- 8. facilities
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hospital', 'police', 'fire', 'shelter')),
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  open_24h boolean NOT NULL DEFAULT true,
  rating numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities (type);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_facilities" ON facilities;
CREATE POLICY "anon_select_facilities" ON facilities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_facilities" ON facilities;
CREATE POLICY "anon_insert_facilities" ON facilities FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_facilities" ON facilities;
CREATE POLICY "anon_update_facilities" ON facilities FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_facilities" ON facilities;
CREATE POLICY "anon_delete_facilities" ON facilities FOR DELETE
  TO anon, authenticated USING (true);
