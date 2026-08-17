-- ================================================================
-- Genesis (Version 1) - Complete Database Schema, Sessions & Policies
-- Migration file for IEEE MET SB Genesis Competition (Phase 2.2 Final)
-- ================================================================

-- 1. Create genesis_registrations table
CREATE TABLE IF NOT EXISTS public.genesis_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT,
  team_name TEXT NOT NULL,
  project_idea TEXT NOT NULL,
  demo_video_url TEXT,
  track TEXT NOT NULL CHECK (track IN ('AI', 'Cybersecurity', 'Robotics', 'Mobile Application', 'IoT', 'Graduation Projects')),
  team_size SMALLINT NOT NULL CHECK (team_size BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create genesis_team_members table
CREATE TABLE IF NOT EXISTS public.genesis_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.genesis_registrations(id) ON DELETE CASCADE,
  member_order SMALLINT NOT NULL CHECK (member_order BETWEEN 1 AND 5),
  role TEXT NOT NULL CHECK (role IN ('leader', 'member')),
  full_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  discord_link TEXT NOT NULL,
  university TEXT NOT NULL,
  faculty TEXT NOT NULL,
  academic_year TEXT NOT NULL CHECK (academic_year IN ('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year')),
  id_front_path TEXT NULL,
  id_back_path TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create genesis_upload_sessions table (Temporary pre-authorized upload tickets)
CREATE TABLE IF NOT EXISTS public.genesis_upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL,
  authorized_paths TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed BOOLEAN DEFAULT false
);

-- 4. Indexes & Constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_genesis_member_national_id ON public.genesis_team_members (LOWER(TRIM(national_id)));
CREATE INDEX IF NOT EXISTS idx_genesis_member_reg_id ON public.genesis_team_members (registration_id);
CREATE INDEX IF NOT EXISTS idx_genesis_reg_track ON public.genesis_registrations (track);
CREATE UNIQUE INDEX IF NOT EXISTS idx_genesis_registrations_reference_number ON public.genesis_registrations(reference_number) WHERE reference_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_genesis_sessions_reg_id ON public.genesis_upload_sessions (registration_id);
CREATE INDEX IF NOT EXISTS idx_genesis_sessions_expires ON public.genesis_upload_sessions (expires_at);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_genesis_reg_member_order'
  ) THEN
    ALTER TABLE public.genesis_team_members
      ADD CONSTRAINT uq_genesis_reg_member_order UNIQUE (registration_id, member_order);
  END IF;
END $$;

-- 5. Enable RLS on all tables (No public direct SELECT or direct INSERT policies)
ALTER TABLE public.genesis_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genesis_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genesis_upload_sessions ENABLE ROW LEVEL SECURITY;

-- 6. Storage bucket for private ID documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'genesis-id-documents',
  'genesis-id-documents',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

-- 7. Controlled Storage Policy (Strict Session-Authorized INSERT only, NO anon SELECT, NO anon direct DELETE)
DROP POLICY IF EXISTS "Allow anonymous upload to genesis-id-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous delete to genesis-id-documents" ON storage.objects;
DROP POLICY IF EXISTS "Hardened upload to genesis-id-documents" ON storage.objects;
DROP POLICY IF EXISTS "Hardened delete cleanup to genesis-id-documents" ON storage.objects;

-- 9. Storage RLS Helper (SECURITY DEFINER to verify authorization without table leakage)
CREATE OR REPLACE FUNCTION public.is_genesis_upload_path_authorized(p_name text)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  IF now() >= '2026-08-27 00:00:00+03:00'::timestamptz THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.genesis_upload_sessions s
    WHERE s.consumed = false
      AND s.expires_at > now()
      AND p_name = ANY (s.authorized_paths)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_genesis_upload_path_authorized(text) TO anon, authenticated, public;

-- 10. Storage RLS Policies for genesis-id-documents
DROP POLICY IF EXISTS "Genesis session authorized upload" ON storage.objects;
CREATE POLICY "Genesis session authorized upload" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'genesis-id-documents'
  AND public.is_genesis_upload_path_authorized(name)
);

DROP POLICY IF EXISTS "Genesis session authorized update" ON storage.objects;
CREATE POLICY "Genesis session authorized update" ON storage.objects
FOR UPDATE TO anon, authenticated
USING (
  bucket_id = 'genesis-id-documents'
  AND public.is_genesis_upload_path_authorized(name)
)
WITH CHECK (
  bucket_id = 'genesis-id-documents'
  AND public.is_genesis_upload_path_authorized(name)
);

