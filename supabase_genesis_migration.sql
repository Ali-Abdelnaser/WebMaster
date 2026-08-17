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
  p_team jsonb,
  p_members jsonb,
  p_session_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_reg_id UUID;
  v_team_size INT;
  v_track TEXT;
  v_member JSONB;
  v_member_id UUID;
  v_order INT;
  v_role TEXT;
  v_national_id TEXT;
  v_front_path TEXT;
  v_back_path TEXT;
  v_expected_front_pattern TEXT;
  v_expected_back_pattern TEXT;
  v_existing_id UUID;
  v_seen_ids TEXT[] := ARRAY[]::TEXT[];
  v_seen_orders INT[] := ARRAY[]::INT[];
  v_has_leader BOOLEAN := false;
BEGIN
  -- 1. Server-side Registration Deadline Enforcement (>= boundary)
  IF NOW() >= '2026-08-27 00:00:00+03:00'::timestamptz THEN
    RAISE EXCEPTION 'GENESIS_REGISTRATION_CLOSED: The registration deadline for Genesis has passed.';
  END IF;

  -- 2. Validate Team Details
  IF TRIM(COALESCE(p_team->>'team_name', '')) = '' THEN
    RAISE EXCEPTION 'INVALID_TEAM_NAME: Team name is required.';
  END IF;

  IF TRIM(COALESCE(p_team->>'project_idea', '')) = '' THEN
    RAISE EXCEPTION 'INVALID_PROJECT_IDEA: Project description is required.';
  END IF;

  v_track := p_team->>'track';
  IF v_track NOT IN ('AI', 'Cybersecurity', 'Robotics', 'Mobile Application', 'IoT', 'Graduation Projects') THEN
    RAISE EXCEPTION 'INVALID_TRACK: Invalid track specified.';
  END IF;

  v_team_size := (p_team->>'team_size')::INT;
  IF v_team_size < 1 OR v_team_size > 5 THEN
    RAISE EXCEPTION 'INVALID_TEAM_SIZE: Team size must be between 1 and 5.';
  END IF;

  -- 3. Validate Member Count matches declared Team Size
  IF jsonb_array_length(p_members) <> v_team_size THEN
    RAISE EXCEPTION 'MEMBER_COUNT_MISMATCH: Submitted member records do not match declared team size.';
  END IF;

  -- 4. Parse Registration UUID
  BEGIN
    v_reg_id := (p_team->>'id')::UUID;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'INVALID_REGISTRATION_ID: Invalid registration UUID format.';
  END;

  IF v_reg_id IS NULL THEN
    RAISE EXCEPTION 'MISSING_REGISTRATION_ID: Registration ID is required.';
  END IF;

  -- 5. Pre-validate All Members (Duplicates, Integrity, Existence in Storage, Roles)
  FOR i IN 0..(jsonb_array_length(p_members) - 1) LOOP
    v_member := p_members->i;
    v_order := (v_member->>'member_order')::INT;
    v_role := v_member->>'role';
    v_national_id := LOWER(TRIM(COALESCE(v_member->>'national_id', '')));

    -- Parse Member UUID
    BEGIN
      v_member_id := (v_member->>'id')::UUID;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'INVALID_MEMBER_ID: Invalid member UUID format.';
    END;

    IF v_member_id IS NULL THEN
      RAISE EXCEPTION 'MISSING_MEMBER_ID: Member ID is required.';
    END IF;

    -- Order check
    IF v_order <> (i + 1) OR v_order = ANY(v_seen_orders) THEN
      RAISE EXCEPTION 'INVALID_MEMBER_ORDER: Member order sequence is invalid.';
    END IF;
    v_seen_orders := array_append(v_seen_orders, v_order);

    -- Role / Leader Integrity
    IF i = 0 THEN
      IF v_role <> 'leader' THEN
        RAISE EXCEPTION 'INVALID_LEADER: Member #1 must be designated as team leader.';
      END IF;
      v_has_leader := true;
    ELSE
      IF v_role <> 'member' THEN
        RAISE EXCEPTION 'INVALID_ROLE: Members after #1 must have the role "member".';
      END IF;
    END IF;

    -- Full Name
    IF TRIM(COALESCE(v_member->>'full_name', '')) = '' THEN
      RAISE EXCEPTION 'MISSING_MEMBER_NAME: Full name is required.';
    END IF;

    -- National ID exact 14 numeric digits
    IF v_national_id !~ '^\d{14}$' THEN
      RAISE EXCEPTION 'INVALID_NATIONAL_ID: National ID must be exactly 14 numeric digits.';
    END IF;

    -- Phone exact 11 numeric digits
    IF TRIM(COALESCE(v_member->>'phone', '')) !~ '^\d{11}$' THEN
      RAISE EXCEPTION 'INVALID_PHONE: Mobile number must be exactly 11 digits.';
    END IF;

    -- Email format
    IF TRIM(COALESCE(v_member->>'email', '')) = '' OR v_member->>'email' !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
      RAISE EXCEPTION 'INVALID_EMAIL: A valid email address is required.';
    END IF;

    -- Discord, University, Faculty, Academic Year
    IF TRIM(COALESCE(v_member->>'discord_link', '')) = '' THEN
      RAISE EXCEPTION 'MISSING_DISCORD: Discord link or handle is required.';
    END IF;
    IF TRIM(COALESCE(v_member->>'university', '')) = '' THEN
      RAISE EXCEPTION 'MISSING_UNIVERSITY: University name is required.';
    END IF;
    IF TRIM(COALESCE(v_member->>'faculty', '')) = '' THEN
      RAISE EXCEPTION 'MISSING_FACULTY: Faculty name is required.';
    END IF;
    IF v_member->>'academic_year' NOT IN ('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year') THEN
      RAISE EXCEPTION 'INVALID_ACADEMIC_YEAR: Academic year is invalid.';
    END IF;

    -- Storage Path Integrity & Relationship Checks
    v_front_path := TRIM(COALESCE(v_member->>'id_front_path', ''));
    v_back_path := TRIM(COALESCE(v_member->>'id_back_path', ''));

    v_expected_front_pattern := '^' || v_reg_id::text || '/' || v_member_id::text || '/front\.(jpg|jpeg|png|webp|heic|heif|pdf)$';
    v_expected_back_pattern := '^' || v_reg_id::text || '/' || v_member_id::text || '/back\.(jpg|jpeg|png|webp|heic|heif|pdf)$';

    IF v_front_path !~* v_expected_front_pattern THEN
      RAISE EXCEPTION 'INVALID_ID_FRONT_PATH: Storage path for ID front does not match registration identity.';
    END IF;

    IF v_back_path !~* v_expected_back_pattern THEN
      RAISE EXCEPTION 'INVALID_ID_BACK_PATH: Storage path for ID back does not match registration identity.';
    END IF;

    -- CRITICAL VERIFICATION: Both Front and Back files MUST REALLY EXIST in storage.objects
    IF NOT EXISTS (
      SELECT 1 FROM storage.objects
      WHERE bucket_id = 'genesis-id-documents' AND name = v_front_path
    ) OR NOT EXISTS (
      SELECT 1 FROM storage.objects
      WHERE bucket_id = 'genesis-id-documents' AND name = v_back_path
    ) THEN
      RAISE EXCEPTION 'ID_DOCUMENT_MISSING: ID document file is missing in storage.';
    END IF;

    -- Duplicate check within submitted team (no PII in error)
    IF v_national_id = ANY(v_seen_ids) THEN
      RAISE EXCEPTION 'DUPLICATE_NATIONAL_ID_IN_TEAM: Multiple members in your team have the same National ID.';
    END IF;
    v_seen_ids := array_append(v_seen_ids, v_national_id);

    -- Duplicate check across all existing Genesis registrations (no PII in error)
    SELECT id INTO v_existing_id
    FROM public.genesis_team_members
    WHERE LOWER(TRIM(national_id)) = v_national_id
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
      RAISE EXCEPTION 'DUPLICATE_PARTICIPANT: A participant in your team is already registered in another Genesis team.';
    END IF;
  END LOOP;

  IF NOT v_has_leader THEN
    RAISE EXCEPTION 'MISSING_LEADER: Team registration must include a leader.';
  END IF;

  -- 6. Insert Registration Record
  INSERT INTO public.genesis_registrations (
    id,
    team_name,
    project_idea,
    demo_video_url,
    track,
    team_size
  ) VALUES (
    v_reg_id,
    TRIM(p_team->>'team_name'),
    TRIM(p_team->>'project_idea'),
    NULLIF(TRIM(p_team->>'demo_video_url'), ''),
    v_track,
    v_team_size
  );

  -- 7. Insert Team Member Records
  FOR i IN 0..(jsonb_array_length(p_members) - 1) LOOP
    v_member := p_members->i;

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
      (v_member->>'id')::UUID,
      v_reg_id,
      (v_member->>'member_order')::INT,
      v_member->>'role',
      TRIM(v_member->>'full_name'),
      TRIM(v_member->>'national_id'),
      TRIM(v_member->>'phone'),
      LOWER(TRIM(v_member->>'email')),
      TRIM(v_member->>'discord_link'),
      TRIM(v_member->>'university'),
      TRIM(v_member->>'faculty'),
      v_member->>'academic_year',
      TRIM(v_member->>'id_front_path'),
      TRIM(v_member->>'id_back_path')
    );
  END LOOP;

  -- 8. Mark upload session consumed if session_id provided
  IF p_session_id IS NOT NULL THEN
    UPDATE public.genesis_upload_sessions
    SET consumed = true
    WHERE id = p_session_id;
  END IF;

  -- 9. Return Clean Result (no PII)
  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_reg_id,
    'team_name', TRIM(p_team->>'team_name'),
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
