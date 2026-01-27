-- Bob Command Center Database Schema
-- Run this migration in Supabase SQL Editor or via CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  color TEXT NOT NULL DEFAULT '#ED0D51',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  due_date DATE,
  time_estimate INTEGER, -- in minutes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'apps' CHECK (category IN ('content', 'apps', 'business', 'social')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'captured' CHECK (status IN ('captured', 'developing', 'ready', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Preferences table (key-value store for JSON settings)
CREATE TABLE IF NOT EXISTS preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  context TEXT,
  outcome TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_preferences_key ON preferences(key);
CREATE INDEX IF NOT EXISTS idx_decisions_created ON decisions(created_at DESC);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ideas_updated_at ON ideas;
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable for production
-- For now, these are permissive policies. In production, add user_id column and proper auth.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development (allow all authenticated users)
CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all for tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all for ideas" ON ideas FOR ALL USING (true);
CREATE POLICY "Allow all for preferences" ON preferences FOR ALL USING (true);
CREATE POLICY "Allow all for decisions" ON decisions FOR ALL USING (true);

-- Sample data (optional - comment out for production)
INSERT INTO projects (name, description, status, color) VALUES
  ('Command Center', 'Personal task management dashboard', 'active', '#ED0D51'),
  ('API Gateway', 'Centralized API management service', 'active', '#8B5CF6'),
  ('Mobile App v2', 'React Native app redesign', 'paused', '#10B981')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, status, priority, time_estimate) VALUES
  ('Review PR for auth system', 'Check security implementation', 'review', 'high', 30),
  ('Design new dashboard layout', 'Create wireframes for v2', 'in_progress', 'medium', 120),
  ('Write documentation', 'API endpoints and examples', 'todo', 'medium', 60),
  ('Fix mobile responsiveness', 'Navigation menu issues on iOS', 'backlog', 'low', 45),
  ('Set up CI/CD pipeline', 'GitHub Actions workflow', 'done', 'high', 90)
ON CONFLICT DO NOTHING;

INSERT INTO ideas (title, description, category, tags, priority, status) VALUES
  ('AI-powered code review tool', 'Automate PR reviews with GPT', 'apps', ARRAY['ai', 'automation', 'developer-tools'], 'high', 'developing'),
  ('Weekly tech newsletter', 'Curated dev news and tutorials', 'content', ARRAY['writing', 'newsletter'], 'medium', 'captured'),
  ('Discord bot for team standup', 'Async standups in Slack/Discord', 'apps', ARRAY['bot', 'productivity'], 'low', 'captured'),
  ('Freelance consulting service', 'AI integration consulting', 'business', ARRAY['consulting', 'ai'], 'medium', 'developing')
ON CONFLICT DO NOTHING;

INSERT INTO decisions (title, context, outcome, tags) VALUES
  ('Use Next.js 15 for new projects', 'Evaluated between Remix, Astro, and Next.js. Next.js has better ecosystem support.', 'All new web projects will use Next.js 15 with App Router', ARRAY['tech-stack', 'frontend']),
  ('Supabase over Firebase', 'Need PostgreSQL for relational data. Firebase NoSQL is too limiting.', 'Migrating to Supabase for new backend projects', ARRAY['tech-stack', 'backend'])
ON CONFLICT DO NOTHING;