-- 8. RPC: create_genesis_upload_session
CREATE OR REPLACE FUNCTION public.create_genesis_upload_session(
  p_team_size INT,
  p_file_specs JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_reg_id UUID := gen_random_uuid();
  v_session_id UUID := gen_random_uuid();
  v_expires_at TIMESTAMPTZ;
  v_deadline TIMESTAMPTZ := '2026-08-27 00:00:00+03:00'::timestamptz;
  v_members JSONB := '[]'::jsonb;
  v_paths TEXT[] := ARRAY[]::TEXT[];
  v_spec JSONB;
  v_member_id UUID;
  v_order INT;
  v_front_ext TEXT;
  v_back_ext TEXT;
  v_front_path TEXT;
  v_back_path TEXT;
  v_allowed_exts TEXT[] := ARRAY['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf'];
BEGIN
  -- Strict Deadline Check (>= boundary)
  IF NOW() >= v_deadline THEN
    RAISE EXCEPTION 'GENESIS_REGISTRATION_CLOSED: The registration deadline for Genesis has passed.';
  END IF;

  -- Validate team size (1-5)
  IF p_team_size < 1 OR p_team_size > 5 THEN
    RAISE EXCEPTION 'INVALID_TEAM_SIZE: Team size must be between 1 and 5.';
  END IF;

  IF jsonb_array_length(p_file_specs) <> p_team_size THEN
    RAISE EXCEPTION 'MEMBER_COUNT_MISMATCH: File specifications do not match team size.';
  END IF;

  -- Session expiration: 15 mins or deadline, whichever is earlier
  v_expires_at := LEAST(NOW() + INTERVAL '15 minutes', v_deadline);

  -- Generate identities and authorize exact Front/Back paths
  FOR i IN 0..(p_team_size - 1) LOOP
    v_spec := p_file_specs->i;
    v_order := i + 1;
    v_member_id := gen_random_uuid();

    v_front_ext := LOWER(TRIM(COALESCE(v_spec->>'front_ext', 'jpg')));
    v_back_ext := LOWER(TRIM(COALESCE(v_spec->>'back_ext', 'jpg')));

    IF NOT (v_front_ext = ANY(v_allowed_exts)) OR NOT (v_back_ext = ANY(v_allowed_exts)) THEN
      RAISE EXCEPTION 'INVALID_FILE_TYPE: Unsupported file extension.';
    END IF;

    v_front_path := v_reg_id::text || '/' || v_member_id::text || '/front.' || v_front_ext;
    v_back_path := v_reg_id::text || '/' || v_member_id::text || '/back.' || v_back_ext;

    v_paths := array_append(v_paths, v_front_path);
    v_paths := array_append(v_paths, v_back_path);

    v_members := v_members || jsonb_build_object(
      'member_order', v_order,
      'member_id', v_member_id,
      'front_path', v_front_path,
      'back_path', v_back_path
    );
  END LOOP;

  -- Record session
  INSERT INTO public.genesis_upload_sessions (
    id,
    registration_id,
    authorized_paths,
    expires_at
  ) VALUES (
    v_session_id,
    v_reg_id,
    v_paths,
    v_expires_at
  );

  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'registration_id', v_reg_id,
    'members', v_members,
    'expires_at', v_expires_at
  );
END;
$$;

