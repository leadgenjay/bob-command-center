-- Add missing tables for Bob Command Center

-- Reminders table (if not exists)
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  schedule TEXT NOT NULL,
  next_run TIMESTAMPTZ,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table (if not exists)
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming',
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

-- Documents table (if not exists)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_reminders_enabled ON reminders(enabled);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
