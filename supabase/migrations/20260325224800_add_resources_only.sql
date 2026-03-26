-- Resources table (standalone migration)
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY DEFAULT 'resource-' || extract(epoch from now())::bigint::text,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Public access policy (use IF NOT EXISTS equivalent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resources' 
    AND policyname = 'Public read access for resources'
  ) THEN
    CREATE POLICY "Public read access for resources" ON resources FOR SELECT USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resources' 
    AND policyname = 'Service role full access for resources'
  ) THEN
    CREATE POLICY "Service role full access for resources" ON resources FOR ALL USING (true);
  END IF;
END$$;
