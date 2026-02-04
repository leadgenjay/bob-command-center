-- Add content table for storing ad transcripts and videos
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  folder TEXT,
  drive_url TEXT,
  drive_id TEXT,
  headline TEXT,
  transcript TEXT,
  content_type TEXT NOT NULL DEFAULT 'ad',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_content_search ON content 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(transcript, '')));

CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_folder ON content(folder);

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for content" ON content FOR SELECT USING (true);
CREATE POLICY "Service role full access for content" ON content FOR ALL USING (true);
