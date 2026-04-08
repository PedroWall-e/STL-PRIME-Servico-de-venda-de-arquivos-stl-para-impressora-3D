-- Supabase Required Schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS graphql;
CREATE SCHEMA IF NOT EXISTS graphql_public;
CREATE SCHEMA IF NOT EXISTS realtime;

-- Supabase extensions (often required by auth or storage)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgjwt" SCHEMA public;

-- Initialize Storage baseline (so migrations have something to alter)
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text not null primary key,
  name text not null unique,
  owner uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  public boolean default false,
  avif_autodetection boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid not null default uuid_generate_v4() primary key,
  bucket_id text references storage.buckets(id),
  name text,
  owner uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_accessed_at timestamptz default now(),
  metadata jsonb,
  version text
);
CREATE UNIQUE INDEX IF NOT EXISTS bucketid_objname ON storage.objects (bucket_id, name);

-- Supabase required roles
DO $$
BEGIN
  CREATE ROLE anon NOLOGIN NOINHERIT;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN RAISE NOTICE 'not creating role anon -- it already exists';
END
$$;

DO $$
BEGIN
  CREATE ROLE authenticated NOLOGIN NOINHERIT;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN RAISE NOTICE 'not creating role authenticated -- it already exists';
END
$$;

DO $$
BEGIN
  CREATE ROLE service_role NOLOGIN NOINHERIT;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN RAISE NOTICE 'not creating role service_role -- it already exists';
END
$$;

