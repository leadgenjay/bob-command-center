-- Bob Command Center Schema
-- Run this in Supabase SQL Editor

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT 'task-' || extract(epoch from now())::bigint::text,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id TEXT,
  due_date TIMESTAMPTZ,
  time_estimate INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY DEFAULT 'idea-' || extract(epoch from now())::bigint::text,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'content' CHECK (category IN ('content', 'apps', 'business', 'social')),
  tags TEXT[] DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'captured' CHECK (status IN ('captured', 'developing', 'ready', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY DEFAULT 'decision-' || extract(epoch from now())::bigint::text,
  title TEXT NOT NULL,
  context TEXT,
  outcome TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY DEFAULT 'reminder-' || extract(epoch from now())::bigint::text,
  text TEXT NOT NULL,
  schedule TEXT NOT NULL,
  next_run TIMESTAMPTZ,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY DEFAULT 'trip-' || extract(epoch from now())::bigint::text,
  name TEXT NOT NULL,
  destination TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  tripit_url TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  notes JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  packing JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY DEFAULT 'doc-' || extract(epoch from now())::bigint::text,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_reminders_enabled ON reminders(enabled);

-- Enable Row Level Security (optional - disable if using anon key for simplicity)
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public access policies (if RLS enabled)
-- CREATE POLICY "Allow all" ON tasks FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON ideas FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON decisions FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON reminders FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON trips FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON documents FOR ALL USING (true);

-- Content table for storing ad transcripts, videos, etc.
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create index for full-text search on content
CREATE INDEX IF NOT EXISTS idx_content_search ON content 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(transcript, '')));

CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_folder ON content(folder);

-- Apply updated_at trigger to content
DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on content
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content
CREATE POLICY "Public read access for content" ON content FOR SELECT USING (true);
CREATE POLICY "Service role full access for content" ON content FOR ALL USING (true);