-- 9. RPC: cleanup_genesis_session_files
CREATE OR REPLACE FUNCTION public.cleanup_genesis_session_files(
  p_session_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_session RECORD;
BEGIN
  SELECT * INTO v_session
  FROM public.genesis_upload_sessions
  WHERE id = p_session_id AND consumed = false;

  IF FOUND THEN
    PERFORM set_config('storage.allow_delete_query', 'true', true);

    DELETE FROM storage.objects
    WHERE bucket_id = 'genesis-id-documents'
      AND name = ANY(v_session.authorized_paths);

    DELETE FROM public.genesis_upload_sessions
    WHERE id = p_session_id;

    RETURN jsonb_build_object('success', true, 'cleaned', true);
  END IF;

  RETURN jsonb_build_object('success', false, 'cleaned', false);
END;
$$;

-- 10. RPC: register_genesis_team (with document existence check and deadline >= boundary)
CREATE OR REPLACE FUNCTION public.register_genesis_team(
  p_team JSONB,
  p_members JSONB,
  p_session_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reg_id UUID;
  v_team_size INT;
  v_track TEXT;
  v_team_name TEXT;
  v_project_idea TEXT;
  v_demo_url TEXT;
  v_reference_number TEXT;
  v_deadline TIMESTAMPTZ := '2026-08-27 00:00:00+03:00'::timestamptz;
  v_allowed_tracks TEXT[] := ARRAY['AI', 'Cybersecurity', 'Robotics', 'Mobile Application', 'IoT', 'Graduation Projects'];
  v_allowed_years TEXT[] := ARRAY['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
  v_member JSONB;
  v_national_id TEXT;
  v_email TEXT;
  v_phone TEXT;
  v_full_name TEXT;
  v_discord TEXT;
  v_univ TEXT;
  v_faculty TEXT;
  v_year TEXT;
  v_role TEXT;
  v_order INT;
  v_seen_ids TEXT[] := ARRAY[]::TEXT[];
  v_now_hex TEXT;
  v_rand_hex TEXT;
BEGIN
  -- 1. Strict Deadline Check
  IF NOW() >= v_deadline THEN
    RAISE EXCEPTION 'GENESIS_REGISTRATION_CLOSED: The registration deadline for Genesis has passed.';
  END IF;

  -- 2. Validate Team Structure
  v_team_name := TRIM(COALESCE(p_team->>'team_name', ''));
  v_project_idea := TRIM(COALESCE(p_team->>'project_idea', ''));
  v_demo_url := TRIM(COALESCE(p_team->>'demo_video_url', ''));
  v_track := TRIM(COALESCE(p_team->>'track', ''));
  v_team_size := (p_team->>'team_size')::INT;

  IF v_team_name = '' THEN
    RAISE EXCEPTION 'INVALID_TEAM_NAME: Team name is required.';
  END IF;

  IF v_project_idea = '' THEN
    RAISE EXCEPTION 'INVALID_PROJECT_IDEA: Project description is required.';
  END IF;

  IF v_demo_url = '' THEN
    RAISE EXCEPTION 'VIDEO_REQUIRED: Project explanation video link is required.';
  END IF;

  IF NOT (v_demo_url ~* '^https?://.+') THEN
    RAISE EXCEPTION 'INVALID_VIDEO_URL: Please enter a valid public video URL (starting with http:// or https://).';
  END IF;

  IF v_team_size < 1 OR v_team_size > 5 THEN
    RAISE EXCEPTION 'INVALID_TEAM_SIZE: Team size must be between 1 and 5 members.';
  END IF;

  IF NOT (v_track = ANY(v_allowed_tracks)) THEN
    RAISE EXCEPTION 'INVALID_TRACK: Selected track is not supported in Genesis.';
  END IF;

  IF jsonb_array_length(p_members) <> v_team_size THEN
    RAISE EXCEPTION 'MEMBER_COUNT_MISMATCH: Provided members array does not match team size.';
  END IF;

  -- Registration UUID
  v_reg_id := COALESCE((p_team->>'id')::UUID, gen_random_uuid());

  -- 3. Validate Every Member
  FOR i IN 0..(v_team_size - 1) LOOP
    v_member := p_members->i;
    v_order := i + 1;
    v_role := CASE WHEN i = 0 THEN 'leader' ELSE 'member' END;

    v_full_name := TRIM(COALESCE(v_member->>'full_name', ''));
    v_national_id := TRIM(COALESCE(v_member->>'national_id', ''));
    v_phone := TRIM(COALESCE(v_member->>'phone', ''));
    v_email := LOWER(TRIM(COALESCE(v_member->>'email', '')));
    v_discord := TRIM(COALESCE(v_member->>'discord_link', ''));
    v_univ := TRIM(COALESCE(v_member->>'university', ''));
    v_faculty := TRIM(COALESCE(v_member->>'faculty', ''));
    v_year := TRIM(COALESCE(v_member->>'academic_year', ''));

    -- Required Fields & Format Checks
    IF v_full_name = '' THEN
      RAISE EXCEPTION 'MISSING_FIELD: Full name is required for member #%.', v_order;
    END IF;

    IF NOT (v_national_id ~ '^[0-9]{14}$') THEN
      RAISE EXCEPTION 'INVALID_NATIONAL_ID: National ID must be exactly 14 digits for member #%.', v_order;
    END IF;

    IF NOT (v_phone ~ '^[0-9]{11}$') THEN
      RAISE EXCEPTION 'INVALID_PHONE: Mobile number must be exactly 11 digits for member #%.', v_order;
    END IF;

    IF NOT (v_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
      RAISE EXCEPTION 'INVALID_EMAIL: Valid email is required for member #%.', v_order;
    END IF;

    IF v_discord = '' THEN
      RAISE EXCEPTION 'MISSING_FIELD: Discord handle is required for member #%.', v_order;
    END IF;

    IF v_univ = '' OR v_faculty = '' THEN
      RAISE EXCEPTION 'MISSING_FIELD: University and Faculty are required for member #%.', v_order;
    END IF;

    IF NOT (v_year = ANY(v_allowed_years)) THEN
      RAISE EXCEPTION 'INVALID_ACADEMIC_YEAR: Academic year is invalid for member #%.', v_order;
    END IF;

    -- Intra-Team Duplicate National ID Check
    IF v_national_id = ANY(v_seen_ids) THEN
      RAISE EXCEPTION 'DUPLICATE_NATIONAL_ID_IN_TEAM: Duplicate National ID detected within the same team.';
    END IF;
    v_seen_ids := array_append(v_seen_ids, v_national_id);

    -- Cross-Team Duplicate Participant Check
    IF EXISTS (SELECT 1 FROM public.genesis_team_members WHERE national_id = v_national_id) THEN
      RAISE EXCEPTION 'DUPLICATE_PARTICIPANT: A participant in this team is already registered in Genesis.';
    END IF;
  END LOOP;

  -- 4. Generate Unique Reference Number
  v_now_hex := TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT);
  v_rand_hex := UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 4));
  v_reference_number := 'GEN-' || UPPER(SUBSTRING(v_now_hex FROM LENGTH(v_now_hex) - 3)) || '-' || v_rand_hex;

  -- 5. Insert Team Registration
  INSERT INTO public.genesis_registrations (
    id,
    team_name,
    project_idea,
    demo_video_url,
    track,
    team_size,
    reference_number
  ) VALUES (
    v_reg_id,
    v_team_name,
    v_project_idea,
    v_demo_url,
    v_track,
    v_team_size,
    v_reference_number
  );

  -- 6. Insert All Team Members
  FOR i IN 0..(v_team_size - 1) LOOP
    v_member := p_members->i;
    v_order := i + 1;
    v_role := CASE WHEN i = 0 THEN 'leader' ELSE 'member' END;

    INSERT INTO public.genesis_team_members (
      id,
      registration_id,
      member_order,
      role,
      full_name,
      national_id,
      phone,
      email,
      discord_link,
      university,
      faculty,
      academic_year,
      id_front_path,
      id_back_path
    ) VALUES (
      COALESCE((v_member->>'id')::UUID, gen_random_uuid()),
      v_reg_id,
      v_order,
      v_role,
      TRIM(v_member->>'full_name'),
      TRIM(v_member->>'national_id'),
      TRIM(v_member->>'phone'),
      LOWER(TRIM(v_member->>'email')),
      TRIM(v_member->>'discord_link'),
      TRIM(v_member->>'university'),
      TRIM(v_member->>'faculty'),
      TRIM(v_member->>'academic_year'),
      NULLIF(TRIM(COALESCE(v_member->>'id_front_path', '')), ''),
      NULLIF(TRIM(COALESCE(v_member->>'id_back_path', '')), '')
    );
  END LOOP;

  -- 7. Mark upload session consumed if one was passed
  IF p_session_id IS NOT NULL THEN
    UPDATE public.genesis_upload_sessions
    SET consumed = true
    WHERE id = p_session_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_reg_id,
    'reference_number', v_reference_number,
    'team_name', v_team_name,
    'track', v_track,
    'team_size', v_team_size
  );
END;
$$;

-- 11. Explicit Permissions Management
REVOKE ALL ON FUNCTION public.create_genesis_upload_session(INT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_genesis_upload_session(INT, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.cleanup_genesis_session_files(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_genesis_session_files(UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.register_genesis_team(JSONB, JSONB, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_genesis_team(JSONB, JSONB, UUID) TO anon, authenticated;
